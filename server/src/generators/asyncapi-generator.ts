import { SocketEvents } from "../types/base";
import { gameSocketEvents } from "../socket-entities/game-scoket/game-socket-events";
import * as fs from 'fs';
import * as path from 'path';

export interface AsyncAPIMessage {
  contentType: string;
  payload: {
    type: string;
    properties?: any;
    examples?: any[];
  };
  examples?: any[];
  summary?: string;
  description?: string;
}

export interface AsyncAPIChannel {
  address?: string;
  messages: Record<string, AsyncAPIMessage>;
  parameters?: any;
  subscribe?: {
    message: any;
    summary?: string;
    description?: string;
  };
  publish?: {
    message: any;
    summary?: string;
    description?: string;
  };
}

export interface AsyncAPISpec {
  asyncapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact?: any;
    license?: any;
  };
  servers: Record<string, any>;
  channels: Record<string, AsyncAPIChannel>;
  components: {
    messages: Record<string, AsyncAPIMessage>;
    schemas: Record<string, any>;
  };
}

export class AsyncAPIGenerator {
  private eventCollections: Array<{
    name: string;
    events: Record<string, SocketEvents>;
  }> = [
    { name: 'Games', events: gameSocketEvents },
  ];

  /**
   * Генерирует AsyncAPI спецификацию из WebSocket событий
   */
  public generateAsyncAPISpec(): AsyncAPISpec {
    const channels: Record<string, AsyncAPIChannel> = {};
    const messages: Record<string, AsyncAPIMessage> = {};
    const schemas: Record<string, any> = {};

    // Обрабатываем каждую коллекцию событий
    this.eventCollections.forEach(({ name, events }) => {
      this.processEventCollection(name, events, channels, messages, schemas);
    });

    const spec: AsyncAPISpec = {
      asyncapi: '3.0.0',
      info: {
        title: 'Word Association Game WebSocket API',
        version: '1.0.0',
        description: 'Real-time WebSocket API for multiplayer word association game with automatic AsyncAPI documentation',
        contact: {
          name: 'WebSocket API Support',
          email: 'websocket-support@wordgame.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: {
        development: {
          host: 'localhost:3000',
          protocol: 'ws',
          description: 'WebSocket server for development',
          tags: [
            { name: 'development' },
            { name: 'websocket' }
          ]
        },
        production: {
          host: 'api.wordgame.com:3000', 
          protocol: 'wss',
          description: 'WebSocket server for production',
          tags: [
            { name: 'production' },
            { name: 'websocket' }
          ]
        }
      },
      channels,
      components: {
        messages,
        schemas: {
          ...schemas,
          ...this.getCommonSchemas()
        }
      }
    };

    return spec;
  }

  /**
   * Обрабатывает коллекцию событий
   */
  private processEventCollection(
    collectionName: string,
    events: Record<string, SocketEvents>,
    channels: Record<string, AsyncAPIChannel>,
    messages: Record<string, AsyncAPIMessage>,
    schemas: Record<string, any>
  ): void {
    Object.entries(events).forEach(([eventGroupName, socketEvents]) => {
      // Обрабатываем входящие события (handlers)
      if (socketEvents.handler) {
        Object.entries(socketEvents.handler).forEach(([handlerName, handler]) => {
          const eventName = handler.event;
          const channelName = eventName.replace(/:/g, '/');
          
          // Создаем канал для входящего события
          if (!channels[channelName]) {
            channels[channelName] = {
              address: channelName,
              messages: {}
            };
          }

          // Анализируем параметры из функции callback
          const parameters = this.extractParametersFromCallback(handler.callback);
          const messageId = `${eventName.replace(/:/g, '_')}_request`;
          
          const message: AsyncAPIMessage = {
            contentType: 'application/json',
            payload: {
              type: 'object',
              properties: this.generatePropertiesFromParameters(parameters),
              examples: [this.generateExampleFromParameters(parameters)]
            },
            summary: `${eventName} request`,
            description: `Incoming message for ${eventName} event`,
            examples: [this.generateExampleFromParameters(parameters)]
          };

          messages[messageId] = message;
          channels[channelName].subscribe = {
            message: { $ref: `#/components/messages/${messageId}` },
            summary: `Listen for ${eventName}`,
            description: `Subscribe to ${eventName} events from clients`
          };
        });
      }

      // Обрабатываем исходящие события (emits)
      if (socketEvents.emit) {
        Object.entries(socketEvents.emit).forEach(([emitName, emit]) => {
          const eventName = emit.event;
          const channelName = eventName.replace(/:/g, '/');
          
          // Создаем канал для исходящего события
          if (!channels[channelName]) {
            channels[channelName] = {
              address: channelName,
              messages: {}
            };
          }

          // Анализируем тип ответа
          const responseType = this.extractResponseType(emit.callback);
          const messageId = `${eventName.replace(/:/g, '_')}_response`;
          
          const message: AsyncAPIMessage = {
            contentType: 'application/json',
            payload: responseType,
            summary: `${eventName} response`,
            description: `Outgoing message for ${eventName} event`,
            examples: [this.generateResponseExample(eventName)]
          };

          messages[messageId] = message;
          channels[channelName].publish = {
            message: { $ref: `#/components/messages/${messageId}` },
            summary: `Send ${eventName}`,
            description: `Publish ${eventName} events to clients`
          };
        });
      }
    });
  }

  /**
   * Извлекает параметры из callback функции
   */
  private extractParametersFromCallback(callback: Function): Array<{name: string, type: string}> {
    const funcStr = callback.toString();
    const paramMatch = funcStr.match(/\(([^)]*)\)/);
    
    if (!paramMatch) return [];

    const params = paramMatch[1].split(',').map(p => p.trim());
    return params
      .filter(param => param && !param.startsWith('socket') && !param.endsWith('Service'))
      .map(param => ({
        name: param,
        type: this.inferTypeFromName(param)
      }));
  }

