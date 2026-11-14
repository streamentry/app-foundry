import assert from 'node:assert/strict';import{test}from'node:test';
import{makeWarranty,estimatedExpiry,daysLeft,orderedWarranties}from'../src/domain.ts';
test('warranty month arithmetic respects leap years',()=>{const a=makeWarranty('a','Camera','2028-01-31',1,'Shop');assert.equal(estimatedExpiry(a),'2028-02-29');assert.equal(daysLeft(a,'2028-02-28'),1);assert.equal(orderedWarranties([a])[0]?.id,'a');assert.throws(()=>makeWarranty('b','X','2026-11-14',0,''));});
