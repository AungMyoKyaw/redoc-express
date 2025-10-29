import { redocHtml } from '../src/redoc-html-template';
import redocExpressMiddleware from '../src/index';

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
            fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`
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

    middleware(mockReq, mockRes);

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

    middleware(mockReq, mockRes);

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

    middleware(mockReq, mockRes);

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

    middleware(mockReq, mockRes);

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

    middleware(mockReq, mockRes);

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
      middleware(mockReq, mockRes);
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

    middleware(mockReq, mockRes);

    const sentHtml = mockRes.send.mock.calls[0][0];
    expect(sentHtml).toContain('Partial Config API');
    expect(sentHtml).toContain('http://example.com/api.json');
    expect(sentHtml).toContain("nonce=''");
  });
});
