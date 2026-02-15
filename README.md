# [redoc-express][redoc-express]

> Lightweight Express middleware for serving interactive ReDoc API documentation from OpenAPI/Swagger specs with full TypeScript support and zero configuration overhead.

[![code style: prettier][prettier]][prettier-url]
[![npm][npm-download]][npm-dl-url]
[![contributions welcome][contri]][contri-url]
[![License: MIT][license]][license-url]
[![coverage badge][coverage]][coverage-url]
[![TypeScript][typescript-badge]][typescript-url]
[![tests][tests-badge]][tests-url]
[![Node.js Version][node-badge]][node-url]

## Features

- 🚀 **Lightweight & Fast** - Minimal overhead, serves static documentation
- 📝 **Full TypeScript Support** - First-class TypeScript support with complete type definitions
- ✅ **100% Test Coverage** - Comprehensive test suite with 136 test cases covering all functionality
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
- Production-ready with 100% code coverage and 136 comprehensive tests

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

### Coverage Metrics

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 100%     |
| Branches   | 100%     |
| Functions  | 100%     |
| Lines      | 100%     |

### Test Suite

**136 comprehensive test cases** organized across 3 test suites:

- **Unit Tests - redocHtml** (85+ tests)
  - HTML structure and DOCTYPE validation
  - Title handling (unicode, emoji, special characters, extreme lengths)
  - URL/Spec handling (protocols, authentication, fragments, long URLs)
  - Nonce validation and CSP compliance
  - ReDoc options configuration (objects, arrays, numbers, booleans)
  - JSON serialization and escaping

- **Unit Tests - redocExpressMiddleware** (51+ tests)
  - Express middleware behavior and method ordering
  - Content-type and response handling
  - Request/response immutability
  - Multiple middleware invocations
  - Edge cases and error handling

- **End-to-End Tests** (26+ tests)
  - Real-world Express integration scenarios
  - Concurrent request handling
  - Multiple API documentation versions
  - Route isolation and middleware chains
  - Stress testing with rapid requests

### Test Execution

```bash
npm test              # Run all 136 tests
npm test -- --coverage # With coverage report
npm test -- --watch   # Watch mode during development
```

All tests pass with **100% code coverage** in approximately **1-2 seconds**.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests to ensure they pass (`npm test`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Setup

```shell
# Clone the repository
git clone https://github.com/AungMyoKyaw/redoc-express.git
cd redoc-express

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

### Code Style

This project uses:
- [Prettier](https://prettier.io/) for code formatting
- [ESLint](https://eslint.org/) for code quality

Please ensure your code follows the existing style by running `npm run lint:fix` before committing.

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
[tests-badge]: https://img.shields.io/badge/tests-136%20passing-brightgreen.svg?style=flat-square
[tests-url]: #test-coverage
[node-badge]: https://img.shields.io/badge/Node.js-6%2B-green.svg?style=flat-square
[node-url]: https://nodejs.org/
