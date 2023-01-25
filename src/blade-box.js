const { isObject } = require('./utils/is-object');
const { Blade } = require('./blade');

class BladeBox {
  #bladeBox = {};

  /**
   * BladeBox constructor
   *
   * @param {Object|undefined} [bladeBox=undefined] BladeBox object. Optional
   */
  constructor(bladeBox) {
    if (bladeBox !== undefined) {
      this.box = bladeBox;
    }
  }

  /**
   * Validates blade box object
   *
   * @param {Object} bladeBox
   */
  #validateBladeBox(bladeBox) {
    if (!isObject(bladeBox)) {
      throw new Error(`Invalid BladeBox type. Expected type is 'object', but '${typeof bladeBox}' got`);
    }

    if (Object.keys(bladeBox).length === 0) {
      throw new Error('Invalid BladeBox format. BladeBox object is empty');
    }
  }

  set box(bladeBox) {
    this.#validateBladeBox(bladeBox);

    Object.keys(bladeBox).forEach((url) => {
      this.#bladeBox[url] = [];

      bladeBox[url].forEach((blade) => {
        this.#bladeBox[url].push(new Blade(blade));
      });
    });
  }

  get box() {
    return this.#bladeBox;
  }

  get urls() {
    return Object.keys(this.#bladeBox);
  }

  /**
   * Returns proper blades for an url and target
   *
   * @param {string} url
   * @param {string} type Blade type. Available types: 'req', 'res'. See blade-types.js
   * @param {string} target
   * @return {Function[]}
   */
  blades(url, type, target) {
    if (!url || !type || !target || typeof url !== 'string' || typeof type !== 'string' || typeof target !== 'string') {
      return [];
    }

    const urlMatcher = (bladeBoxUrl) => bladeBoxUrl === '*' || bladeBoxUrl.startsWith(url);

    return (
      this.urls
        // BladeBoxes only for the given url: ['*', '/api/login']
        .filter(urlMatcher)
        // Arrays of Blade instances: [ [ Blade {} ], [ Blade {}, Blade {}, Blade {} ] ]
        .map((url) => this.#bladeBox[url])
        // Flatten array of Blade instances: [ Blade {}, Blade {}, Blade {}, Blade {} ]
        .flat()
        // Only handlers with the given type and target:
        // [
        //   [ [Function (anonymous)] ],
        //   [ [Function (anonymous)], [Function (anonymous)] ],
        //   [],
        //   []
        // ]
        .map((blade) => blade.handlers(type, target))
        // Filter empty handlers:
        // [
        //   [ [Function (anonymous)] ],
        //   [ [Function (anonymous)], [Function (anonymous)] ]
        // ]
        .filter((handlers) => handlers.length > 0)
        // Only array of handlers: [ [Function (anonymous)], [Function (anonymous)], [Function (anonymous)] ]
        .flat()
    );
  }
}

module.exports = { BladeBox };
