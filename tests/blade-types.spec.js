const { BLADE_TYPE_RESPONSE, BLADE_TYPE_REQUEST } = require('../src/blade-types');

describe('Tests Scalpel Blade Types', () => {
  test.each([BLADE_TYPE_REQUEST, BLADE_TYPE_RESPONSE])(
    'it should return string type for each blade type "%s"',
    (bladeType) => {
      expect(typeof bladeType).toBe('string');
    }
  );
});
