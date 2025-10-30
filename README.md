# [redoc-express][redoc-express]

> Lightweight Express middleware for serving interactive ReDoc API documentation from OpenAPI/Swagger specs with full TypeScript support and zero configuration overhead.

[![code style: prettier][prettier]][prettier-url]
[![npm][npm-download]][npm-dl-url]
[![contributions welcome][contri]][contri-url]
[![License: MIT][license]][license-url]
[![coverage][coverage]][coverage-url]
[![TypeScript][typescript-badge]][typescript-url]

## Features

- 🚀 **Lightweight & Fast** - Minimal overhead, serves static documentation
- 📝 **Full TypeScript Support** - First-class TypeScript support with complete type definitions
- ✅ **100% Test Coverage** - Comprehensive test suite with 47+ test cases
- 🎨 **Customizable UI** - Full ReDoc theming and configuration support
- 🔒 **Secure** - Built-in CSP nonce support for enhanced security
- 📦 **ES5 Compatible** - Works across all Node.js versions (Node 6+)
- 🔧 **Zero Config** - Works out of the box with sensible defaults
- 🧩 **OpenAPI/Swagger** - Support for both OpenAPI 3.0+ and Swagger 2.0 specifications

## Why redoc-express?

**redoc-express** makes it dead simple to add professional API documentation to your Express server. Unlike alternatives:
- No build tools required
- Single middleware setup
- Works with your existing OpenAPI/Swagger spec
- Highly customizable but requires no configuration to get started
- Production-ready with 100% test coverage

## Demo

- [Live Demo][live-demo-url]
- [Product Website][product-website-url]

## Quick Start

### Install

```shell
npm install redoc-express
```

## Usage

### JavaScript/CommonJS

```javascript
const express = require('express');
const redoc = require('redoc-express');

const app = express();
const port = 3000;

// Serve your OpenAPI/Swagger spec
app.get('/docs/swagger.json', (req, res) => {
  res.sendFile('swagger.json', { root: '.' });
});

// Mount ReDoc middleware
app.get(
  '/docs',
  redoc({
    title: 'API Documentation',
    specUrl: '/docs/swagger.json'
  })
);

app.listen(port, () => {
  console.log(`📚 API docs available at http://localhost:${port}/docs`);
});
```

### TypeScript

```typescript
import express, { Express } from 'express';
import redoc from 'redoc-express';

const app: Express = express();
const port = 3000;

// Serve your OpenAPI/Swagger spec
app.get('/docs/swagger.json', (req, res) => {
  res.sendFile('swagger.json', { root: '.' });
});

// Mount ReDoc middleware with TypeScript support
app.get(
  '/docs',
  redoc({
    title: 'API Documentation',
    specUrl: '/docs/swagger.json',
    redocOptions: {
      theme: {
        colors: {
          primary: { main: '#1976d2' }
        }
      }
    }
  })
);

app.listen(port, () => {
  console.log(`📚 API docs available at http://localhost:${port}/docs`);
});
```

### Advanced Configuration

```javascript
app.get(
  '/docs',
  redoc({
    title: 'My API Documentation',
    specUrl: 'https://api.example.com/openapi.json',
    nonce: 'random-nonce-123', // Optional: for CSP compliance
    redocOptions: {
      theme: {
        colors: {
          primary: { main: '#6EC5AB' }
        },
        typography: {
          fontFamily: '"museo-sans", Helvetica, Arial, sans-serif',
          fontSize: '15px'
        },
        menu: { backgroundColor: '#ffffff' }
      },
      hideDownloadButton: true,
      expandResponses: '200,201,400'
    }
  })
);
```

For all available ReDoc configuration options, see the [official documentation](https://redocly.com/docs/api-reference-docs/configuration/functionality/)

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | string | Yes | Title displayed in the browser tab and header |
| `specUrl` | string | Yes | URL to your OpenAPI/Swagger specification file |
| `nonce` | string | No | Security nonce for Content Security Policy compliance |
| `redocOptions` | object | No | [ReDoc configuration options](https://redocly.com/docs/api-reference-docs/configuration/functionality/) |

## Compatibility

- **Node.js**: 6+ (ES5 compatible)
- **Express**: 4.x, 5.x
- **OpenAPI**: 3.0+, Swagger 2.0
- **TypeScript**: 3.5+

## Development

### Install Dependencies

```shell
npm i
```

### Run Tests

```shell
npm test
```

### Build

```shell
npm run build
```

## Test Coverage

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 100%     |
| Branches   | 100%     |
| Functions  | 100%     |
| Lines      | 100%     |

**47 comprehensive test cases** covering:

- HTML template generation with various configurations
- Special characters and edge cases handling
- Middleware functionality and request/response handling
- Complex nested options and JSON serialization
- Daily CI/CD test runs with automated issue creation

## FAQ

**Q: Can I use this with TypeScript?**
A: Yes! Full TypeScript support with included type definitions.

**Q: Does this work with OpenAPI 3.0?**
A: Yes, both OpenAPI 3.0+ and Swagger 2.0 are supported.

**Q: Is there a performance impact?**
A: Minimal. The middleware only serves static HTML—no runtime overhead.

**Q: Can I customize the UI colors/fonts?**
A: Yes, pass `redocOptions` with your theme configuration.

**Q: What Node.js versions are supported?**
A: Node 6+ (ES5 compiled output). Development requires Node 18.14+.

## Resources

- [ReDoc Documentation][redoc-url]
- [OpenAPI Specification](https://spec.openapis.org/)
- [Report Issues](https://github.com/AungMyoKyaw/redoc-express/issues)

## License

MIT © [Aung Myo Kyaw](https://github.com/AungMyoKyaw)

[redoc-express]: https://github.com/AungMyoKyaw/redoc-express
[contri]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square
[contri-url]: https://github.com/AungMyoKyaw/redoc-express/issues
[npm-download]: https://img.shields.io/npm/dt/redoc-express.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.com/package/redoc-express
[license]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[typescript-badge]: https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?style=flat-square
[typescript-url]: https://www.typescriptlang.org/
[redoc-url]: https://github.com/Redocly/redoc
[live-demo-url]: http://redocly.github.io/redoc/
[product-website-url]: https://aungmyokyaw.github.io/redoc-express/
[coverage]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[coverage-url]: #test-coverage
