/* eslint-disable prefer-destructuring */

import { BladeBox } from '../src/main';
import { BladeTypes } from '../src/main';

const { BLADE_TYPE_RESPONSE, BLADE_TYPE_REQUEST } = BladeTypes;

describe('Tests BladeBox class', () => {
  test('it can create the class instance without passing any param into constructor', () => {
    expect(new BladeBox()).toBeInstanceOf(BladeBox);
  });

  test('it can create the class instance with passing BladeBox object into constructor', () => {
    const bladeBox = {
      '/api/login': [
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'body.services',
          handlers: [],
        },
      ],
      '/api/logout': [
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'data',
          handlers: [],
        },
      ],
    };

    const bladeBoxInstance = new BladeBox(bladeBox);

    expect(bladeBoxInstance).toBeInstanceOf(BladeBox);
    expect(bladeBoxInstance.urls).toStrictEqual(['/api/login', '/api/logout']);
    expect(bladeBoxInstance.blades('/api/login', BLADE_TYPE_RESPONSE, 'body.services')).toHaveLength(0);
    expect(bladeBoxInstance.blades('/api/logout', BLADE_TYPE_RESPONSE, 'data')).toHaveLength(0);
  });

  test.each([null, true, false, 0, 1, '', 'xyz', [], {}, () => {}, 'https://example.com'])(
    'it should throw an exception when passing an invalid "bladeBox" = %p into constructor',
    (bladeBox) => {
      expect(() => new BladeBox(bladeBox)).toThrowError();
    }
  );

  test('it should throw an exception when BladeBox does not have "type" property', () => {
    const bladeBox = {
      '/api/login': [
        {
          target: 'body',
          handlers: [
            // IMPORTANT:
            // -----------------------------------------
            // An order of handlers is important.
            // Each blade will be applied in the same order as defined.
            (req) => req,
          ],
        },
      ],
    };

    expect(() => new BladeBox(bladeBox)).toThrowError();
  });

  test.each([
    // url, type, target
    [undefined, BLADE_TYPE_RESPONSE, undefined],
    [null, BLADE_TYPE_RESPONSE, null],
    [false, BLADE_TYPE_RESPONSE, false],
    [true, BLADE_TYPE_RESPONSE, true],
    ['true', BLADE_TYPE_RESPONSE, 'true'],
    ['', BLADE_TYPE_RESPONSE, ''],

    ['/api/login', BLADE_TYPE_RESPONSE, undefined],
    ['/api/login', BLADE_TYPE_RESPONSE, null],
    ['/api/login', BLADE_TYPE_RESPONSE, false],
    ['/api/login', BLADE_TYPE_RESPONSE, true],
    ['/api/login', BLADE_TYPE_RESPONSE, 'true'],
    ['/api/login', BLADE_TYPE_RESPONSE, ''],

    [undefined, BLADE_TYPE_RESPONSE, 'body.services'],
    [null, BLADE_TYPE_RESPONSE, 'body.services'],
    [false, BLADE_TYPE_RESPONSE, 'body.services'],
    [true, BLADE_TYPE_RESPONSE, 'body.services'],
    ['true', BLADE_TYPE_RESPONSE, 'body.services'],
  ])('it should NOT return blades for invalid both "url" = %p and "target" = %p params', (url, type, target) => {
    const bladeBox = {
      '/api/logout': [
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'body.services',
          handlers: [(r) => r],
        },
      ],
    };

    expect(new BladeBox(bladeBox).blades(url, type, target)).toHaveLength(0);
  });

  test('it should return blades for passed url, type and target from a BladesBox instance', () => {
    const bladeBox = {
      // Applies to all requests
      '*': [
        {
          type: BLADE_TYPE_REQUEST,
          target: 'data',
          handlers: [(r) => r],
        },
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'body.services',
          handlers: [(r) => r],
        },
      ],
      '/api/login': [
        {
          type: BLADE_TYPE_REQUEST,
          target: 'data',
          handlers: [(r) => r, (r) => r],
        },
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'body.services',
          handlers: [(r) => r, (r) => r],
        },
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'body.error',
          handlers: [(r) => r],
        },
      ],
      '/api/logout': [
        {
          type: BLADE_TYPE_RESPONSE,
          target: 'body.services',
          handlers: [(r) => r],
        },
      ],
    };

    const bladeBoxInstance = new BladeBox(bladeBox);

    // Returns handlers for all urls '*' and for /api/login
    expect(bladeBoxInstance.blades('/api/login', BLADE_TYPE_REQUEST, 'data')).toHaveLength(3);
    expect(bladeBoxInstance.blades('/api/login', BLADE_TYPE_RESPONSE, 'body.services')).toHaveLength(3);
    expect(bladeBoxInstance.blades('/api/logout', BLADE_TYPE_RESPONSE, 'body.services')).toHaveLength(2);
  });
});
