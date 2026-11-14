import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { listShifts } from '../data/repository';
import { toCSV } from '../domain/roster';

export async function shareRosterCSV(): Promise<number> {
  const shifts = await listShifts();
  if (!(await Sharing.isAvailableAsync())) throw new Error('File sharing is not available on this device.');
  const file = new File(Paths.cache, 'shift-calendar-export.csv');
  file.create({ overwrite: true });
  await file.write(toCSV(shifts));
  await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: 'Export shift calendar' });
  return shifts.length;
}
