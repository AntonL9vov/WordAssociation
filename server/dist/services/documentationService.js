"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationService = void 0;
class DocumentationService {
    constructor() {
        this.eventMetadata = new Map();
    }
    static getInstance() {
        if (!DocumentationService.instance) {
            DocumentationService.instance = new DocumentationService();
        }
        return DocumentationService.instance;
    }
    /**
     * Регистрирует метаданные для события
     */
    registerEvent(event, metadata) {
        this.eventMetadata.set(event, {
            event,
            ...metadata
        });
    }
    /**
     * Автоматически извлекает метаданные из SocketEvents
     */
    extractFromSocketEvents(events, category) {
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
    extractParametersFromFunction(callback) {
        const functionStr = callback.toString();
        const paramMatch = functionStr.match(/\(([^)]*)\)/);
        if (!paramMatch)
            return [];
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
    extractResponseFromFunction(callback) {
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
    inferTypeFromName(paramName) {
        if (paramName.includes('Id'))
            return 'string';
        if (paramName.includes('name'))
            return 'string';
        if (paramName.includes('word'))
            return 'string';
        if (paramName.includes('game'))
            return 'Game';
        if (paramName.includes('user'))
            return 'User';
        if (paramName.includes('error'))
            return 'Error';
        return 'any';
    }
    /**
     * Генерирует описание параметра
     */
    generateParameterDescription(paramName) {
        if (paramName.includes('Id'))
            return 'Unique identifier';
        if (paramName.includes('name'))
            return 'User or game name';
        if (paramName.includes('word'))
            return 'Word to emit';
        if (paramName.includes('game'))
            return 'Game object';
        if (paramName.includes('user'))
            return 'User object';
        return 'Parameter';
    }
    /**
     * Генерирует пример значения
     */
    generateExample(paramName) {
        if (paramName.includes('Id'))
            return '123';
        if (paramName.includes('name'))
            return 'John Doe';
        if (paramName.includes('word'))
            return 'hello';
        return null;
    }
    /**
     * Генерирует описание события
     */
    generateDescription(event, direction) {
        const action = direction === 'incoming' ? 'Triggers' : 'Emits';
        return `${action} ${event.replace(/:/g, ' ')}`;
    }
    /**
     * Получает полную документацию
     */
    getDocumentation() {
        const events = Array.from(this.eventMetadata.values());
        const categories = [...new Set(events.map(e => e.category))];
        return {
            version: '1.0.0',
            title: 'WebSocket API Documentation',
            description: 'Real-time multiplayer game WebSocket API',
            events,
            categories
        };
    }
    /**
     * Получает документацию в формате OpenAPI
     */
    getOpenAPISpec() {
        const doc = this.getDocumentation();
        const events = Array.from(this.eventMetadata.values());
        // Группируем события по категориям
        const eventsByCategory = events.reduce((acc, event) => {
            if (!acc[event.category]) {
                acc[event.category] = [];
            }
            acc[event.category].push(event);
            return acc;
        }, {});
        // Создаем пути для каждого события
        const paths = {};
        Object.entries(eventsByCategory).forEach(([category, categoryEvents]) => {
            categoryEvents.forEach(event => {
                const pathKey = `/socket/${category.toLowerCase()}/${event.event.replace(/:/g, '/')}`;
                paths[pathKey] = {
                    post: {
                        tags: [category],
                        summary: event.event,
                        description: event.description || `WebSocket event: ${event.event}`,
                        operationId: event.event.replace(/:/g, '_'),
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
        return {
            openapi: '3.0.0',
            info: {
                title: doc.title,
                description: doc.description,
                version: doc.version
            },
            servers: [
                {
                    url: 'ws://localhost:3000',
                    description: 'WebSocket server'
                }
            ],
            paths,
            components: {
                schemas: this.generateSchemas()
            },
            tags: doc.categories.map(category => ({
                name: category,
                description: `${category} WebSocket events`
            }))
        };
    }
    /**
     * Генерирует свойства из параметров события
     */
    generatePropertiesFromParameters(parameters) {
        const properties = {};
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
    generateExampleFromParameters(parameters) {
        const example = {};
        parameters.forEach(param => {
            example[param.name] = param.example;
        });
        return example;
    }
    /**
     * Получает OpenAPI тип из внутреннего типа
     */
    getOpenAPIType(type) {
        const typeMap = {
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
    getSchemaForType(type) {
        if (type === 'object') {
            return { type: 'object' };
        }
        const schemas = this.generateSchemas();
        return schemas[type] || { type: 'object' };
    }
    /**
     * Генерирует схемы для OpenAPI
     */
    generateSchemas() {
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
exports.DocumentationService = DocumentationService;
