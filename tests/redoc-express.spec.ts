/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import redocExpressMiddleware from '../src/index';
import { redocHtml, Ioption } from '../src/redoc-html-template';

describe('redocHtml', () => {
  test('should return redocHtml Template with default options', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://petstore.swagger.io/v2/swagger.json'
    });

    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<title>ReDoc</title>');
    expect(result).toContain('http://petstore.swagger.io/v2/swagger.json');
    expect(result).toContain('Redoc.init');
    expect(result).toContain('redoc-container');
  });

  test('should return redocHtml Template with nonce', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://petstore.swagger.io/v2/swagger.json',
      nonce: 'rAnd0m'
    });

    expect(result).toContain("nonce='rAnd0m'");
    expect(result).toContain('http://petstore.swagger.io/v2/swagger.json');
  });

  test('should return redocHtml Template with redoc options', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://petstore.swagger.io/v2/swagger.json',
      nonce: 'rAnd0m',
      redocOptions: {
        theme: {
          colors: {
            primary: {
              main: '#6EC5AB'
            }
          },
          typography: {
            fontFamily:
              '"museo-sans", \'Helvetica Neue\', Helvetica, Arial, sans-serif'
          }
        }
      }
    });

    expect(result).toContain('#6EC5AB');
    expect(result).toContain('museo-sans');
    expect(result).toContain("nonce='rAnd0m'");
  });

  test('should handle empty nonce string', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://petstore.swagger.io/v2/swagger.json',
      nonce: ''
    });

    expect(result).toContain("nonce=''");
  });

  test('should handle default redocOptions when not provided', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://petstore.swagger.io/v2/swagger.json'
    });

    expect(result).toContain('Redoc.init');
    expect(result).toContain('{}');
  });

  test('should handle special characters in specUrl', () => {
    const specUrl = 'http://example.com/api/v1/spec.json?version=2&format=json';
    const result = redocHtml({
      title: 'API',
      specUrl
    });

    expect(result).toContain(specUrl);
  });

  test('should handle special characters in title', () => {
    const result = redocHtml({
      title: 'My API & Docs',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('My API & Docs');
  });

  test('should handle complex nested redocOptions', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: { colors: { primary: { main: '#fff' } } },
        hideDownloadButton: true,
        scrollYOffset: 50,
        pathInMiddlePanel: true,
        tryItOutEnabled: true,
        requiredPropsFirst: true
      }
    });

    expect(result).toContain('hideDownloadButton');
    expect(result).toContain('true');
    expect(result).toContain('scrollYOffset');
  });

  test('should use default parameters when called without options', () => {
    const result = redocHtml();

    expect(result).toContain('ReDoc');
    expect(result).toContain('http://petstore.swagger.io/v2/swagger.json');
  });

  test('should include redoc standalone script source', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain(
      'https://unpkg.com/redoc@^2.5.2/bundles/redoc.standalone.js'
    );
  });

  test('should include required meta tags', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('charset="utf-8"');
    expect(result).toContain('viewport');
    expect(result).toContain('width=device-width');
  });

  test('should include Google Fonts link', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('https://fonts.googleapis.com');
    expect(result).toContain('Montserrat');
    expect(result).toContain('Roboto');
  });

  test('should include body styles', () => {
    const result = redocHtml({
      title: 'ReDoc',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('margin: 0');
    expect(result).toContain('padding: 0');
  });

  test('should properly escape quotes in options', () => {
    const result = redocHtml({
      title: 'API with "quotes"',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        info: { description: 'API with "quotes"' }
      }
    });

    expect(result).toContain('API with "quotes"');
  });

  test('should handle multiple special characters in URL', () => {
    const specUrl =
      'http://example.com/api/v1/spec.json?version=2&format=json&filter=test%20space';
    const result = redocHtml({
      title: 'API',
      specUrl
    });

    expect(result).toContain(specUrl);
  });

  test('should handle very long title', () => {
    const longTitle =
      'This is a very long API documentation title with many characters and special symbols like & < >';
    const result = redocHtml({
      title: longTitle,
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain(longTitle);
  });

  test('should handle empty string title', () => {
    const result = redocHtml({
      title: '',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('<title></title>');
  });

  test('should handle very long nonce', () => {
    const longNonce = 'a'.repeat(256);
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      nonce: longNonce
    });

    expect(result).toContain(`nonce='${longNonce}'`);
  });

  test('should handle array values in redocOptions', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        servers: [
          { url: 'http://api1.example.com', description: 'Production' },
          { url: 'http://api2.example.com', description: 'Staging' }
        ]
      }
    });

    expect(result).toContain('api1.example.com');
    expect(result).toContain('api2.example.com');
    expect(result).toContain('Production');
  });

  test('should handle null values in redocOptions', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: null,
        title: null
      }
    });

    expect(result).toContain('null');
  });

  test('should handle numeric values in redocOptions', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        scrollYOffset: 100,
        fontSize: 14,
        timeout: 5000
      }
    });

    expect(result).toContain('100');
    expect(result).toContain('14');
    expect(result).toContain('5000');
  });

  test('should handle boolean false values in redocOptions', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        hideDownloadButton: false,
        tryItOutEnabled: false
      }
    });

    expect(result).toContain('false');
  });

  test('should handle deeply nested objects in redocOptions', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: {
          colors: {
            primary: {
              main: '#fff',
              light: '#f0f0f0',
              dark: '#000'
            },
            secondary: {
              main: '#ccc'
            }
          },
          typography: {
            fontFamily: 'Arial',
            fontSize: 12,
            fontWeight: 400
          }
        }
      }
    });

    expect(result).toContain('#fff');
    expect(result).toContain('#f0f0f0');
    expect(result).toContain('#000');
    expect(result).toContain('Arial');
    expect(result).toContain('fontWeight');
  });

  test('should maintain HTML structure integrity', () => {
    const result = redocHtml({
      title: 'Test',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toMatch(/<html>[\s\S]*<\/html>/);
    expect(result).toMatch(/<head>[\s\S]*<\/head>/);
    expect(result).toMatch(/<body>[\s\S]*<\/body>/);
    expect(result).toMatch(/<title>[\s\S]*<\/title>/);
  });

  test('should have correct script tag attributes', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      nonce: 'test-nonce'
    });

    expect(result).toMatch(
      /script nonce='test-nonce' src="https:\/\/unpkg\.com\/redoc@\^2\.5\.2\/bundles\/redoc\.standalone\.js"/
    );
  });

  test('should have Redoc.init call with correct parameters', () => {
    const specUrl = 'http://example.com/spec.json';
    const result = redocHtml({
      title: 'API',
      specUrl,
      redocOptions: { hideDownloadButton: true }
    });

    expect(result).toContain('Redoc.init(');
    expect(result).toContain(`"${specUrl}"`);
    expect(result).toContain('hideDownloadButton');
    expect(result).toContain('document.getElementById("redoc-container")');
  });

  test('should handle URL with special query parameters', () => {
    const specUrl =
      'http://example.com/swagger.json?token=abc123&version=2.0&test=true';
    const result = redocHtml({
      title: 'API',
      specUrl
    });

    expect(result).toContain(specUrl);
  });

  test('should handle title with HTML-like content', () => {
    const title = 'API <v1.0>';
    const result = redocHtml({
      title,
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain(title);
  });

  test('should generate valid JSON in redocOptions', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: { colors: { primary: { main: '#fff' } } },
        hideDownloadButton: true
      }
    });

    // Verify the options are properly JSON stringified
    expect(result).toContain('"theme"');
    expect(result).toContain('"hideDownloadButton"');
    expect(result).toContain('true');
    expect(result).toContain('#fff');
  });

  test('should handle emoji in title', () => {
    const result = redocHtml({
      title: '🚀 API Documentation 🎉',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('🚀 API Documentation 🎉');
  });

  test('should handle unicode characters in title', () => {
    const result = redocHtml({
      title: 'API文档 документация',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('API文档 документация');
  });

  test('should handle very long specUrl', () => {
    const longUrl =
      'http://example.com/api/v1/spec.json?' + 'param=value&'.repeat(50);
    const result = redocHtml({
      title: 'API',
      specUrl: longUrl
    });

    expect(result).toContain(longUrl);
  });

  test('should handle nonce with special regex characters', () => {
    const nonce = 'nonce-[test].(.*)+?';
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      nonce
    });

    expect(result).toContain(`nonce='${nonce}'`);
  });

  test('should preserve single quotes in nonce attribute', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      nonce: 'test-nonce-123'
    });

    expect(result).toMatch(/nonce='test-nonce-123'/);
  });

  test('should handle redocOptions with zero values', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        scrollYOffset: 0,
        fontSize: 0
      }
    });

    expect(result).toContain('0');
  });

  test('should handle redocOptions with negative numbers', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        scrollYOffset: -50
      }
    });

    expect(result).toContain('-50');
  });

  test('should handle redocOptions with empty strings', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        title: '',
        description: ''
      }
    });

    expect(result).toContain('""');
  });

  test('should handle redocOptions with empty array', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        servers: []
      }
    });

    expect(result).toContain('[]');
  });

  test('should handle redocOptions with empty object', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: {}
      }
    });

    expect(result).toContain('{}');
  });

  test('should handle mixed case URL schemes', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'HTTP://EXAMPLE.COM/SPEC.JSON'
    });

    expect(result).toContain('HTTP://EXAMPLE.COM/SPEC.JSON');
  });

  test('should handle URLs with file protocol', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'file:///path/to/spec.json'
    });

    expect(result).toContain('file:///path/to/spec.json');
  });

  test('should handle URLs with authentication', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://user:password@example.com/spec.json'
    });

    expect(result).toContain('http://user:password@example.com/spec.json');
  });

  test('should handle title with newline characters', () => {
    const result = redocHtml({
      title: 'API\nDocumentation',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('API\nDocumentation');
  });

  test('should handle title with tab characters', () => {
    const result = redocHtml({
      title: 'API\tDocumentation',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('API\tDocumentation');
  });

  test('should contain DOCTYPE declaration', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result.startsWith('<!DOCTYPE html>')).toBe(true);
  });

  test('should have proper html closing tag at end', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result.endsWith('</html>')).toBe(true);
  });

  test('should have proper nesting of html tags', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const htmlStart = result.indexOf('<html>');
    const htmlEnd = result.lastIndexOf('</html>');
    const headStart = result.indexOf('<head>');
    const headEnd = result.indexOf('</head>');
    const bodyStart = result.indexOf('<body>');
    const bodyEnd = result.indexOf('</body>');

    expect(htmlStart).toBeLessThan(headStart);
    expect(headStart).toBeLessThan(headEnd);
    expect(headEnd).toBeLessThan(bodyStart);
    expect(bodyStart).toBeLessThan(bodyEnd);
    expect(bodyEnd).toBeLessThan(htmlEnd);
  });

  test('should have redoc-container div in body', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const bodyStart = result.indexOf('<body>');
    const bodyEnd = result.indexOf('</body>');
    const containerDiv = result.indexOf('id="redoc-container"');

    expect(containerDiv).toBeGreaterThan(bodyStart);
    expect(containerDiv).toBeLessThan(bodyEnd);
  });

  test('should have Redoc.init inside script tag', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const scriptStart = result.lastIndexOf('<script>');
    const redocInit = result.indexOf('Redoc.init');

    expect(redocInit).toBeGreaterThan(scriptStart);
  });

  test('should have correct meta charset position', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const headStart = result.indexOf('<head>');
    const charset = result.indexOf('charset="utf-8"');

    expect(charset).toBeGreaterThan(headStart);
  });

  test('should handle redocOptions with very large numbers', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        timeout: 999999999999
      }
    });

    expect(result).toContain('999999999999');
  });

  test('should handle redocOptions with decimal numbers', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        opacity: 0.5,
        scale: 1.5
      }
    });

    expect(result).toContain('0.5');
    expect(result).toContain('1.5');
  });

  test('should handle multiple consecutive spaces in title', () => {
    const result = redocHtml({
      title: 'API     Documentation     Spaces',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('API     Documentation     Spaces');
  });

  test('should have type module attribute in script tags if applicable', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('<script');
    expect(result).toContain('</script>');
  });

  test('should handle specUrl with fragment identifier', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json#section1'
    });

    expect(result).toContain('http://example.com/spec.json#section1');
  });

  test('should handle title with backslashes', () => {
    const result = redocHtml({
      title: 'API\\Documentation',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('API\\Documentation');
  });

  test('should have proper redoc unpkg URL', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain(
      'https://unpkg.com/redoc@^2.5.2/bundles/redoc.standalone.js'
    );
  });

  test('should not have any unmatched placeholders', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).not.toContain('[[');
    expect(result).not.toContain(']]');
  });

  test('should have all required Google Fonts', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('fonts.googleapis.com');
    expect(result).toContain('Montserrat');
    expect(result).toContain('Roboto');
  });

  test('should have proper link for Google Fonts', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('rel="stylesheet"');
    expect(result).toMatch(/href="https:\/\/fonts\.googleapis\.com[^"]+"/);
  });

  test('should have meta viewport tag with correct content', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('name="viewport"');
    expect(result).toContain('width=device-width');
    expect(result).toContain('initial-scale=1');
  });

  test('should have body styles for margin and padding', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('<style>');
    expect(result).toContain('margin: 0');
    expect(result).toContain('padding: 0');
    expect(result).toContain('</style>');
  });

  test('should handle redocOptions with special JSON values', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        value: null
      }
    });

    // null is preserved in JSON
    expect(result).toContain('null');
  });

  test('should return string type', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(typeof result).toBe('string');
  });

  test('should have non-empty result', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result.length).toBeGreaterThan(0);
  });

  test('should handle redocOptions preserving boolean true', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        flag: true
      }
    });

    expect(result).toContain('"flag":true');
  });

  test('should handle redocOptions preserving boolean false', () => {
    const result = redocHtml({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        flag: false
      }
    });

    expect(result).toContain('"flag":false');
  });

  test('should handle title with various HTML entities', () => {
    const result = redocHtml({
      title: 'API & SDK',
      specUrl: 'http://example.com/spec.json'
    });

    expect(result).toContain('API & SDK');
  });

  test('should preserve URL parameters order', () => {
    const specUrl = 'http://example.com/spec.json?first=1&second=2&third=3';
    const result = redocHtml({
      title: 'API',
      specUrl
    });

    const urlIndex = result.indexOf(specUrl);
    expect(urlIndex).toBeGreaterThanOrEqual(0);
  });
});

