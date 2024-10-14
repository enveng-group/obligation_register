const { someUtilityFunction } = require('../utils/someUtilityFile');

describe('someUtilityFunction', () => {
  it('should return the correct value', () => {
    const result = someUtilityFunction('input');
    expect(result).toBe('expectedOutput');
  });
});
