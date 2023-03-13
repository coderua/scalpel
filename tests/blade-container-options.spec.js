/* eslint-disable prefer-destructuring */

import { BladeContainerOptions } from '../src/main';

describe('Tests BladeContainerOptions class', () => {
  const defaultOptions = Object.freeze({
    autoLoadBlades: true,
    lookupBaseDir: 'api/',
    lookupGlobPattern: '**/logger/request-blades/{req,res}/*.bladebox.js',
  });

  test('it can create the class instance without passing any params', () => {
    const instance = new BladeContainerOptions();

    expect(instance).toBeInstanceOf(BladeContainerOptions);
    expect(instance.options).toStrictEqual(defaultOptions);
  });

  test('it can create the class instance with passed options param', () => {
    const options = {
      autoLoadBlades: false,
      lookupBaseDir: 'tests/api/',
      lookupGlobPattern: '**/logger/transformers/*.bladebox.js',
    };

    const instance = new BladeContainerOptions(options);

    expect(instance).toBeInstanceOf(BladeContainerOptions);
    expect(instance.options).toStrictEqual(options);
  });

  test('it should not use invalid option keys and values during instance creation', () => {
    const options = {
      unknown: false,
      autoLoadBlades: false,
      lookupBaseDir: false,
      lookupGlobPattern: {},
    };

    const expectedOptions = {
      autoLoadBlades: false,
      lookupBaseDir: 'api/',
      lookupGlobPattern: '**/logger/request-blades/{req,res}/*.bladebox.js',
    };

    const instance = new BladeContainerOptions(options);

    expect(instance).toBeInstanceOf(BladeContainerOptions);
    expect(instance.options).toStrictEqual(expectedOptions);
  });

  test.each([[undefined, null, '', false, true, 'true', 'false', Boolean, () => {}, [], 'test']])(
    'it should not use invalid option param during instance creation',
    (options) => {
      const instance = new BladeContainerOptions(options);

      expect(instance).toBeInstanceOf(BladeContainerOptions);
      expect(instance.options).toStrictEqual(defaultOptions);
    }
  );

  test('it should set custom options after an instance created with default ones', () => {
    const options = {
      autoLoadBlades: false,
      lookupBaseDir: 'tests/api/',
      lookupGlobPattern: '**/logger/transformers/{req,res}/*.bladebox.js',
    };

    const instance = new BladeContainerOptions();

    expect(instance).toBeInstanceOf(BladeContainerOptions);
    expect(instance.options).toStrictEqual(defaultOptions);

    instance.options = options;
    expect(instance.options).toStrictEqual(options);
  });

  test('it should provide string representation for options', () => {
    const instance = new BladeContainerOptions();

    const expected =
      '{"autoLoadBlades":true,"lookupBaseDir":"api/","lookupGlobPattern":"**/logger/request-blades/{req,res}/*.bladebox.js"}';

    expect(instance).toBeInstanceOf(BladeContainerOptions);
    expect(instance.toJSON()).toBe(expected);
    expect(instance.toString()).toBe(expected);
  });
});
