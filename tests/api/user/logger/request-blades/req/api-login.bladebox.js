import { BladeTypes } from '../../../../../../src/main';

const { BLADE_TYPE_REQUEST } = BladeTypes;

/**
 * Example of BladeBox file for a request (req).
 * ---------------------------
 *
 * It contains only basic implementation
 *
 * @type {{'/api/login': [{type: string, target: string, blades: (function({}): {})[]}]}}
 */
module.exports = {
  '/api/login': [
    // List of all blades for the '/api/login' url
    {
      type: BLADE_TYPE_REQUEST,
      target: 'body',
      handlers: [
        // Request blades for the 'body' property (just dummy example)

        // IMPORTANT:
        // -----------------------------------------
        // An order of handlers is important.
        // Each blade will be applied in the same order as defined.
        (req) => {
          req.body = {
            ...req.body,
            username: 'John',
            password: '********',
          };

          return req;
        },
      ],
    },
  ],
};
