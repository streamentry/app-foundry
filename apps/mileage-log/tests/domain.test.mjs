import assert from 'node:assert/strict';import{test}from'node:test';
import{makeTrip,toKm,totalDistance,tripsCSV}from'../src/domain.ts';
test('distance converts, aggregates and exports safely',()=>{const t=makeTrip('a','2026-11-14',10,'mi','=HYPERLINK("x")');assert.ok(Math.abs(toKm(10,'mi')-16.0934)<0.01);assert.equal(totalDistance([t],'mi'),10);assert.ok(tripsCSV([t]).includes("'=HYPERLINK"));assert.throws(()=>makeTrip('b','2026-11-14',-1,'km','work'));});
