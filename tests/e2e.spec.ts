import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import redocExpressMiddleware from '../src/index';

declare module 'express-serve-static-core' {
  interface Request {
    timestamp?: Date;
  }
}

describe('End-to-End: Real-world usage scenario', () => {
  let app: express.Application;

  const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      version: '1.0.0',
      description: 'A simple sample API for testing redoc-express'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    paths: {
      '/api/hello': {
        get: {
          tags: ['Hello'],
          summary: 'Get a greeting',
          description: 'Returns a simple greeting message',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Hello, World!'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          description: 'Returns a list of all users',
          responses: {
            '200': {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Users'],
          summary: 'Create a new user',
          description: 'Creates a new user with the provided information',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'John Doe'
                    },
                    email: {
                      type: 'string',
                      example: 'john@example.com'
                    }
                  },
                  required: ['name', 'email']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      email: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get a user by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'User ID'
            }
          ],
          responses: {
            '200': {
              description: 'User found',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      email: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'User not found'
            }
          }
        }
      }
    }
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('Basic real-world setup', () => {
    test('should serve swagger.json endpoint', async () => {
      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      const response = await request(app)
        .get('/docs/swagger.json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('openapi', '3.0.0');
      expect(response.body).toHaveProperty('info');
      expect(response.body.info.title).toBe('Sample API');
    });

    test('should serve ReDoc documentation at /docs endpoint', async () => {
      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'Sample API Documentation',
          specUrl: '/docs/swagger.json'
        })
      );

      const response = await request(app)
        .get('/docs')
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('Sample API Documentation');
      expect(response.text).toContain('/docs/swagger.json');
      expect(response.text).toContain('Redoc.init');
      expect(response.text).toContain('redoc-container');
    });

    test('should serve API endpoints alongside documentation', async () => {
      const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
      ];

      app.get('/api/hello', (req, res) => {
        res.json({ message: 'Hello, World!' });
      });

      app.get('/api/users', (req, res) => {
        res.json(users);
      });

      app.get('/api/users/:id', (req, res) => {
        const user = users.find((u) => u.id === parseInt(req.params.id));
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      });

      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'Sample API Documentation',
          specUrl: '/docs/swagger.json'
        })
      );

      const helloResponse = await request(app).get('/api/hello').expect(200);
      expect(helloResponse.body.message).toBe('Hello, World!');

      const usersResponse = await request(app).get('/api/users').expect(200);
      expect(usersResponse.body).toHaveLength(2);

      const userResponse = await request(app).get('/api/users/1').expect(200);
      expect(userResponse.body.name).toBe('Alice');

      const docsResponse = await request(app).get('/docs').expect(200);
      expect(docsResponse.text).toContain('Sample API Documentation');
    });
  });

  describe('Advanced real-world scenarios', () => {
    test('should work with custom redocOptions', async () => {
      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'Sample API Documentation',
          specUrl: '/docs/swagger.json',
          redocOptions: {
            theme: {
              colors: {
                primary: {
                  main: '#6EC5AB'
                }
              },
              typography: {
                fontFamily:
                  '"museo-sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
              }
            },
            hideDownloadButton: true,
            scrollYOffset: 80
          }
        })
      );

      const response = await request(app).get('/docs').expect(200);

      expect(response.text).toContain('#6EC5AB');
      expect(response.text).toContain('museo-sans');
      expect(response.text).toContain('hideDownloadButton');
      expect(response.text).toContain('80');
    });

    test('should work with external OpenAPI spec URL', async () => {
      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'Petstore API',
          specUrl: 'http://petstore.swagger.io/v2/swagger.json'
        })
      );

      const response = await request(app).get('/docs').expect(200);

      expect(response.text).toContain('Petstore API');
      expect(response.text).toContain(
        'http://petstore.swagger.io/v2/swagger.json'
      );
    });

    test('should work with nonce for CSP', async () => {
      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'Sample API Documentation',
          specUrl: '/docs/swagger.json',
          nonce: 'secure-nonce-12345'
        })
      );

      const response = await request(app).get('/docs').expect(200);

      expect(response.text).toContain("nonce='secure-nonce-12345'");
    });

    test('should work with multiple documentation endpoints', async () => {
      const v1Spec = {
        ...swaggerSpec,
        info: { ...swaggerSpec.info, version: '1.0.0' }
      };
      const v2Spec = {
        ...swaggerSpec,
        info: { ...swaggerSpec.info, version: '2.0.0' }
      };

      app.get('/docs/v1/swagger.json', (req, res) => {
        res.json(v1Spec);
      });

      app.get('/docs/v2/swagger.json', (req, res) => {
        res.json(v2Spec);
      });

      app.get(
        '/docs/v1',
        redocExpressMiddleware({
          title: 'API v1 Documentation',
          specUrl: '/docs/v1/swagger.json'
        })
      );

      app.get(
        '/docs/v2',
        redocExpressMiddleware({
          title: 'API v2 Documentation',
          specUrl: '/docs/v2/swagger.json'
        })
      );

      const v1Response = await request(app).get('/docs/v1').expect(200);
      expect(v1Response.text).toContain('API v1 Documentation');
      expect(v1Response.text).toContain('/docs/v1/swagger.json');

      const v2Response = await request(app).get('/docs/v2').expect(200);
      expect(v2Response.text).toContain('API v2 Documentation');
      expect(v2Response.text).toContain('/docs/v2/swagger.json');
    });

    test('should work in a complete application flow', async () => {
      const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
      ];
      let nextId = 3;

      app.get('/api/hello', (req, res) => {
        res.json({ message: 'Hello, World!' });
      });

      app.get('/api/users', (req, res) => {
        res.json(users);
      });

      app.post('/api/users', (req, res) => {
        const newUser = {
          id: nextId++,
          name: req.body.name,
          email: req.body.email
        };
        users.push(newUser);
        res.status(201).json(newUser);
      });

      app.get('/api/users/:id', (req, res) => {
        const user = users.find((u) => u.id === parseInt(req.params.id));
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      });

      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'Sample API Documentation',
          specUrl: '/docs/swagger.json',
          redocOptions: {
            hideDownloadButton: false,
            scrollYOffset: 50
          }
        })
      );

      const docsResponse = await request(app).get('/docs').expect(200);
      expect(docsResponse.text).toContain('Sample API Documentation');

      const specResponse = await request(app)
        .get('/docs/swagger.json')
        .expect(200);
      expect(specResponse.body.paths).toHaveProperty('/api/hello');
      expect(specResponse.body.paths).toHaveProperty('/api/users');

      const helloResponse = await request(app).get('/api/hello').expect(200);
      expect(helloResponse.body.message).toBe('Hello, World!');

      const createUserResponse = await request(app)
        .post('/api/users')
        .send({ name: 'Charlie', email: 'charlie@example.com' })
        .expect(201);
      expect(createUserResponse.body.id).toBe(3);
      expect(createUserResponse.body.name).toBe('Charlie');

      const usersResponse = await request(app).get('/api/users').expect(200);
      expect(usersResponse.body).toHaveLength(3);

      const userResponse = await request(app).get('/api/users/3').expect(200);
      expect(userResponse.body.email).toBe('charlie@example.com');

      const notFoundResponse = await request(app)
        .get('/api/users/999')
        .expect(404);
      expect(notFoundResponse.body.error).toBe('User not found');
    });
  });

  describe('Edge cases in real-world usage', () => {
    test('should handle requests to documentation before API routes', async () => {
      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'API Docs',
          specUrl: '/docs/swagger.json'
        })
      );

      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get('/api/hello', (req, res) => {
        res.json({ message: 'Hello' });
      });

      await request(app).get('/docs').expect(200);
      await request(app).get('/api/hello').expect(200);
    });

    test('should not interfere with other routes', async () => {
      app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'API Docs',
          specUrl: '/docs/swagger.json'
        })
      );

      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      const healthResponse = await request(app).get('/health').expect(200);
      expect(healthResponse.body.status).toBe('ok');

      const docsResponse = await request(app).get('/docs').expect(200);
      expect(docsResponse.text).toContain('API Docs');
    });

    test('should work with middleware chain', async () => {
      const requestLogger = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        req.timestamp = new Date();
        next();
      };

      app.use(requestLogger);

      app.get('/docs/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });

      app.get(
        '/docs',
        redocExpressMiddleware({
          title: 'API Docs',
          specUrl: '/docs/swagger.json'
        })
      );

      const response = await request(app).get('/docs').expect(200);
      expect(response.text).toContain('API Docs');
    });
  });
});
