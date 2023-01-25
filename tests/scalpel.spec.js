/* eslint-disable prefer-destructuring */

const Scalpel = require('../src/scalpel').Scalpel;
const BladeContainer = require('../src/blade-continer').BladeContainer;

let req;
let res;

beforeEach(() => {
  // Emulate a simple IncomingMessage structure
  req = {
    method: 'POST',
    httpVersion: '1.1',
    baseUrl: '',
    url: '/api/login',
    params: {},
    body: {
      username: 'John',
      password: 'TESTSPASS',
    },
    headers: {
      host: 'localhost:3000',
      connection: 'keep-alive',
      accept: 'application/json, text/plain, */*',
      referer: 'http://example.com/',
    },

    res: {
      // Omitted...
    },
  };

  // Emulate a simple ServerResponse structure
  res = {
    statusCode: 200,
    responseTime: 357,
    statusMessage: 'OK',
    body: {
      username: 'TestUser',
      services: ['auth', 'web', 'dashboard'],
    },
    req: {
      // Omitted...
    },
  };
});

describe('Tests Scalpel class instantiating', () => {
  test('it can create the class instance without any options', () => {
    expect(new Scalpel()).toBeInstanceOf(Scalpel);
  });

  test('it can set url for finding a proper blade', () => {
    const url = '/api/login';
    const scalper = new Scalpel().setUrl(url);

    expect(scalper.getUrl()).toBe(url);
  });

  test('it can set req/res property for data cutting', () => {
    const scalper = new Scalpel();

    scalper.setTarget('body.services');

    expect(scalper.getTarget()).toBe('body.services');
  });
});

describe('Tests Scalpel class with manual passing BladeContainer instance', () => {
  let bladeContainer;
  let scalpel;

  beforeAll(() => {
    bladeContainer = new BladeContainer({
      lookupBaseDir: 'tests/api/user/',
    });
  });

  beforeEach(() => {
    scalpel = new Scalpel(bladeContainer);
  });

  test('should transform a request', () => {
    scalpel.setUrl('/api/login').setTarget('body');

    const transformedData = scalpel.cut(req);

    expect(transformedData.body).toStrictEqual({ password: '********', username: 'John' });
  });

  test('it should transform a response', () => {
    scalpel.setUrl('/api/login').setTarget('body.services');

    const transformedData = scalpel.cut(res);

    expect(transformedData.body.services).toBe('[Array of 3 items]');
  });
});

describe('Tests Scalpel class without relevant BladeBoxes map', () => {
  test('it should not transform a response without founded blades', () => {
    const transformedData = new Scalpel(new BladeContainer().loadBladeBoxes('tests/xxx'))
      .setUrl('/api/login')
      .setTarget('body')
      .cut(res);

    expect(transformedData.body.services).toStrictEqual(res.body.services);
  });

  test('it should not transform a response if blade is for a different url', () => {
    const transformedData = new Scalpel().setUrl('/api/test').setTarget('body').cut(res);

    expect(transformedData.body.services).toStrictEqual(res.body.services);
  });
});
