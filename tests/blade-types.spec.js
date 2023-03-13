import { BladeTypes } from '../src/main';

const { BLADE_TYPE_RESPONSE, BLADE_TYPE_REQUEST } = BladeTypes;

describe('Tests Scalpel Blade Types', () => {
  test.each([BLADE_TYPE_REQUEST, BLADE_TYPE_RESPONSE])(
    'it should return string type for each blade type "%s"',
    (bladeType) => {
      expect(typeof bladeType).toBe('string');
    }
  );
});
