import { useCallback, useEffect, useRef, useState } from 'react';
import Storage from 'expo-sqlite/kv-store';

export interface Identified { id: string }
interface Envelope<T> { version: 1; records: T[] }

/**
 * Per-installation local data store. Each consumer app has a distinct OS sandbox.
 * Persists mutations before updating in-memory state; serializes concurrent writes.
 * Not multi-device sync, encrypted cloud storage, or a transactional relational database.
 */
export function useLocalRecords<T extends Identified>(namespace: string) {
  const key = 'foundry.' + namespace + '.v1';
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const live = useRef(false);
  const ready = useRef(false);
  const current = useRef<T[]>([]);
  const writes = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    live.current = true;
    ready.current = false;
    setLoading(true);
    Storage.getItem(key).then((raw) => {
      if (!mounted) return;
      const parsed: unknown = raw ? JSON.parse(raw) : { version: 1, records: [] };
      if (typeof parsed !== 'object' || !parsed || !('version' in parsed) ||
        parsed.version !== 1 || !('records' in parsed) || !Array.isArray(parsed.records)) {
        throw new Error('Saved data format is unsupported; do not overwrite it.');
      }
      // Schema-specific validation belongs to each app before editing a record.
      current.current = parsed.records as T[];
      setRecords(current.current);
      ready.current = true;
      setError(null);
    }).catch((failure: unknown) => {
      if (mounted) setError(failure instanceof Error ? failure.message : 'Could not open local data');
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; live.current = false; ready.current = false; };
  }, [key]);

  const change = useCallback(async (transform: (previous: readonly T[]) => T[]) => {
    const task = writes.current.catch(() => undefined).then(async () => {
      if (!ready.current) throw new Error('Data is not ready for editing');
      const next = transform(current.current);
      if (next.length > 10000) throw new RangeError('This app supports up to 10,000 records');
      await Storage.setItem(key, JSON.stringify({ version: 1, records: next } satisfies Envelope<T>));
      current.current = next;
      if (live.current) { setRecords(next); setError(null); }
    });
    writes.current = task.catch(() => undefined);
    try { await task; }
    catch (failure) {
      if (live.current) setError(failure instanceof Error ? failure.message : 'Could not save data');
      throw failure;
    }
  }, [key]);

  const add = useCallback((record: T) => change((previous) => {
    if (previous.some((r) => r.id === record.id)) throw new Error('Duplicate item ID');
    return [record, ...previous];
  }), [change]);
  const remove = useCallback((id: string) => change((previous) => previous.filter((r) => r.id !== id)), [change]);
  const update = useCallback((id: string, edit: (previous: T) => T) => change((previous) =>
    previous.map((r) => r.id === id ? edit(r) : r)), [change]);
  return { records, loading, error, add, remove, update, change };
}
