import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import { app } from '../../app';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Ride Documentation',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    components: {
      schemas: {
        Driver: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The auto-generated id of the driver' },
            email: { type: 'string', format: 'email', description: "The driver's email" },
            password: { type: 'string', description: "The driver's password" },
            firstName: { type: 'string', description: "The driver's first name" },
            lastName: { type: 'string', description: "The driver's last name" },
            dateOfBirth: { type: 'string', format: 'date', nullable: true, description: "The driver's date of birth" },
            createdAt: { type: 'string', format: 'date-time', description: "The date and time when the driver was created" },
            updatedAt: { type: 'string', format: 'date-time', description: "The date and time when the driver was last updated" }
          },
          required: ['email', 'password', 'firstName', 'lastName']
        },
        DriverPayload: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: "The driver's email" },
            password: { type: 'string', description: "The driver's password" },
            firstName: { type: 'string', description: "The driver's first name" },
            lastName: { type: 'string', description: "The driver's last name" },
            dateOfBirth: { type: 'string', format: 'date', nullable: true, description: "The driver's date of birth" }
          }
        },
        DriverResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The auto-generated id of the driver' },
            email: { type: 'string', format: 'email', description: "The driver's email" },
            firstName: { type: 'string', description: "The driver's first name" },
            lastName: { type: 'string', description: "The driver's last name" },
            dateOfBirth: { type: 'string', format: 'date', nullable: true, description: "The driver's date of birth" },
            createdAt: { type: 'string', format: 'date-time', description: "The date and time when the driver was created" },
            updatedAt: { type: 'string', format: 'date-time', description: "The date and time when the driver was last updated" }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The auto-generated id of the customer' },
            email: { type: 'string', format: 'email', description: "The customer's email" },
            password: { type: 'string', description: "The customer's password" },
            firstName: { type: 'string', description: "The customer's first name" },
            lastName: { type: 'string', description: "The customer's last name" },
            createdAt: { type: 'string', format: 'date-time', description: "The date and time when the customer was created" },
            updatedAt: { type: 'string', format: 'date-time', description: "The date and time when the customer was last updated" }
          },
          required: ['email', 'password', 'firstName', 'lastName']
        },
        CustomerPayload: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: "The customer's email" },
            password: { type: 'string', description: "The customer's password" },
            firstName: { type: 'string', description: "The customer's first name" },
            lastName: { type: 'string', description: "The customer's last name" }
          }
        },
        CustomerUpdatePayload: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: "The new customer's email" },
            password: { type: 'string', description: "The new customer's password" },
            firstName: { type: 'string', description: "The new customer's first name" },
            lastName: { type: 'string', description: "The new customer's last name" }
          }
        },
        CustomerResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The auto-generated id of the customer' },
            email: { type: 'string', format: 'email', description: "The customer's email" },
            firstName: { type: 'string', description: "The customer's first name" },
            lastName: { type: 'string', description: "The customer's last name" },
            createdAt: { type: 'string', format: 'date-time', description: "The date and time when the customer was created" },
            updatedAt: { type: 'string', format: 'date-time', description: "The date and time when the customer was last updated" }
          }
        },
        SessionPayload: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: "The user's email" },
            password: { type: 'string', description: "The user's password" }
          }
        },
        SessionResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' }
          }
        },
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The auto-generated id of the trip' },
            source: { type: 'string', description: 'The source of the trip' },
            destination: { type: 'string', description: 'The destination of the trip' },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], description: 'The status of the trip' },
            updatedAt: { type: 'string', format: 'date-time', description: 'The date and time when the trip was last updated' },
            customerId: { type: 'integer', description: 'The id of the customer for the trip' },
            driverId: { type: 'integer', description: 'The id of the driver for the trip' },
            paymentId: { type: 'integer', description: 'The id of the payment for the trip' },
          },
          required: ['source', 'destination', 'status', 'customerId', 'driverId', 'paymentId']
        },
        TripPayload: {
          type: 'object',
          properties: {
            source: { type: 'string', description: 'The source of the trip' },
            destination: { type: 'string', description: 'The destination of the trip' },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], description: 'The status of the trip' },
            customerId: { type: 'integer', description: 'The id of the customer for the trip' },
            driverId: { type: 'integer', description: 'The id of the driver for the trip' },
            paymentId: { type: 'integer', description: 'The id of the payment for the trip' },
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'The auto-generated id of the payment' },
            method: { type: 'string', enum: ['CASH', 'CARD'], description: 'The payment method (CASH or CARD)' },
            amount: { type: 'number', description: 'The amount of the payment' },
            createdAt: { type: 'string', format: 'date-time', description: 'The date and time when the payment was created' },
          },
          required: ['method', 'amount'],
        },
        PaymentPayload: {
          type: 'object',
          properties: {
            method: { type: 'string', enum: ['CASH', 'CARD'], description: 'The payment method (CASH or CARD)' },
            amount: { type: 'number', description: 'The amount of the payment' },
          },
          required: ['method', 'amount'],
        },
      },
    },
  },
  apis: ['././src/*/routes.ts'], // Caminho para os arquivos de rotas
  paths: {
    '/customers': {
      get: {
        summary: 'Get a list of customers',
        responses: {
          200: {
            description: 'A list of customers',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/CustomerResponse'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CustomerPayload'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Customer created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CustomerResponse'
                }
              }
            }
          }
        }
      }
    },
    '/session': {
      post: {
        summary: 'Authenticate user session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SessionPayload'
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User authenticated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionResponse',
                }, 
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/customer': {
      post: {
        summary: 'Authenticate user customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SessionPayload'
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User authenticated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionResponse',
                }, 
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/trips': {
      get: {
        summary: 'Get a list of trips',
        responses: {
          200: {
            description: 'A list of trips',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Trip'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new trip',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TripPayload'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Trip created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Trip'
                }
              }
            }
          }
        }
      }
    }
  }
};

const swaggerSpec = swaggerJsdoc(options);

export const initSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};