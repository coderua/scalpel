const { BLADE_TYPE_REQUEST, BLADE_TYPE_RESPONSE } = require('../../../../../src/blade-types');

/**
 * Example of BladeBox file with blades for both request and response (req/res) in one file.
 * ---------------------------
 *
 * Contains instructions (url, type, target) and handlers for cutting request/response log.
 *
 * url: if a req/res contains the same url, then BladeBox can be applied to it.
 * target: apply blade(s) to cut/modify res for the setup target.
 *         Target supports 'dot notation' so can access nested elements, (i.e., body.username).
 * type: type of the blade (req/res). See blade-types.js for more details.
 *
 * @type {{"/api/asset/svg": [{type: string, target: string, blades: (function({}): {})[]}]}}
 */
module.exports = {
  // url
  '/api/asset/svg': [
    // List of all blades for the '/api/asset/svg' url
    {
      type: BLADE_TYPE_REQUEST,
      target: 'body',
      handlers: [
        // Request blades for the 'body' property (just dummy example)

        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (req) => req,
      ],
    },
    {
      type: BLADE_TYPE_RESPONSE,
      target: 'body',
      handlers: [
        // Response blades for the 'body' property (just dummy example)

        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (res) => {
          res.body = `SVG content of ${res.body.length} bytes`;

          return res;
        },
      ],
    },
  ],
};
