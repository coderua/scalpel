# Scalpel

Node.js cutting/transformation tool for your requests or any other data structure in a customizable way.

## Install

```
$ npm install @coder.ua/scalpel
```

## Usage

### Setup Scalpel instance

#### Setup with zero configuration

```javascript
const { Scalpel } = require('@coder.ua/scalpel');

// By default will load all blades from `api/**/logger/request-blades/req` and `api/**/logger/request-blades/res` directories
const scalpel = new Scalpel();
```

#### Setup with custom object configuration

```javascript
const { Scalpel } = require('@coder.ua/scalpel');

// Will load all blades from `api/**/logger/request-blades/req` and `api/**/logger/request-blades/res` directories
const options = {
  autoLoadBlades: true,
  lookupBaseDir: 'api/',
  lookupGlobPattern: '**/logger/blades/*.bladebox.js',
};

const scalpel = new Scalpel(options);
```

#### Setup with custom BladeContainerOptions instance

```javascript
const { Scalpel, BladeContainerOptions } = require('@coder.ua/scalpel');

// Will load all blades from `api/**/logger/blades/*.bladebox.js` files
const options = new BladeContainerOptions({
  autoLoadBlades: true,
  lookupBaseDir: 'api/',
  lookupGlobPattern: '**/logger/blades/*.bladebox.js',
});

const scalpel = new Scalpel(options);
```

#### Setup with custom BladeContainer instance

```javascript
const { Scalpel, BladeContainer } = require('@coder.ua/scalpel');

// Will load all blades from `api/**/logger/blades/*.bladebox.js` files
const container = new BladeContainer({
  autoLoadBlades: true,
  lookupBaseDir: 'api/',
  lookupGlobPattern: '**/logger/blades/*.bladebox.js',
});

const scalpel = new Scalpel(container);
```

### Default Scalpel options

```javascript
const options = {
  // Automatically load BladeBoxes from `lookupBaseDir` by `lookupGlobPattern`
  autoLoadBlades: true,
  // Set base directory for BladeBoxes lookup
  lookupBaseDir: 'api/',
  // Set glob pattern for BladeBoxes lookup
  // More info about glob patterns: https://github.com/isaacs/node-glob
  lookupGlobPattern: '**/logger/request-blades/{req,res}/*.bladebox.js',
};
```

### Cutting data

```javascript
const { Scalpel } = require('@coder.ua/scalpel');

const scalpel = new Scalpel(options);

// Data that needed to be cutted
// A simple IncomingMessage structure
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

// Applies all founded blades for the 'body' property in request.
// Result example could looks like:
// req = {
//   method: 'POST',
//   // Omitted...
//   body: {
//     username: 'John',
//     password: '******', <=== Result of cutting
//   },
//   // Omitted...
//
//   res: {
//     // Omitted...
//   },
// };
const cuttedReq = scalpel.setUrl('/api/login').setTarget('body').cut(req);
```

#### More documentation is coming soon...
