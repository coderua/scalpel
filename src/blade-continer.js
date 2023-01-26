const path = require('path');
const glob = require('glob');
const { BladeContainerOptions } = require('./blade-container-options');
const { BladeBox } = require('./blade-box');

class BladeContainer {
  /**
   * Blade boxes
   *
   * @type {BladeBox[]}
   */
  #bladeBoxes = this.#containerDefaultState();

  /**
   * Runtime instance options
   *
   * @type {BladeContainerOptions}
   */
  #options;

  /**
   * BladeContainer constructor
   *
   * @param {[BladeBox]|{lookupBaseDir: string, lookupGlobPattern: string, autoLoadBlades: boolean}|BladeContainerOptions} [bladeBoxesOrOptions=undefined]
   */
  constructor(bladeBoxesOrOptions = undefined) {
    const opts = bladeBoxesOrOptions || new BladeContainerOptions();

    if (opts instanceof BladeContainerOptions || typeof opts === 'object') {
      // Save passed options
      this.#options = typeof opts === 'object' ? new BladeContainerOptions(opts) : opts.clone();

      if (this.#options.autoLoadBlades) {
        this.loadBladeBoxes();
      }
    }

    if (Array.isArray(opts) && opts.length > 0) {
      // Passed blade boxes
      this.#bladeBoxes = opts;
    }
  }

  /**
   * Default (empty) container state
   *
   * @return {[]}
   */
  #containerDefaultState() {
    return [];
  }

  /**
   * Loads BladeBox files.
   *
   * @return {this}
   */
  loadBladeBoxes() {
    const { lookupBaseDir, lookupGlobPattern } = this.#options;

    // Reset blade boxes in the container instance
    this.#bladeBoxes = this.#containerDefaultState();

    // Current working directory of the Node.js process
    const appDir = process.cwd();

    const baseDir =
      lookupBaseDir && typeof lookupBaseDir === 'string' ? lookupBaseDir : new BladeContainerOptions().lookupBaseDir;

    const pattern = path.join(baseDir.startsWith('/') ? baseDir.substring(1) : baseDir, lookupGlobPattern);

    glob.sync(pattern).forEach((mapFileName) => {
      // Add BladeBox instance to the container
      this.#bladeBoxes.push(new BladeBox(require(`${appDir}/${mapFileName}`)));
    });

    return this;
  }

  get options() {
    return this.#options;
  }

  get bladeBoxes() {
    return this.#bladeBoxes;
  }

  /**
   * Looking for proper blades for an url and target in req/res.
   *
   * @param {string} url
   * @param {string} type. Available values are: req, res
   * @param {string} target
   * @return {Function[]}
   */
  findBlades(url, type, target) {
    if (this.#bladeBoxes.length === 0) {
      // There is no loaded blade boxes
      return [];
    }

    return this.#bladeBoxes.map((bladeBox) => bladeBox.blades(url, type, target)).flat();
  }
}

module.exports = { BladeContainer };
