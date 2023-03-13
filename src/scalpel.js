/* eslint-disable class-methods-use-this, prefer-destructuring */

import { BladeContainer } from './main';
import { BladeContainerOptions } from './main';
import BladeTypes from './blade-types';

const { BLADE_TYPE_REQUEST, BLADE_TYPE_RESPONSE } = BladeTypes;

export default class Scalpel {
  #types = [BLADE_TYPE_REQUEST, BLADE_TYPE_RESPONSE];

  /**
   * Container with BladeBox instances
   *
   * @property {BladeContainer}
   * @private
   */
  #bladeContainer;

  /**
   * @property {string}
   * @private
   */
  #type;

  /**
   * @property {string}
   * @private
   */
  #url;

  /**
   * @property {string}
   * @private
   */
  #target;

  /**
   * Scalpel constructor
   *
   * @param {BladeContainer|BladeContainerOptions|{}|undefined} [bladeContainerOrOptions=undefined]
   */
  constructor(bladeContainerOrOptions = undefined) {
    if (bladeContainerOrOptions instanceof BladeContainer) {
      // Already initialized BladeContainer instance
      this.#bladeContainer = bladeContainerOrOptions;
    } else if (bladeContainerOrOptions instanceof BladeContainerOptions) {
      // Passed BladeContainerOptions instance
      this.#bladeContainer = new BladeContainer(bladeContainerOrOptions);
    } else if (typeof bladeContainerOrOptions === 'object') {
      // Passed plain object with options for BladeContainer
      this.#bladeContainer = new BladeContainer(bladeContainerOrOptions);
    } else {
      this.#bladeContainer = new BladeContainer();
    }
  }

  get bladeContainer() {
    return this.#bladeContainer;
  }

  /**
   * Cut request or response object
   *
   * @param {Object} reqOrRes
   * @return {Object}
   */
  cut(reqOrRes = {}) {
    this.#setType(this.#detectReqOrRes(reqOrRes));

    let result = { ...reqOrRes };

    this.#bladeContainer.findBlades(this.#url, this.#type, this.#target).forEach((blade) => {
      result = blade(result);
    });

    return result;
  }

  /**
   * Sets a type of data to transform: request or response.
   *
   * @param {String} type Available values: req, res
   * @return {Scalpel}
   */
  #setType(type) {
    if (this.#types.includes(type) === false) {
      throw new Error(`Unsupported data type. Expected one of the ${this.#types.join(', ')} but received '${type}'.`);
    }

    this.#type = type;

    return this;
  }

  /**
   * Sets an url of request/response from
   *
   * @param {String} url
   * @return {Scalpel}
   */
  setUrl(url) {
    if (typeof url !== 'string') {
      throw new TypeError(`Unsupported url type. Expected 'string' but received '${typeof url}'.`);
    }

    this.#url = url;

    return this;
  }

  /**
   * Returns req/res url for which transformation will be applied
   *
   * @return {String|undefined}
   */
  getUrl() {
    return this.#url;
  }

  /**
   * Sets a target (property) from request/response that should be cut by blades.
   *
   * @param {String} targetPath. Example: 'url', 'headers', 'body', 'httpVersion', 'method', 'statusCode', 'statusMessage', 'message' etc.
   * @return {Scalpel}
   */
  setTarget(targetPath) {
    if (typeof targetPath !== 'string') {
      throw new TypeError(`Unsupported target type. Expected 'string' but received '${typeof targetPath}'.`);
    }

    this.#target = targetPath;

    return this;
  }

  /**
   * Scalpel target getter
   *
   * @return {string}
   */
  getTarget() {
    return this.#target;
  }

  /**
   * Checks if the object is response or request
   *
   * @param {object} reqOrRes
   * @returns {string}
   * @throws Error
   */
  #detectReqOrRes(reqOrRes) {
    return reqOrRes.req ? BLADE_TYPE_RESPONSE : BLADE_TYPE_REQUEST;
  }
}
