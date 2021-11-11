const UNIT_CONVERTER: { [key: string]: number } = {
  'KILOGRAMS': 1,
  'OUNCES': 35.274,
  'POUNDS': 2.20462,
};

// If we use enum for units, this can be covered by enum parsing.
const _isUnitValid = (unit: string): boolean => unit === 'KILOGRAMS' || unit === 'OUNCES' || unit === 'POUNDS'

/**
 * weight was sent as strings. We can potentially optimize the parser to convert
 * it to number during deserialization. In this exercise, I just casted it to
 * number while calculating weight to target unit.
 */
const _convertWeight = (weight: number, unit: string, targetUnit: string): number => Number(weight) / UNIT_CONVERTER[unit] * UNIT_CONVERTER[targetUnit];

module.exports = {
  isUnitValid: _isUnitValid,
  convertWeight: _convertWeight,
};

export { }
