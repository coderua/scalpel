const { isObject } = require('../../src/utils/is-object');

describe('Tests isObject helper', () => {
  test.each([
    // input, expected

    // Negative cases when input is not an object
    [() => {}, false],
    /* eslint-disable-next-line no-new-func */
    [new Function(), false],
    ['myString', false],
    [['a', 'b', 'c'], false],
    [new Array(3), false],
    [new Set([1, 2, 4]), false],
    [new Date(), false],
    [undefined, false],
    [null, false],
  ])('it should check that input %p is not a plain object', (input, expected) => {
    expect(isObject(input)).toEqual(expected);
  });

  test.each([
    // input, expected

    // Positive cases when input is an object
    [{ param: 'value' }, true],
    /* eslint-disable-next-line no-new-object */
    [new Object(), true],
  ])('it should check that input %p is a plain object', (input, expected) => {
    expect(isObject(input)).toEqual(expected);
  });
});
