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
});
