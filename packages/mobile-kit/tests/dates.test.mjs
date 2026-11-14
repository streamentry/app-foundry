import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isDayKey, asLocalDate, addDays, daysBetween, addMonths, requirePositiveNumber, csvCell, timeAsDate } from '../src/dates.ts';

test('day-only dates validate leap years and count across year boundaries', () => {
  assert.equal(isDayKey('2028-02-29'), true);
  assert.equal(isDayKey('2027-02-29'), false);
  assert.equal(isDayKey('2026-13-01'), false);
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(daysBetween('2026-12-31', '2027-01-02'), 2);
  assert.ok(asLocalDate('2026-11-14') instanceof Date);
  assert.equal(addMonths('2028-01-31', 1), '2028-02-29');
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
});

test('validates amounts and time and escapes formula injection', () => {
  assert.equal(requirePositiveNumber('1.25'), 1.25);
  assert.throws(() => requirePositiveNumber('-1'), RangeError);
  assert.throws(() => requirePositiveNumber(''), RangeError);
  assert.throws(() => timeAsDate('24:01'), RangeError);
  assert.equal(csvCell(' =bad'), '"\' =bad"');
  assert.equal(csvCell('hello "friend"'), '"hello ""friend"""');
});
