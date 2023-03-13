import BladeTypes from './blade-types';
import { isObject } from './utils/is-object';

const { BLADE_TYPE_RESPONSE, BLADE_TYPE_REQUEST } = BladeTypes;

export default class Blade {
  /**
   * Blade
   *
   * @type {{type: string, target: string, handlers: (function({}): {})[]}}
   */
  #blade;

  /**
   * Blade required fields
   *
   * @type {string[]}
   */
  static #requiredFields = ['type', 'target', 'handlers'];

  static #availableTypes = [BLADE_TYPE_REQUEST, BLADE_TYPE_RESPONSE];

  /**
   * Blade constructor
   *
   * @param {{type: string, target: string, blades: (function({}): {})[]}} blade
   *
   * @example of blade parameter:
   * {
   *   type: BLADE_TYPE_REQUEST,
   *   target: 'body',
   *   handlers: [
   *     // Request blades for the 'body' property
   *
   *     // IMPORTANT:
   *     // -----------------------------------------
   *     // An order of handlers is important.
   *     // Each blade will be applied in the same order as defined.
   *     (req) => req,
   *     (req) => req,
   *   ],
   * },
   */
  constructor(blade) {
    if (blade === undefined) {
      return;
    }

    Blade.validateBlade(blade);

    this.#blade = blade;
  }

  static validateBlade(blade) {
    if (!isObject(blade)) {
      throw new Error(`Invalid Blade type. Expected type is 'object', but '${typeof blade}' got`);
    }

    const bladeFields = Object.keys(blade);

    if (!bladeFields.length) {
      throw new Error(
        `Invalid Blade format. Blade object is empty. Required fields: ${Blade.#requiredFields.join(', ')}`
      );
    }

    // Blade must have all required fields
    Blade.#requiredFields.forEach((field) => {
      if (!bladeFields.includes(field)) {
        throw new Error(`Invalid Blade format. Blade object doesn't have required field '${field}'`);
      }
    });

    // Type must be one of available types
    if (!Blade.#availableTypes.includes(blade.type)) {
      throw new Error(
        `Invalid Blade format. Blade type='${
          blade.type
        }' is not supported. Available types: ${Blade.#availableTypes.join(', ')}`
      );
    }

    // Blades should be an array of functions
    if (!Array.isArray(blade.handlers)) {
      throw new Error(`Invalid Blade format. 'handlers' field must be an array. Got '${typeof blade.handlers}'`);
    }

    // Every blade should be a function
    blade.handlers.forEach((handler) => {
      if (typeof handler !== 'function') {
        throw new Error(`Invalid Blade format. Expected handler as a function, but got '${typeof handler}'`);
      }
    });
  }

  /**
   * Returns proper handlers for passed url, type and target values
   *
   * @param {string} type Blade type. Available types: 'req', 'res'. See blade-types.js
   * @param {string} target
   * @return {Function[]}
   */
  handlers(type, target) {
    if (!type || !target || typeof type !== 'string' || typeof target !== 'string') {
      return [];
    }

    return this.#blade.handlers.filter(
      (/** @type function */ handler) => this.#blade.type === type && this.#blade.target === target
    );
  }
}
