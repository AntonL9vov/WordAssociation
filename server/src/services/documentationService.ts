import { SocketEvents } from "../types/base";
import { SocketDocumentation, SocketEventMetadata, EventParameter } from "../types/documentation";

export class DocumentationService {
  private static instance: DocumentationService;
  private eventMetadata: Map<string, SocketEventMetadata> = new Map();
  private restApiMetadata: Map<string, any> = new Map();

  static getInstance(): DocumentationService {
    if (!DocumentationService.instance) {
      DocumentationService.instance = new DocumentationService();
    }
    return DocumentationService.instance;
  }

  /**
   * Регистрирует метаданные для события
   */
  registerEvent(
    event: string,
    metadata: Omit<SocketEventMetadata, 'event'>
  ): void {
    this.eventMetadata.set(event, {
      event,
      ...metadata
    });
  }

  /**
   * Регистрирует REST API endpoint
   */
  registerRestEndpoint(
    method: string,
    path: string,
    metadata: {
      summary: string;
      description?: string;
      tags: string[];
      parameters?: any[];
      requestBody?: any;
      responses: Record<string, any>;
    }
  ): void {
    const key = `${method.toUpperCase()} ${path}`;
    this.restApiMetadata.set(key, {
      method: method.toUpperCase(),
      path,
      ...metadata
    });
  }

  /**
   * Автоматически извлекает метаданные из SocketEvents
   */
  extractFromSocketEvents(
    events: Record<string, SocketEvents>,
    category: string
  ): void {
    Object.entries(events).forEach(([groupName, socketEvents]) => {
      // Обрабатываем входящие события (handlers)
      Object.entries(socketEvents.handler).forEach(([eventName, handler]) => {
        const event = handler.event;
        const parameters = this.extractParametersFromFunction(handler.callback);
        
        this.registerEvent(event, {
          description: this.generateDescription(event, 'incoming'),
          parameters,
          category,
          direction: 'incoming'
        });
      });

      // Обрабатываем исходящие события (emits)
      Object.entries(socketEvents.emit).forEach(([eventName, emit]) => {
        const event = emit.event;
        const response = this.extractResponseFromFunction(emit.callback);
        
        this.registerEvent(event, {
          description: this.generateDescription(event, 'outgoing'),
          response,
          category,
          direction: 'outgoing'
        });
      });
    });
  }

  /**
   * Извлекает параметры из функции обратного вызова
   */
  private extractParametersFromFunction(callback: Function): EventParameter[] {
    const functionStr = callback.toString();
    const paramMatch = functionStr.match(/\(([^)]*)\)/);
    
    if (!paramMatch) return [];

