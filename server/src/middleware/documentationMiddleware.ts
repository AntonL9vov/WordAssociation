import { Request, Response, NextFunction } from "express";
import { DocumentationService } from "../services/documentationService";

export class DocumentationMiddleware {
  private docService: DocumentationService;

  constructor() {
    this.docService = DocumentationService.getInstance();
  }

  /**
   * Middleware для добавления документации в Express
   */
  setupRoutes(app: any): void {
    // JSON endpoint для получения документации
    app.get("/api/docs", (req: Request, res: Response) => {
      res.json(this.docService.getDocumentation());
    });

    // OpenAPI endpoint
    app.get("/api/docs/openapi", (req: Request, res: Response) => {
      res.json(this.docService.getOpenAPISpec());
    });

    // HTML страница с кастомным интерфейсом для WebSocket
    app.get("/docs", (req: Request, res: Response) => {
      res.send(this.generateWebSocketHTML());
    });

    // Swagger UI страница
    app.get("/docs/swagger", (req: Request, res: Response) => {
      res.send(this.generateSwaggerHTML());
    });
  }

  /**
   * Генерирует HTML страницу с кастомным интерфейсом для WebSocket документации
   */
  private generateWebSocketHTML(): string {
    const doc = this.docService.getDocumentation();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 0;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 10px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .category {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .category:hover {
            transform: translateY(-2px);
        }
        
        .category h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .event {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #667eea;
        }
        
        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .event-name {
            font-weight: bold;
            color: #333;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
        }
        
        .event-direction {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .incoming {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .outgoing {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .event-description {
            color: #666;
            margin-bottom: 10px;
        }
        
        .event-parameters {
            margin-top: 10px;
        }
        
        .parameter {
            background: white;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 5px;
            border: 1px solid #e0e0e0;
        }
        
        .parameter-name {
            font-weight: bold;
            color: #333;
            font-family: 'Courier New', monospace;
        }
        
        .parameter-type {
            color: #666;
            font-size: 0.9rem;
        }
        
        .parameter-description {
            color: #888;
            font-size: 0.9rem;
            margin-top: 2px;
        }
        
        .example {
            background: #f5f5f5;
            border-radius: 4px;
            padding: 8px;
            margin-top: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #333;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        
        .swagger-link {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
            transition: background 0.2s;
        }
        
        .swagger-link:hover {
            background: #5a6fd8;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .categories {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${doc.title}</h1>
            <p>${doc.description}</p>
            <p>Version: ${doc.version}</p>
            <a href="/docs/swagger" class="swagger-link">View in Swagger UI</a>
        </div>
        
        <div class="categories">
            ${this.generateCategoriesHTML(doc)}
        </div>
        
        <div class="footer">
            <p>Documentation automatically generated from WebSocket events</p>
            <p>JSON API: <a href="/api/docs">/api/docs</a> | OpenAPI: <a href="/api/docs/openapi">/api/docs/openapi</a></p>
        </div>
    </div>
    
    <script>
        // Добавляем интерактивность
        document.addEventListener('DOMContentLoaded', function() {
            // Анимация появления категорий
            const categories = document.querySelectorAll('.category');
            categories.forEach((category, index) => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    category.style.transition = 'all 0.5s ease';
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            // Подсветка событий при наведении
            const events = document.querySelectorAll('.event');
            events.forEach(event => {
                event.addEventListener('mouseenter', function() {
                    this.style.borderLeftColor = '#4caf50';
                });
                
                event.addEventListener('mouseleave', function() {
                    this.style.borderLeftColor = '#667eea';
                });
            });
        });
    </script>
</body>
</html>`;
  }

  /**
   * Генерирует HTML для категорий событий
   */
  private generateCategoriesHTML(doc: any): string {
    const eventsByCategory = doc.events.reduce((acc: any, event: any) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    }, {});

    return Object.entries(eventsByCategory).map(([category, events]: [string, any]) => `
        <div class="category">
            <h2>${category}</h2>
            ${events.map((event: any) => `
                <div class="event">
                    <div class="event-header">
                        <span class="event-name">${event.event}</span>
                        <span class="event-direction ${event.direction}">${event.direction}</span>
                    </div>
                    <div class="event-description">${event.description || 'No description available'}</div>
                    ${event.parameters && event.parameters.length > 0 ? `
                        <div class="event-parameters">
                            <strong>Parameters:</strong>
                            ${event.parameters.map((param: any) => `
                                <div class="parameter">
                                    <div class="parameter-name">${param.name}</div>
                                    <div class="parameter-type">Type: ${param.type}</div>
                                    ${param.description ? `<div class="parameter-description">${param.description}</div>` : ''}
                                    ${param.example ? `<div class="example">Example: ${JSON.stringify(param.example)}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    ${event.response ? `
                        <div class="event-parameters">
                            <strong>Response:</strong>
                            <div class="parameter">
                                <div class="parameter-type">Type: ${event.response.type}</div>
                                ${event.response.description ? `<div class="parameter-description">${event.response.description}</div>` : ''}
                                ${event.response.example ? `<div class="example">Example: ${JSON.stringify(event.response.example)}</div>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `).join('');
  }

  /**
   * Генерирует HTML страницу с Swagger UI
   */
  private generateSwaggerHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket API Documentation - Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #667eea; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api/docs/openapi',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`;
  }
}