describe('redocExpressMiddleware', () => {
  test('should return a middleware function', () => {
    const middleware = redocExpressMiddleware();
    expect(typeof middleware).toBe('function');
  });

  test('should set content type to html', () => {
    const middleware = redocExpressMiddleware({
      title: 'ReDoc',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalledWith('html');
  });

  test('should send redocHtml response', () => {
    const middleware = redocExpressMiddleware({
      title: 'Test API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.send).toHaveBeenCalled();
    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('Test API');
    expect(sentHtml).toContain('http://example.com/spec.json');
  });

  test('should work with default options when none provided', () => {
    const middleware = redocExpressMiddleware();

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalledWith('html');
    expect(mockRes.send).toHaveBeenCalled();
    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('ReDoc');
  });

  test('should handle custom options in middleware', () => {
    const customOptions = {
      title: 'My Custom API',
      specUrl: 'http://api.example.com/openapi.json',
      nonce: 'secure123'
    };

    const middleware = redocExpressMiddleware(customOptions);

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('My Custom API');
    expect(sentHtml).toContain('http://api.example.com/openapi.json');
    expect(sentHtml).toContain('secure123');
  });

  test('should handle redocOptions in middleware', () => {
    const middleware = redocExpressMiddleware({
      title: 'API Docs',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        hideDownloadButton: true,
        scrollYOffset: 80
      }
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('hideDownloadButton');
    expect(sentHtml).toContain('80');
  });

  test('should be callable with express-like objects', () => {
    const middleware = redocExpressMiddleware({
      title: 'Express Test',
      specUrl: 'http://example.com/swagger.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    const mockReq = {
      method: 'GET',
      url: '/api-docs'
    };

    expect(() => {
      middleware(mockReq as any, mockRes as any);
    }).not.toThrow();

    expect(mockRes.type).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should accept partial options', () => {
    const middleware = redocExpressMiddleware({
      title: 'Partial Config API',
      specUrl: 'http://example.com/api.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('Partial Config API');
    expect(sentHtml).toContain('http://example.com/api.json');
    expect(sentHtml).toContain("nonce=''");
  });

  test('should call type and send methods in correct order', () => {
    const middleware = redocExpressMiddleware({
      title: 'Test',
      specUrl: 'http://example.com/spec.json'
    });

    const callOrder: string[] = [];
    const mockRes = {
      type: jest.fn(function (this: typeof mockRes) {
        callOrder.push('type');
        return this;
      }),
      send: jest.fn(() => {
        callOrder.push('send');
      })
    } as unknown as Response;
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(callOrder).toEqual(['type', 'send']);
  });

  test('should not modify request object', () => {
    const middleware = redocExpressMiddleware({
      title: 'Test',
      specUrl: 'http://example.com/spec.json'
    });

    const mockReq = { url: '/docs', method: 'GET' };
    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    middleware(mockReq as any, mockRes as any);

    expect(mockReq).toEqual({ url: '/docs', method: 'GET' });
  });

  test('should handle middleware with empty options object', () => {
    const middleware = redocExpressMiddleware({} as Ioption);

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should work with multiple invocations', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes1 = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockRes2 = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes1 as any);
    middleware(mockReq as any, mockRes2 as any);

    expect(mockRes1.type).toHaveBeenCalledWith('html');
    expect(mockRes2.type).toHaveBeenCalledWith('html');
    expect(mockRes1.send).toHaveBeenCalled();
    expect(mockRes2.send).toHaveBeenCalled();
  });

  test('should handle response with chaining methods', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn(function (this: typeof mockRes) {
        return this;
      }),
      status: jest.fn(function (this: typeof mockRes) {
        return this;
      }),
      send: jest.fn()
    } as unknown as Response;
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalledWith('html');
    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should send HTML string not buffer', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentData = mockRes.send.mock.calls[0][0];
    expect(typeof sentData).toBe('string');
  });

  test('should handle nonce with special characters in middleware', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      nonce: 'nonce-with-dashes_and_underscores.123'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain("nonce='nonce-with-dashes_and_underscores.123'");
  });

  test('should handle complex redocOptions configuration in middleware', () => {
    const middleware = redocExpressMiddleware({
      title: 'Complex API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: {
          colors: {
            primary: { main: '#1976d2' },
            secondary: { main: '#dc3545' }
          },
          typography: {
            fontFamily: 'Roboto, sans-serif',
            fontSize: 14,
            fontWeight: 400
          }
        },
        hideDownloadButton: true,
        scrollYOffset: 80,
        pathInMiddlePanel: false,
        tryItOutEnabled: true,
        requiredPropsFirst: true,
        onlyRequiredInSamples: true,
        expandSingleSchemaField: true,
        expandDefaultServerVariables: true,
        disableSearch: false,
        nativeScrollbars: true,
        simpleOneOfModel: false,
        sortEnumValuesAlphabetically: false,
        sortOperationsAlphabetically: false,
        sortTagsAlphabetically: false
      }
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('hideDownloadButton');
    expect(sentHtml).toContain('1976d2');
    expect(sentHtml).toContain('dc3545');
    expect(sentHtml).toContain('80');
    expect(sentHtml).toContain('Roboto');
  });

  test('should properly handle middleware called with undefined request body', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    expect(() => {
      middleware(undefined as any, mockRes as any);
    }).not.toThrow();
  });

  test('should return valid HTML that can be parsed', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];

    // Basic HTML structure validation
    expect(sentHtml).toMatch(/^<!DOCTYPE html>/);
    expect(sentHtml).toMatch(/<html[\s>]/);
    expect(sentHtml).toMatch(/<\/html>$/);
  });

  test('should handle middleware with various req/res properties', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: 200
    };
    const mockReq = {
      method: 'GET',
      url: '/docs',
      headers: { 'user-agent': 'test' },
      query: {}
    };

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should call type with exact string "html"', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalledWith('html');
    expect(mockRes.type).toHaveBeenCalledTimes(1);
  });

  test('should call send exactly once', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  test('should send valid HTML string not object', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentData = mockRes.send.mock.calls[0][0];
    expect(typeof sentData).toBe('string');
    expect(sentData).toMatch(/^<!DOCTYPE/);
  });

  test('middleware should handle different response chainings', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const callChain: string[] = [];
    const mockRes = {
      type: jest.fn(function () {
        callChain.push('type');
        return this;
      }),
      status: jest.fn(function () {
        callChain.push('status');
        return this;
      }),
      send: jest.fn(function () {
        callChain.push('send');
        return this;
      })
    } as unknown as Response;
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(callChain[0]).toBe('type');
    expect(callChain[callChain.length - 1]).toBe('send');
  });

  test('should handle middleware without nonce in options', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain("nonce=''");
  });

  test('should include all redocOptions properties in middleware output', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        hideDownloadButton: true,
        scrollYOffset: 100,
        expandSingleSchemaField: true,
        tryItOutEnabled: false
      }
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('hideDownloadButton');
    expect(sentHtml).toContain('scrollYOffset');
    expect(sentHtml).toContain('expandSingleSchemaField');
    expect(sentHtml).toContain('tryItOutEnabled');
  });

  test('should not throw with malformed response object', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    expect(() => {
      middleware({} as any, mockRes as any);
    }).not.toThrow();
  });

  test('should work with completely custom options structure', () => {
    const customOptions: Ioption = {
      title: 'Completely Custom Title',
      specUrl: 'http://completely-custom.example.com/spec.json',
      nonce: 'custom-nonce-xyz',
      redocOptions: {
        customProp: 'customValue',
        nested: {
          deep: {
            value: 123
          }
        }
      }
    };

    const middleware = redocExpressMiddleware(customOptions);

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('Completely Custom Title');
    expect(sentHtml).toContain(
      'http://completely-custom.example.com/spec.json'
    );
    expect(sentHtml).toContain('custom-nonce-xyz');
  });

  test('should handle repeated invocations independently', () => {
    const middleware1 = redocExpressMiddleware({
      title: 'API 1',
      specUrl: 'http://example1.com/spec.json'
    });

    const middleware2 = redocExpressMiddleware({
      title: 'API 2',
      specUrl: 'http://example2.com/spec.json'
    });

    const mockRes1 = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const mockRes2 = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const mockReq = {};

    middleware1(mockReq as any, mockRes1 as any);
    middleware2(mockReq as any, mockRes2 as any);

    const html1 = mockRes1.send.mock.calls[0][0];
    const html2 = mockRes2.send.mock.calls[0][0];

    expect(html1).toContain('API 1');
    expect(html2).toContain('API 2');
    expect(html1).not.toContain('API 2');
  });

  test('should preserve middleware function signature', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    expect(middleware.length).toBe(2); // req, res
  });

  test('should handle response with additional methods', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  test('should maintain option immutability', () => {
    const options: Ioption = {
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      redocOptions: {
        theme: { colors: { primary: { main: '#fff' } } }
      }
    };

    const originalOptions = JSON.stringify(options);

    const middleware = redocExpressMiddleware(options);

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    middleware({} as any, mockRes as any);

    expect(JSON.stringify(options)).toBe(originalOptions);
  });

  test('should handle response type method returning context', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    let contextCorrect = false;
    const mockRes = {
      type: jest.fn(function () {
        contextCorrect = this === mockRes;
        return this;
      }),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(contextCorrect).toBe(true);
  });

  test('should send complete and valid HTML document', () => {
    const middleware = redocExpressMiddleware({
      title: 'Test API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];

    // Validate complete HTML document structure
    expect(sentHtml).toMatch(/<!DOCTYPE html>/);
    expect(sentHtml).toMatch(/<html[\s>]/);
    expect(sentHtml).toMatch(/<head>[\s\S]*<\/head>/);
    expect(sentHtml).toMatch(/<body>[\s\S]*<\/body>/);
    expect(sentHtml).toMatch(/<title>Test API<\/title>/);
    expect(sentHtml).toMatch(/document\.getElementById\("redoc-container"\)/);
  });

  test('should handle options with all possible redocOptions properties', () => {
    const middleware = redocExpressMiddleware({
      title: 'Full Featured API',
      specUrl: 'http://example.com/spec.json',
      nonce: 'full-nonce',
      redocOptions: {
        theme: {
          colors: { primary: { main: '#1976d2' } },
          typography: { fontFamily: 'Roboto' }
        },
        hideDownloadButton: true,
        scrollYOffset: 80,
        pathInMiddlePanel: false,
        tryItOutEnabled: true,
        requiredPropsFirst: true,
        onlyRequiredInSamples: true,
        expandSingleSchemaField: true,
        expandDefaultServerVariables: true,
        disableSearch: false,
        nativeScrollbars: true,
        simpleOneOfModel: false,
        sortEnumValuesAlphabetically: true,
        sortOperationsAlphabetically: false,
        sortTagsAlphabetically: true,
        docExpansion: 'list',
        suppressWarnings: true
      }
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('Full Featured API');
    expect(sentHtml).toContain('1976d2');
    expect(sentHtml).toContain('Roboto');
    expect(sentHtml).toContain('full-nonce');
  });

  test('should not modify response status code', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      statusCode: 200,
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.statusCode).toBe(200);
  });

  test('should handle middleware invocation with headers set', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn(),
      getHeader: jest.fn(),
      setHeader: jest.fn()
    };
    const mockReq = {
      headers: {
        'content-type': 'application/json',
        'user-agent': 'test-agent'
      }
    };

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalledWith('html');
    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should handle middleware with POST request method', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {
      method: 'POST',
      body: { some: 'data' }
    };

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalledWith('html');
    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should handle middleware with query parameters in request', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {
      query: { version: '2', format: 'json' }
    };

    middleware(mockReq as any, mockRes as any);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('http://example.com/spec.json');
  });

  test('should handle middleware with params in request', () => {
    const middleware = redocExpressMiddleware({
      title: 'API',
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {
      params: { id: '123', version: 'v2' }
    };

    middleware(mockReq as any, mockRes as any);

    expect(mockRes.type).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();
  });

  test('should return consistent output for same input', () => {
    const options = {
      title: 'API',
      specUrl: 'http://example.com/spec.json',
      nonce: 'test-nonce'
    };

    const middleware1 = redocExpressMiddleware(options);
    const middleware2 = redocExpressMiddleware(options);

    const mockRes1 = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const mockRes2 = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const mockReq = {};

    middleware1(mockReq as any, mockRes1 as any);
    middleware2(mockReq as any, mockRes2 as any);

    const html1 = mockRes1.send.mock.calls[0][0];
    const html2 = mockRes2.send.mock.calls[0][0];

    expect(html1).toBe(html2);
  });

  test('should handle edge case with very long option values', () => {
    const longString = 'x'.repeat(10000);
    const middleware = redocExpressMiddleware({
      title: longString,
      specUrl: 'http://example.com/spec.json'
    });

    const mockRes = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const mockReq = {};

    expect(() => {
      middleware(mockReq as any, mockRes as any);
    }).not.toThrow();

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain(longString);
  });
});
