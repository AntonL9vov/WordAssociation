import { SocketEvents } from "../types/base";
import { SocketDocumentation, SocketEventMetadata, EventParameter } from "../types/documentation";

export class DocumentationService {
  private static instance: DocumentationService;
  private eventMetadata: Map<string, SocketEventMetadata> = new Map();

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
      title: 'WebSocket API Documentation',
      description: 'Real-time multiplayer game WebSocket API',
      events,
      categories
    };
  }

  /**
   * Получает документацию в формате OpenAPI
   */
  getOpenAPISpec(): any {
    const doc = this.getDocumentation();
    
    return {
      openapi: '3.0.0',
      info: {
        title: doc.title,
        description: doc.description,
        version: doc.version
      },
      paths: {},
      components: {
        schemas: this.generateSchemas()
      },
      tags: doc.categories.map(category => ({
        name: category,
        description: `${category} events`
      }))
    };
  }

  /**
   * Генерирует схемы для OpenAPI
   */
  private generateSchemas(): any {
    return {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      },
      Game: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          rounds: { type: 'array' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          startWord: { type: 'string' },
          isFinished: { type: 'boolean' },
          players: { type: 'array', items: { $ref: '#/components/schemas/User' } },
          isStarted: { type: 'boolean' }
        }
      },
      Word: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          word: { type: 'string' },
          playerId: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    };
  }
} 