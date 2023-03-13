/**
 * Checks if passed variable is a plain object
 *
 * @param {*} variable
 * @returns {boolean}
 */
const isObject = function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
};

export { isObject };
