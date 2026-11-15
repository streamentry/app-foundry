/**
 * Report only observed anonymous human evidence; never generate fictitious test subjects.
 * npm run retainer:pilot [-- path/to/results.json]
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const SCENARIOS = Object.freeze({
  A: { openingMinutes: 750, extraMinutes: 120, workMinutes: [675, 240], expectedMinutes: -45 },
  B: { openingMinutes: 1110, extraMinutes: 105, workMinutes: [740, 410], expectedMinutes: 65 },
});
const HARD = new Set(['trial_scheduled', 'imported_real_data', 'paid']);
const COMMITMENTS = new Set([...HARD, 'none', 'verbal_only']);
const ORDERS = new Set(['baseline_first', 'app_first']);
const blank = x => x === null || x === undefined || x === '';
const median = numbers => {
  if (!numbers.length) return null;
  const a = [...numbers].sort((x, y) => x - y);
  return a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length/2 - 1] + a[a.length/2]) / 2;
};
const validSeconds = x => Number.isSafeInteger(x) && x > 0 && x <= 7200;
const validTimestamp = x => {
  if (typeof x !== 'string' || !Number.isFinite(Date.parse(x))) return false;
  return new Date(x).toISOString() === x;
};

export function evaluatePilot(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) ||
      data.schema !== 1 || data.study !== 'retainer-hours-5-person-v1' ||
      !Array.isArray(data.participants) || data.participants.length !== 5)
    throw new TypeError('Expected the five-person version 1 observation sheet');

  const ids = new Set();
  const completed = [];
  const missing = [];

  for (const row of data.participants) {
    if (!row || typeof row !== 'object' || Array.isArray(row) ||
        typeof row.id !== 'string' || !/^P0[1-5]$/.test(row.id) || ids.has(row.id))
      throw new TypeError('Participant slots must be unique IDs P01–P05');
    ids.add(row.id);
    if (!ORDERS.has(row.order) || !['A','B'].includes(row.baselineScenario) ||
        !['A','B'].includes(row.appScenario) || row.baselineScenario === row.appScenario)
      throw new TypeError(row.id + ': invalid counterbalanced scenario assignment');
    const required = ['observedAt','qualified','baselineTool','baselineSeconds','appSeconds',
      'baselineResultMinutes','appResultMinutes','appUnassisted','statementGenerated',
      'secondUseRequested','commitment'];
    if (required.some(key => blank(row[key]))) {
      missing.push(row.id);
      continue;
    }
    if (!validTimestamp(row.observedAt) || row.qualified !== true ||
        typeof row.baselineTool !== 'string' || !row.baselineTool.trim() ||
        !validSeconds(row.baselineSeconds) || !validSeconds(row.appSeconds) ||
        !Number.isSafeInteger(row.baselineResultMinutes) ||
        !Number.isSafeInteger(row.appResultMinutes) ||
        typeof row.appUnassisted !== 'boolean' ||
        typeof row.statementGenerated !== 'boolean' ||
        typeof row.secondUseRequested !== 'boolean' ||
        !COMMITMENTS.has(row.commitment))
      throw new TypeError(row.id + ': invalid or unqualified observation');
    if (HARD.has(row.commitment) &&
        (typeof row.evidenceNote !== 'string' || !row.evidenceNote.trim()))
      throw new TypeError(row.id + ': hard commitment requires a non-identifying evidence note');

    completed.push({
      ...row,
      baselineCorrect: row.baselineResultMinutes === SCENARIOS[row.baselineScenario].expectedMinutes,
      appCorrect: row.appResultMinutes === SCENARIOS[row.appScenario].expectedMinutes,
      hardCommitment: HARD.has(row.commitment),
    });
  }
  const appCorrect = completed.filter(x => x.appCorrect).length;
  const baselineCorrect = completed.filter(x => x.baselineCorrect).length;
  const correctUnassisted = completed.filter(x => x.appCorrect && x.appUnassisted).length;
  const statements = completed.filter(x => x.statementGenerated).length;
  const secondUse = completed.filter(x => x.secondUseRequested).length;
  const hardCommitment = completed.filter(x => x.hardCommitment).length;
  const medianRelativeGain = median(completed.map(x =>
    (x.baselineSeconds - x.appSeconds) / x.baselineSeconds));
  // Five small-sample timing measurements remain directional, not statistical inference.
  const advantage = medianRelativeGain !== null &&
    (medianRelativeGain >= .15 || appCorrect >= baselineCorrect + 2);
  let decision = 'NOT_EVALUABLE';
  if (completed.length === 5) {
    decision = correctUnassisted >= 4 && secondUse >= 3 &&
      hardCommitment >= 2 && advantage ? 'GO_TO_LONGER_TRIAL' : 'STOP_OR_NARROW';
  }
  return {
    decision, observed: completed.length, missing, appCorrect, baselineCorrect,
    correctUnassisted, statements, secondUse, hardCommitment,
    medianBaselineSeconds: median(completed.map(x => x.baselineSeconds)),
    medianAppSeconds: median(completed.map(x => x.appSeconds)),
    medianRelativeGain, advantage,
    interpretation: decision === 'NOT_EVALUABLE'
      ? 'Incomplete real-human evidence. No product validation claim is justified.'
      : decision === 'GO_TO_LONGER_TRIAL'
        ? 'Promising directional five-person signal only. Expand trial; not product-market fit.'
        : 'Observed differentiation or commitment is insufficient. Stop or narrow the wedge.',
  };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const file = process.argv[2] === '--' ? process.argv[3] : process.argv[2];
    const path = file || 'docs/research/retainer-hours/results.json';
    process.stdout.write(JSON.stringify({
      source:path, ...evaluatePilot(JSON.parse(readFileSync(path, 'utf8'))),
    },null,2)+'\n');
  } catch (error) {
    process.stderr.write('Invalid pilot data: '+(error instanceof Error ? error.message : String(error))+'\n');
    process.exitCode = 1;
  }
}
