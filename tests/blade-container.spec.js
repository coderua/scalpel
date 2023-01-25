/* eslint-disable prefer-destructuring */

const BladeContainer = require('../src/blade-continer').BladeContainer;
const BladeBox = require('../src/blade-box').BladeBox;

describe('Tests BladeContainer class', () => {
  test('it should create the class instance without passing param in constructor', () => {
    expect(new BladeContainer()).toBeInstanceOf(BladeContainer);
  });

  test('it should create the class instance with passing param in constructor', () => {
    expect(
      new BladeContainer({
        autoLoadBlades: false,
        lookupBaseDir: 'tests/api/',
      })
    ).toBeInstanceOf(BladeContainer);
  });

  test('should load "tests/api/blades/{req,res}/*.blade.js" files', () => {
    const { bladeBoxes } = new BladeContainer({
      autoLoadBlades: false,
      lookupBaseDir: 'tests/api/',
    }).loadBladeBoxes();

    expect(Array.isArray(bladeBoxes)).toBe(true);
    expect(bladeBoxes.length).toBeGreaterThanOrEqual(1);
    bladeBoxes.forEach((bladeBox) => expect(bladeBox).toBeInstanceOf(BladeBox));
  });

  test('should not load any blade files for non existent path "tests/unit/xxx/"', () => {
    expect(
      new BladeContainer({
        autoLoadBlades: true,
        lookupBaseDir: 'tests/unit/xxx/',
      }).bladeBoxes
    ).toStrictEqual([]);
  });

  test('should lazy load blades from one BladeBox file in "tests/api/asset/logger/request-blades" folder', () => {
    const container = new BladeContainer({
      lookupBaseDir: 'tests/api/asset/',
      autoLoadBlades: false,
      lookupGlobPattern: 'logger/request-blades/*.bladebox.js',
    });

    const { bladeBoxes } = container.loadBladeBoxes();

    expect(bladeBoxes).toHaveLength(1);
    expect(Array.isArray(bladeBoxes)).toBe(true);

    bladeBoxes.forEach((bladeBox) => expect(bladeBox).toBeInstanceOf(BladeBox));
  });

  test('should load few blades from one BladeBox file "api-assets-svg.bladebox.js"', () => {
    const container = new BladeContainer({
      lookupBaseDir: 'tests/api/asset/',
      autoLoadBlades: true,
      lookupGlobPattern: 'logger/request-blades/*.bladebox.js',
    });

    const { bladeBoxes } = container;

    expect(Array.isArray(bladeBoxes)).toBe(true);
    expect(bladeBoxes).toHaveLength(1);

    bladeBoxes.forEach((bladeBox) => expect(bladeBox).toBeInstanceOf(BladeBox));
  });
});
