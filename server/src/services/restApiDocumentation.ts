import { DocumentationService } from './documentationService';

export class RestApiDocumentation {
  private docService: DocumentationService;

  constructor() {
    this.docService = DocumentationService.getInstance();
  }

  /**
   * Регистрирует все REST API endpoints для документации
   */
  registerAllEndpoints(): void {
    this.registerUserEndpoints();
    this.registerGameEndpoints();
    this.registerHealthEndpoints();
  }

  /**
   * Регистрирует endpoints для управления пользователями
   */
  private registerUserEndpoints(): void {
    // GET /api/users
    this.docService.registerRestEndpoint('GET', '/api/users', {
      summary: 'Get all users',
      description: 'Retrieve a list of all users in the system',
      tags: ['REST - Users'],
      responses: {
        '200': {
          description: 'List of users retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' }
                  }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    users: [
                      { id: '1', name: 'John Doe' },
                      { id: '2', name: 'Jane Smith' }
                    ]
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // GET /api/users/{id}
    this.docService.registerRestEndpoint('GET', '/api/users/{id}', {
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their ID',
      tags: ['REST - Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID',
          schema: { type: 'string' },
          example: '1'
        }
      ],
      responses: {
        '200': {
          description: 'User retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/User' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    user: { id: '1', name: 'John Doe' }
                  }
                }
              }
            }
          }
        },
        '404': {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // POST /api/users
    this.docService.registerRestEndpoint('POST', '/api/users', {
      summary: 'Create a new user',
      description: 'Create a new user with the provided name',
      tags: ['REST - Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'User name',
                  example: 'John Doe'
                }
              },
              required: ['name']
            },
            examples: {
              example: {
                summary: 'Example request',
                value: { name: 'John Doe' }
              }
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
                  user: { $ref: '#/components/schemas/User' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    user: { id: '3', name: 'John Doe' }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad request - invalid input',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // PUT /api/users/{id}
    this.docService.registerRestEndpoint('PUT', '/api/users/{id}', {
      summary: 'Update user',
      description: 'Update an existing user\'s information',
      tags: ['REST - Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID',
          schema: { type: 'string' },
          example: '1'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Updated user name',
                  example: 'John Updated'
                }
              },
              required: ['name']
            },
            examples: {
              example: {
                summary: 'Example request',
                value: { name: 'John Updated' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/User' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    user: { id: '1', name: 'John Updated' }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad request - invalid input',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '404': {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // DELETE /api/users/{id}
    this.docService.registerRestEndpoint('DELETE', '/api/users/{id}', {
      summary: 'Delete user',
      description: 'Delete a user by their ID',
      tags: ['REST - Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID',
          schema: { type: 'string' },
          example: '1'
        }
      ],
      responses: {
        '204': {
          description: 'User deleted successfully'
        },
        '404': {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Регистрирует endpoints для управления играми
   */
  private registerGameEndpoints(): void {
    // GET /api/games
    this.docService.registerRestEndpoint('GET', '/api/games', {
      summary: 'Get all games',
      description: 'Retrieve a list of all games in the system',
      tags: ['REST - Games'],
      responses: {
        '200': {
          description: 'List of games retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  games: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Game' }
                  }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    games: [
                      {
                        id: 'game-1',
                        rounds: [],
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        startWord: 'hello',
                        isFinished: false,
                        players: [
                          { id: '1', name: 'John Doe' }
                        ],
                        isStarted: true
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // GET /api/games/{id}
    this.docService.registerRestEndpoint('GET', '/api/games/{id}', {
      summary: 'Get game by ID',
      description: 'Retrieve a specific game by its ID',
      tags: ['REST - Games'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Game ID',
          schema: { type: 'string' },
          example: 'game-1'
        }
      ],
      responses: {
        '200': {
          description: 'Game retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  game: { $ref: '#/components/schemas/Game' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    game: {
                      id: 'game-1',
                      rounds: [],
                      createdAt: '2023-01-01T00:00:00Z',
                      updatedAt: '2023-01-01T00:00:00Z',
                      startWord: 'hello',
                      isFinished: false,
                      players: [
                        { id: '1', name: 'John Doe' }
                      ],
                      isStarted: true
                    }
                  }
                }
              }
            }
          }
        },
        '404': {
          description: 'Game not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // POST /api/games
    this.docService.registerRestEndpoint('POST', '/api/games', {
      summary: 'Create a new game',
      description: 'Create a new game with the provided player ID',
      tags: ['REST - Games'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                playerId: {
                  type: 'string',
                  description: 'ID of the player creating the game',
                  example: 'user-1'
                }
              },
              required: ['playerId']
            },
            examples: {
              example: {
                summary: 'Example request',
                value: { playerId: 'user-1' }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Game created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  game: { $ref: '#/components/schemas/Game' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    game: {
                      id: 'game-2',
                      rounds: [],
                      createdAt: '2023-01-01T00:00:00Z',
                      updatedAt: '2023-01-01T00:00:00Z',
                      startWord: '',
                      isFinished: false,
                      players: [
                        { id: 'user-1', name: 'John Doe' }
                      ],
                      isStarted: false
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad request - invalid input',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // POST /api/games/{id}/start
    this.docService.registerRestEndpoint('POST', '/api/games/{id}/start', {
      summary: 'Start a game',
      description: 'Start a game with a starting word',
      tags: ['REST - Games'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Game ID',
          schema: { type: 'string' },
          example: 'game-1'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                startWord: {
                  type: 'string',
                  description: 'Starting word for the game',
                  example: 'hello'
                }
              },
              required: ['startWord']
            },
            examples: {
              example: {
                summary: 'Example request',
                value: { startWord: 'hello' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Game started successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  game: { $ref: '#/components/schemas/Game' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    game: {
                      id: 'game-1',
                      rounds: [],
                      createdAt: '2023-01-01T00:00:00Z',
                      updatedAt: '2023-01-01T00:00:00Z',
                      startWord: 'hello',
                      isFinished: false,
                      players: [
                        { id: '1', name: 'John Doe' }
                      ],
                      isStarted: true
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad request - invalid input',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '404': {
          description: 'Game not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });

    // POST /api/games/{id}/join
    this.docService.registerRestEndpoint('POST', '/api/games/{id}/join', {
      summary: 'Join a game',
      description: 'Add a player to an existing game',
      tags: ['REST - Games'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Game ID',
          schema: { type: 'string' },
          example: 'game-1'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                playerId: {
                  type: 'string',
                  description: 'ID of the player joining the game',
                  example: 'user-2'
                }
              },
              required: ['playerId']
            },
            examples: {
              example: {
                summary: 'Example request',
                value: { playerId: 'user-2' }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Player joined game successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  game: { $ref: '#/components/schemas/Game' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    game: {
                      id: 'game-1',
                      rounds: [],
                      createdAt: '2023-01-01T00:00:00Z',
                      updatedAt: '2023-01-01T00:00:00Z',
                      startWord: 'hello',
                      isFinished: false,
                      players: [
                        { id: '1', name: 'John Doe' },
                        { id: 'user-2', name: 'Jane Smith' }
                      ],
                      isStarted: true
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad request - invalid input',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '404': {
          description: 'Game not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Регистрирует health check endpoints
   */
  private registerHealthEndpoints(): void {
    // GET /api/health
    this.docService.registerRestEndpoint('GET', '/api/health', {
      summary: 'Health check',
      description: 'Check the health status of the API server',
      tags: ['System'],
      responses: {
        '200': {
          description: 'Server is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              },
              examples: {
                example: {
                  summary: 'Example response',
                  value: {
                    status: 'OK',
                    timestamp: '2023-01-01T00:00:00Z'
                  }
                }
              }
            }
          }
        }
      }
    });
  }
} 