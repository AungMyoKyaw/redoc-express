import { Request, Response } from 'express';
import { redocHtml, Ioption } from './redoc-html-template';

/**
 * Express middleware for serving ReDoc API documentation
 *
 * @param options - Configuration options for ReDoc
 * @param options.title - Title displayed in the browser tab and header (default: 'ReDoc')
 * @param options.specUrl - URL to your OpenAPI/Swagger specification file
 * @param options.nonce - Security nonce for Content Security Policy compliance
 * @param options.redocOptions - ReDoc configuration options for theming and functionality
 * @returns Express middleware function that serves HTML documentation
 *
 * @example
 * ```javascript
 * const express = require('express');
 * const redoc = require('redoc-express');
 *
 * const app = express();
 *
 * // Serve your OpenAPI spec
 * app.get('/docs/swagger.json', (req, res) => {
 *   res.json(swaggerSpec);
 * });
 *
 * // Mount ReDoc middleware
 * app.get('/docs', redoc({
 *   title: 'API Documentation',
 *   specUrl: '/docs/swagger.json'
 * }));
 * ```
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import redoc, { Ioption } from 'redoc-express';
 *
 * const options: Ioption = {
 *   title: 'API Documentation',
 *   specUrl: '/docs/swagger.json',
 *   nonce: 'secure-nonce',
 *   redocOptions: {
 *     theme: {
 *       colors: { primary: { main: '#1976d2' } }
 *     }
 *   }
 * };
 *
 * app.get('/docs', redoc(options));
 * ```
 */
function redocExpressMiddleware(
  options: Ioption = {
    title: 'ReDoc',
    specUrl: 'http://petstore.swagger.io/v2/swagger.json'
  }
): (req: Request, res: Response) => void {
  return function middleware(_req: Request, res: Response): void {
    res.type('html');
    res.send(redocHtml(options));
  };
}

export default redocExpressMiddleware;

// Re-export types for consumers
export { Ioption, RedocOptions, RedocTheme } from './redoc-html-template';
export { redocHtml } from './redoc-html-template';

// CommonJS compatibility
module.exports = redocExpressMiddleware;
module.exports.default = redocExpressMiddleware;
module.exports.redocHtml = redocHtml;