  /**
   * Определяет тип параметра по имени
   */
  private inferTypeFromName(paramName: string): string {
    if (paramName.includes('Id')) return 'string';
    if (paramName.includes('name') || paramName.includes('word')) return 'string';
    if (paramName.includes('game')) return 'Game';
    if (paramName.includes('user')) return 'User';
    if (paramName.includes('error')) return 'Error';
    return 'string';
  }

  /**
   * Генерирует свойства из параметров
   */
  private generatePropertiesFromParameters(parameters: Array<{name: string, type: string}>): any {
    const properties: any = {};
    
    parameters.forEach(param => {
      if (param.type === 'Game' || param.type === 'User') {
        properties[param.name] = { $ref: `#/components/schemas/${param.type}` };
      } else {
        properties[param.name] = {
          type: param.type,
          description: this.generateDescription(param.name),
          example: this.generateExample(param.name)
        };
      }
    });
    
    return properties;
  }

  /**
   * Генерирует пример из параметров
   */
  private generateExampleFromParameters(parameters: Array<{name: string, type: string}>): any {
    const example: any = {};
    
    parameters.forEach(param => {
      example[param.name] = this.generateExample(param.name);
    });
    
    return example;
  }

  /**
   * Извлекает тип ответа из emit callback
   */
  private extractResponseType(callback: Function): any {
    // Упрощенная логика - в реальности можно анализировать более детально
    return {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object', description: 'Response data' },
        timestamp: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
      }
    };
  }

  /**
   * Генерирует пример ответа
   */
  private generateResponseExample(eventName: string): any {
    const baseExample = {
      success: true,
      timestamp: new Date().toISOString()
    };

    if (eventName.includes('game:created')) {
      return { ...baseExample, data: { id: 'game-123', isStarted: false } };
    }
    if (eventName.includes('game:started')) {
      return { ...baseExample, data: { id: 'game-123', isStarted: true, startWord: 'hello' } };
    }
    if (eventName.includes('user:connected')) {
      return { ...baseExample, data: { id: 'user-123', name: 'John Doe' } };
    }
    if (eventName.includes('error')) {
      return { success: false, error: 'Error message', timestamp: new Date().toISOString() };
    }

    return baseExample;
  }

  /**
   * Генерирует описание
   */
  private generateDescription(paramName: string): string {
    if (paramName.includes('Id')) return 'Unique identifier';
    if (paramName.includes('name')) return 'Name';
    if (paramName.includes('word')) return 'Word for the game';
    if (paramName.includes('game')) return 'Game object';
    if (paramName.includes('user')) return 'User object';
    return 'Parameter';
  }

  /**
   * Генерирует пример значения
   */
  private generateExample(paramName: string): any {
    if (paramName.includes('Id')) return paramName.includes('game') ? 'game-123' : 'user-123';
    if (paramName.includes('name')) return 'John Doe';
    if (paramName.includes('word')) return 'hello';
    return 'example-value';
  }

  /**
   * Возвращает общие схемы
   */
  private getCommonSchemas(): Record<string, any> {
    return {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user-123' },
          name: { type: 'string', example: 'John Doe' }
        },
        required: ['id', 'name']
      },
      Game: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'game-123' },
          rounds: { type: 'array', items: { $ref: '#/components/schemas/Round' } },
          players: { type: 'array', items: { $ref: '#/components/schemas/User' } },
          isStarted: { type: 'boolean', example: false },
          isFinished: { type: 'boolean', example: false },
          startWord: { type: 'string', example: 'hello' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
        },
        required: ['id', 'isStarted', 'isFinished']
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
        required: ['id', 'word', 'playerId', 'playerName']
      },
      Round: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'round-123' },
          words: { type: 'array', items: { $ref: '#/components/schemas/Word' } },
          createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
        },
        required: ['id', 'words', 'createdAt', 'updatedAt']
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message' },
          timestamp: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
        },
        required: ['success', 'error']
      }
    };
  }

  /**
   * Сохраняет AsyncAPI спецификацию в файл
   */
  public async generateAndSave(): Promise<void> {
    try {
      const spec = this.generateAsyncAPISpec();
      const outputPath = path.join(process.cwd(), 'public', 'asyncapi.json');
      
      // Убеждаемся что директория существует
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
      console.log('✅ AsyncAPI specification generated successfully at:', outputPath);
    } catch (error) {
      console.error('❌ Failed to generate AsyncAPI specification:', error);
      throw error;
    }
  }

  /**
   * Генерирует HTML страницу с AsyncAPI документацией
   */
  public generateAsyncAPIStudio(): void {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket API Documentation - Word Association Game</title>
    <style>
        body { 
            margin: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f8f9fa;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 1rem 2rem; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header h1 { margin: 0; font-size: 1.8rem; }
        .header p { margin: 0.5rem 0 0 0; opacity: 0.9; }
        .nav { 
            background: white; 
            padding: 1rem 2rem; 
            border-bottom: 1px solid #dee2e6;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .nav a { 
            margin-right: 2rem; 
            text-decoration: none; 
            color: #495057; 
            font-weight: 500;
            transition: color 0.3s;
            padding: 0.5rem 0;
        }
        .nav a:hover { color: #007bff; }
        .nav a.active { 
            color: #007bff; 
            border-bottom: 2px solid #007bff; 
            padding-bottom: 0.3rem;
        }
        .container { 
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .loading { 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            height: 400px; 
            font-size: 1.2rem; 
            color: #6c757d;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .loading .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            margin: 1rem 0;
        }
        .error h3 { margin-top: 0; }
        .asyncapi-wrapper {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        #asyncapi-container { 
            width: 100%; 
            min-height: 600px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔌 WebSocket API Documentation</h1>
        <p>Real-time communication for Word Association Game</p>
    </div>
    
    <div class="nav">
        <a href="/docs" class="active">WebSocket Events</a>
        <a href="http://localhost:3001/docs">HTTP API</a>
        <a href="http://localhost:3001/">Back to Home</a>
    </div>

    <div class="container">
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <div>Loading AsyncAPI documentation...</div>
        </div>
        
        <div class="error" id="error" style="display: none;">
            <h3>❌ Failed to load documentation</h3>
            <p id="error-message"></p>
            <p>Possible solutions:</p>
            <ul>
                <li>Make sure the server is running on port 3000</li>
                <li>Check that asyncapi.json exists and is valid</li>
                <li>Try refreshing the page</li>
                <li>Check browser console for errors</li>
            </ul>
        </div>
        
        <div class="asyncapi-wrapper" style="display: none;" id="asyncapi-wrapper">
            <div id="asyncapi-container"></div>
        </div>
    </div>

    <script>
        let asyncApiSpec = null;
        
        async function loadAsyncAPI() {
            try {
                console.log('🔄 Loading AsyncAPI specification...');
                
                // Загружаем спецификацию
                const response = await fetch('/asyncapi.json');
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                asyncApiSpec = await response.json();
                console.log('✅ AsyncAPI spec loaded:', asyncApiSpec);
                
                // Скрываем загрузку и показываем контейнер
                document.getElementById('loading').style.display = 'none';
                document.getElementById('asyncapi-wrapper').style.display = 'block';
                
                // Создаем простую HTML документацию
                renderSimpleAsyncAPI(asyncApiSpec);
                
            } catch (error) {
                console.error('❌ Failed to load AsyncAPI spec:', error);
                showError(error.message);
            }
        }
        
        function showError(message) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            document.getElementById('error-message').textContent = message;
        }
        
        function renderSimpleAsyncAPI(spec) {
            const container = document.getElementById('asyncapi-container');
            
            let html = \`
                <div style="padding: 2rem;">
                    <div style="border-bottom: 2px solid #667eea; padding-bottom: 1rem; margin-bottom: 2rem;">
                        <h1 style="color: #333; margin: 0;">\${spec.info.title}</h1>
                        <p style="color: #666; margin: 0.5rem 0; font-size: 1.1rem;">\${spec.info.description}</p>
                        <div style="background: #e9ecef; padding: 0.5rem 1rem; border-radius: 4px; margin-top: 1rem;">
                            <strong>Version:</strong> \${spec.info.version} | 
                            <strong>AsyncAPI:</strong> \${spec.asyncapi}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h2 style="color: #333;">🌐 Servers</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
            \`;
            
            // Серверы
            for (const [serverName, server] of Object.entries(spec.servers)) {
                html += \`
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #333;">\${serverName}</h4>
                        <p style="margin: 0; color: #666;"><strong>URL:</strong> \${server.protocol}://\${server.host}</p>
                        <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.9rem;">\${server.description}</p>
                    </div>
                \`;
            }
            
            html += \`
                        </div>
                    </div>
                    
                    <div>
                        <h2 style="color: #333;">🔌 WebSocket Events</h2>
                        <div style="display: grid; gap: 1.5rem;">
            \`;
            
            // События
            for (const [channelName, channel] of Object.entries(spec.channels)) {
                html += \`
                    <div style="background: white; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden;">
                        <div style="background: #667eea; color: white; padding: 1rem;">
                            <h3 style="margin: 0; font-size: 1.2rem;">📡 \${channelName}</h3>
                        </div>
                        <div style="padding: 1.5rem;">
                \`;
                
                if (channel.subscribe) {
                    html += \`
                        <div style="margin-bottom: 1rem;">
                            <h4 style="color: #28a745; margin: 0 0 0.5rem 0;">📥 Subscribe (Client → Server)</h4>
                            <p style="margin: 0; color: #666;">\${channel.subscribe.summary || 'Listen for incoming messages'}</p>
                        </div>
                    \`;
                }
                
                if (channel.publish) {
                    html += \`
                        <div style="margin-bottom: 1rem;">
                            <h4 style="color: #dc3545; margin: 0 0 0.5rem 0;">📤 Publish (Server → Client)</h4>
                            <p style="margin: 0; color: #666;">\${channel.publish.summary || 'Send outgoing messages'}</p>
                        </div>
                    \`;
                }
                
                html += \`
                        </div>
                    </div>
                \`;
            }
            
            html += \`
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <h3 style="color: #333; margin: 0 0 0.5rem 0;">📋 Available Schemas</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            \`;
            
            // Схемы
            for (const schemaName of Object.keys(spec.components.schemas)) {
                html += \`<span style="background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.9rem;">\${schemaName}</span>\`;
            }
            
            html += \`
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; text-align: center; color: #666; border-top: 1px solid #dee2e6; padding-top: 1rem;">
                        <p>📄 <a href="/asyncapi.json" target="_blank" style="color: #667eea;">View Raw AsyncAPI Specification</a></p>
                        <p style="font-size: 0.9rem;">Generated automatically from WebSocket events • Updated: \${new Date().toLocaleString()}</p>
                    </div>
                </div>
            \`;
            
            container.innerHTML = html;
        }

        // Запускаем загрузку
        loadAsyncAPI();
    </script>
</body>
</html>`;

    const outputPath = path.join(process.cwd(), 'public', 'asyncapi.html');
    fs.writeFileSync(outputPath, htmlContent);
    console.log('✅ AsyncAPI Studio HTML generated at:', outputPath);
  }
}