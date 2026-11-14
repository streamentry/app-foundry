import assert from 'node:assert/strict';
import { test } from 'node:test';
import { increment, formatCount } from '../src/index.ts';

test('increments count', () => assert.equal(increment(2), 3));
test('formats count', () => assert.equal(formatCount(3), '3'));
test('rejects invalid count', () => assert.throws(() => increment(Infinity), RangeError));
