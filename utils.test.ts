// I'm only testing the utility functions for this exercise.
// We should also test the express server.

const { isUnitValid, convertWeight } = require('./utils.ts');

test('valid units', () => {
  expect(isUnitValid('KILOGRAMS')).toBe(true);
  expect(isUnitValid('OUNCES')).toBe(true);
  expect(isUnitValid('POUNDS')).toBe(true);
})

test('invalid units', () => {
  expect(isUnitValid('invalid')).toBe(false);
})

test('unit conversion', () => {
  expect(convertWeight(10, 'KILOGRAMS', 'KILOGRAMS')).toBeCloseTo(10);
  expect(convertWeight(10, 'KILOGRAMS', 'OUNCES')).toBeCloseTo(352.74);
  expect(convertWeight(10, 'KILOGRAMS', 'POUNDS')).toBeCloseTo(22.046);
  expect(convertWeight(10, 'OUNCES', 'KILOGRAMS')).toBeCloseTo(0.28);
  expect(convertWeight(10, 'OUNCES', 'OUNCES')).toBeCloseTo(10);
  expect(convertWeight(10, 'OUNCES', 'POUNDS')).toBeCloseTo(0.625);
  expect(convertWeight(10, 'POUNDS', 'KILOGRAMS')).toBeCloseTo(4.54);
  expect(convertWeight(10, 'POUNDS', 'OUNCES')).toBeCloseTo(160);
  expect(convertWeight(10, 'POUNDS', 'POUNDS')).toBeCloseTo(10);
})