    const params = paramMatch[1].split(',').map(p => p.trim());
    return params
      .filter(param => param && !param.startsWith('socket') && !param.startsWith('service'))
      .map((param, index) => ({
        name: param,
        type: this.inferTypeFromName(param),
        description: this.generateParameterDescription(param),
        required: true,
        example: this.generateExample(param)
      }));
  }

  /**
   * Извлекает информацию о ответе из функции обратного вызова
   */
  private extractResponseFromFunction(callback: Function): any {
    // Упрощенная логика - в реальном проекте можно использовать более сложный анализ
    return {
      type: 'object',
      description: 'Response data',
      example: {}
    };
  }

  /**
   * Определяет тип параметра по его имени
   */
  private inferTypeFromName(paramName: string): string {
    if (paramName.includes('Id')) return 'string';
    if (paramName.includes('name')) return 'string';
    if (paramName.includes('word')) return 'string';
    if (paramName.includes('game')) return 'Game';
    if (paramName.includes('user')) return 'User';
    if (paramName.includes('error')) return 'Error';
    return 'any';
  }

  /**
   * Генерирует описание параметра
   */
  private generateParameterDescription(paramName: string): string {
    if (paramName.includes('Id')) return 'Unique identifier';
    if (paramName.includes('name')) return 'User or game name';
    if (paramName.includes('word')) return 'Word to emit';
    if (paramName.includes('game')) return 'Game object';
    if (paramName.includes('user')) return 'User object';
    return 'Parameter';
  }

  /**
   * Генерирует пример значения
   */
  private generateExample(paramName: string): any {
    if (paramName.includes('Id')) return '123';
    if (paramName.includes('name')) return 'John Doe';
    if (paramName.includes('word')) return 'hello';
    return null;
  }

  /**
   * Генерирует описание события
   */
  private generateDescription(event: string, direction: 'incoming' | 'outgoing'): string {
    const action = direction === 'incoming' ? 'Triggers' : 'Emits';
    return `${action} ${event.replace(/:/g, ' ')}`;
  }

  /**
   * Получает полную документацию
   */
  getDocumentation(): SocketDocumentation {
    const events = Array.from(this.eventMetadata.values());
    const categories = [...new Set(events.map(e => e.category))];

    return {
      version: '1.0.0',
      title: 'Word Association Game API Documentation',
      description: 'Real-time word association game API with WebSocket events and REST endpoints',
      events,
      categories
    };
  }

  /**
   * Получает документацию в формате OpenAPI
   */
  getOpenAPISpec(): any {
    const doc = this.getDocumentation();
    const events = Array.from(this.eventMetadata.values());
    const restEndpoints = Array.from(this.restApiMetadata.values());
    
    // Группируем события по категориям
    const eventsByCategory = events.reduce((acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    }, {} as Record<string, SocketEventMetadata[]>);

    // Создаем пути для WebSocket событий
    const paths: any = {};
    
    Object.entries(eventsByCategory).forEach(([category, categoryEvents]) => {
      categoryEvents.forEach(event => {
        const pathKey = `/socket/${category.toLowerCase()}/${event.event.replace(/:/g, '/')}`;
        
        paths[pathKey] = {
          post: {
            tags: [`WebSocket - ${category}`],
            summary: event.event,
            description: event.description || `WebSocket event: ${event.event}`,
            operationId: `ws_${event.event.replace(/:/g, '_')}`,
            requestBody: event.parameters && event.parameters.length > 0 ? {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: this.generatePropertiesFromParameters(event.parameters),
                    required: event.parameters.filter(p => p.required).map(p => p.name)
                  },
                  examples: {
                    example: {
                      summary: 'Example request',
                      value: this.generateExampleFromParameters(event.parameters)
                    }
                  }
                }
              }
            } : undefined,
            responses: {
              '200': {
                description: 'Event processed successfully',
                content: {
                  'application/json': {
                    schema: event.response ? {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: this.getSchemaForType(event.response.type)
                      }
                    } : {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                      }
                    },
                    examples: {
                      example: {
                        summary: 'Example response',
                        value: event.response?.example || { success: true, message: 'Event processed' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Bad request',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        error: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        };
      });
    });

    // Добавляем REST API endpoints
    restEndpoints.forEach(endpoint => {
      const pathKey = endpoint.path;
      const method = endpoint.method.toLowerCase();
      
      if (!paths[pathKey]) {
        paths[pathKey] = {};
      }
      
      paths[pathKey][method] = {
        tags: endpoint.tags,
        summary: endpoint.summary,
        description: endpoint.description || endpoint.summary,
        operationId: `rest_${method}_${pathKey.replace(/[^a-zA-Z0-9]/g, '_')}`,
        parameters: endpoint.parameters || [],
        requestBody: endpoint.requestBody,
        responses: endpoint.responses
      };
    });

    return {
      openapi: '3.0.0',
      info: {
        title: doc.title,
        description: doc.description,
        version: doc.version,
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'WebSocket server'
        },
        {
          url: 'http://localhost:3001',
          description: 'REST API server'
        }
      ],
      paths,
      components: {
        schemas: this.generateSchemas(),
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      tags: [
        {
          name: 'WebSocket - Users',
          description: 'WebSocket events for user management'
        },
        {
          name: 'WebSocket - Games',
          description: 'WebSocket events for game management'
        },
        {
          name: 'REST - Users',
          description: 'REST API endpoints for user management'
        },
        {
          name: 'REST - Games',
          description: 'REST API endpoints for game management'
        }
      ]
    };
  }

  /**
   * Генерирует свойства из параметров события
   */
  private generatePropertiesFromParameters(parameters: EventParameter[]): any {
    const properties: any = {};
    
    parameters.forEach(param => {
      properties[param.name] = {
        type: this.getOpenAPIType(param.type),
        description: param.description,
        example: param.example
      };
    });
    
    return properties;
  }

  /**
   * Генерирует пример из параметров
   */
  private generateExampleFromParameters(parameters: EventParameter[]): any {
    const example: any = {};
    
    parameters.forEach(param => {
      example[param.name] = param.example;
    });
    
    return example;
  }

  /**
   * Получает OpenAPI тип из внутреннего типа
   */
  private getOpenAPIType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'User': 'object',
      'Game': 'object',
      'Word': 'object',
      'Error': 'object',
      'any': 'object'
    };
    
    return typeMap[type] || 'object';
  }

  /**
   * Получает схему для типа
   */
  private getSchemaForType(type: string): any {
    if (type === 'object') {
      return { type: 'object' };
    }
    
    const schemas = this.generateSchemas();
    return schemas[type] || { type: 'object' };
  }

  /**
   * Генерирует схемы для OpenAPI
   */
  private generateSchemas(): any {
    return {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user-123' },
          name: { type: 'string', example: 'John Doe' }
        },
        required: ['id', 'name'],
        example: {
          id: 'user-123',
          name: 'John Doe'
        }
      },
      Game: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'game-123' },
          rounds: { 
            type: 'array',
            items: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'round-123' },
                words: { 
                  type: 'array',
                  items: { $ref: '#/components/schemas/Word' }
                },
                createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
                updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
              }
            }
          },
          createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          startWord: { type: 'string', example: 'hello' },
          isFinished: { type: 'boolean', example: false },
          players: { 
            type: 'array',
            items: { $ref: '#/components/schemas/User' }
          },
          isStarted: { type: 'boolean', example: false }
        },
        required: ['id', 'isStarted', 'isFinished'],
        example: {
          id: 'game-123',
          rounds: [
            {
              id: 'round-123',
              words: [
                {
                  id: 'word-123',
                  word: 'world',
                  playerId: 'user-123',
                  playerName: 'John Doe',
                  timestamp: '2023-01-01T00:00:00Z'
                }
              ],
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            }
          ],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          startWord: 'hello',
          isFinished: false,
          players: [
            { id: 'user-123', name: 'John Doe' },
            { id: 'user-456', name: 'Jane Smith' }
          ],
          isStarted: true
        }
      },
      Word: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'word-123' },
          word: { type: 'string', example: 'world' },
          playerId: { type: 'string', example: 'user-123' },
          playerName: { type: 'string', example: 'John Doe' },
          timestamp: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
        },
        required: ['id', 'word', 'playerId', 'playerName'],
        example: {
          id: 'word-123',
          word: 'world',
          playerId: 'user-123',
          playerName: 'John Doe',
          timestamp: '2023-01-01T00:00:00Z'
        }
      },
      Round: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'round-123' },
          words: { 
            type: 'array',
            items: { $ref: '#/components/schemas/Word' }
          },
          createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
        },
        required: ['id', 'words', 'createdAt', 'updatedAt'],
        example: {
          id: 'round-123',
          words: [
            {
              id: 'word-123',
              word: 'world',
              playerId: 'user-123',
              playerName: 'John Doe',
              timestamp: '2023-01-01T00:00:00Z'
            },
            {
              id: 'word-456',
              word: 'hello',
              playerId: 'user-456',
              playerName: 'Jane Smith',
              timestamp: '2023-01-01T00:01:00Z'
            }
          ],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:01:00Z'
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Error occurred' },
          code: { type: 'string', example: 'VALIDATION_ERROR' }
        },
        required: ['message'],
        example: {
          message: 'Game not found',
          code: 'GAME_NOT_FOUND'
        }
      }
    };
  }
} 