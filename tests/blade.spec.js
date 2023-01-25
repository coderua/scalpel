/* eslint-disable prefer-destructuring */

const Blade = require('../src/blade').Blade;
const { BLADE_TYPE_RESPONSE, BLADE_TYPE_REQUEST } = require('../src/blade-types');

describe('Tests Blade class', () => {
  test('it can create the class instance without passing any param into constructor', () => {
    expect(new Blade()).toBeInstanceOf(Blade);
  });

  test('it can create the class instance with passing object with all required fields into constructor', () => {
    const blade = {
      type: BLADE_TYPE_RESPONSE,
      target: 'body.services',
      handlers: [],
    };

    expect(new Blade(blade)).toBeInstanceOf(Blade);
  });

  test.each([null, true, false, 0, 1, '', 'xyz', [], {}, () => {}, 'https://example.com'])(
    'it should throw an exception when passing an invalid "blade" = %p into constructor',
    (blade) => {
      expect(() => new Blade(blade)).toThrowError();
    }
  );

  test('it should throw an exception when Blade does not have "type" property', () => {
    const blade = {
      // type: BLADE_TYPE_RESPONSE, is missing here
      target: 'body',
      handlers: [
        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (req) => req,
      ],
    };

    expect(() => new Blade(blade)).toThrowError();
  });

  test('it should throw an exception when Blade does not have "target" property', () => {
    const blade = {
      type: BLADE_TYPE_RESPONSE,
      // target: 'body', is missing here
      handlers: [
        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (req) => req,
      ],
    };

    expect(() => new Blade(blade)).toThrowError();
  });

  test('it should throw an exception when Blade does not have "handlers" property', () => {
    const blade = {
      type: BLADE_TYPE_RESPONSE,
      target: 'body',
      /*
      // is missing here
      handlers: [
        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (req) => req,
      ],
       */
    };

    expect(() => new Blade(blade)).toThrowError();
  });

  test.each([
    // type, target

    // Invalid target
    [BLADE_TYPE_RESPONSE, undefined],
    [BLADE_TYPE_RESPONSE, null],
    [BLADE_TYPE_RESPONSE, false],
    [BLADE_TYPE_RESPONSE, true],
    [BLADE_TYPE_RESPONSE, ''],

    // Invalid type
    [undefined, 'body.services'],
    [null, 'body.services'],
    [false, 'body.services'],
    [true, 'body.services'],
    ['true', 'body.services'],

    // Invalid type and target
    [undefined, undefined],
    [null, null],
    [false, false],
    [true, true],
  ])('it should NOT return Blade handlers non relevant both "type" = %p and "target" = %p params', (type, target) => {
    const blade = {
      type: BLADE_TYPE_RESPONSE,
      target: 'body.services',
      handlers: [(r) => r],
    };

    expect(new Blade(blade).handlers(type, target)).toHaveLength(0);
  });

  test('it should return Blade handlers for a relevant "type" and "target"', () => {
    const blade = {
      type: BLADE_TYPE_REQUEST,
      target: 'data',
      handlers: [(r) => r, (r) => r],
    };

    expect(new Blade(blade).handlers(BLADE_TYPE_REQUEST, 'data')).toHaveLength(2);
    expect(new Blade(blade).handlers(BLADE_TYPE_RESPONSE, 'data')).toHaveLength(0);
  });
});
