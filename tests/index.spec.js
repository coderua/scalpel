import { Scalpel, Blade, BladeContainer, BladeContainerOptions, BladeBox, BladeTypes } from '../src/main';

describe('Tests entry point file', () => {
  test('it should export Scalpel class', () => {
    expect(Scalpel).toBeInstanceOf(Function);
    expect(new Scalpel()).toBeInstanceOf(Scalpel);
  });

  test('it should export Blade class', () => {
    expect(Blade).toBeInstanceOf(Function);
    expect(new Blade()).toBeInstanceOf(Blade);
  });

  test('it should export BladeContainer class', () => {
    expect(BladeContainer).toBeInstanceOf(Function);
    expect(new BladeContainer()).toBeInstanceOf(BladeContainer);
  });

  test('it should export BladeContainerOptions class', () => {
    expect(BladeContainerOptions).toBeInstanceOf(Function);
    expect(new BladeContainerOptions()).toBeInstanceOf(BladeContainerOptions);
  });

  test('it should export BladeBox class', () => {
    expect(BladeBox).toBeInstanceOf(Function);
    expect(new BladeBox()).toBeInstanceOf(BladeBox);
  });

  test('it should export BladeTypes object', () => {
    expect(BladeTypes).toBeInstanceOf(Object);
    expect(BladeTypes).toHaveProperty('BLADE_TYPE_REQUEST');
    expect(BladeTypes).toHaveProperty('BLADE_TYPE_RESPONSE');
  });
});
