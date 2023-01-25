const { BLADE_TYPE_RESPONSE } = require('../../../../../../src/blade-types');

/**
 * Example of BladeBox file for a response (res).
 * ---------------------------
 *
 * It does not contain a real implementation, only a structure
 *
 * @type {{'/api/login': [{type: string, target: string, blades: (function({}): {})[]}]}}
 */
module.exports = {
  '/api/login': [
    // List of all blades for the '/api/login' url
    {
      type: BLADE_TYPE_RESPONSE,
      target: 'body.services',
      handlers: [
        // Response blades for the 'body.services' property (just dummy example)

        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (res) => {
          res.body.services = `[Array of ${res.body.services.length} items]`;

          return res;
        },
      ],
    },
  ],
};
