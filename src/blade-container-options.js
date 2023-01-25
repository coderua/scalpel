class BladeContainerOptions {
  /**
   * Default options
   *
   * @private
   * @type {Readonly<{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}>}
   */
  #defaultOptions = Object.freeze({
    autoLoadBlades: true,
    lookupBaseDir: 'api/',
    lookupGlobPattern: '**/logger/request-blades/{req,res}/*.bladebox.js',
  });

  /**
   * Options internal state
   *
   * @private
   * @type {{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}}
   */
  #options = {};

  /**
   * BladeContainerOptions constructor
   *
   * @param {{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}} options. Supported options: autoLoadBlades, lookupBaseDir, lookupGlobPattern.
   *
   * @example for 'options' param
   * {
   *   autoLoadBlades: false,
   *   lookupBaseDir: 'server/api'
   * }
   */
  constructor(options = {}) {
    // Merge passed options with default options by options setter
    this.options = options;
  }

  clone() {
    return new BladeContainerOptions(this.#options);
  }

  get autoLoadBlades() {
    return this.#options.autoLoadBlades;
  }

  get lookupBaseDir() {
    return this.#options.lookupBaseDir;
  }

  get lookupGlobPattern() {
    return this.#options.lookupGlobPattern;
  }

  /**
   * Merge passed options with default options
   *
   * @private
   * @param {Object} options
   * @returns {{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}}
   */
  #mergeWithDefaultOptions(options = {}) {
    if (typeof options !== 'object' || options === null || Object.keys(options).length === 0) {
      return { ...this.#defaultOptions };
    }

    const validOptionKeys = Object.keys(this.#defaultOptions);
    const booleanOptions = ['autoLoadBlades'];
    const stringOptions = ['lookupBaseDir', 'lookupGlobPattern'];

    return {
      ...this.#defaultOptions,
      ...Object.fromEntries(
        Object.entries(options)
          // Filter out invalid options
          .filter(([key, value]) => validOptionKeys.includes(key) && value !== undefined && value !== null)
          // Filter out invalid values for boolean options
          .filter(
            ([key, value]) =>
              booleanOptions.includes(key) === false || (booleanOptions.includes(key) && typeof value === 'boolean')
          )
          // Filter out invalid values for string options
          .filter(
            ([key, value]) =>
              stringOptions.includes(key) === false || (stringOptions.includes(key) && typeof value === 'string')
          )
      ),
    };
  }

  /**
   * Options getter
   *
   * @returns {{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}}
   */
  get options() {
    return this.#options;
  }

  /**
   * Options setter
   *
   * @param {{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}} options
   */
  set options(options) {
    this.#options = this.#mergeWithDefaultOptions(options);
  }

  toJSON() {
    return JSON.stringify(this.#options);
  }

  toString() {
    return this.toJSON();
  }
}

module.exports = { BladeContainerOptions };
