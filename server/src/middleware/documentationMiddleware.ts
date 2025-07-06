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

    // HTML страница с Swagger UI
    app.get("/docs", (req: Request, res: Response) => {
      res.send(this.generateHTML());
    });
  }

  /**
   * Генерирует HTML страницу с Swagger UI
   */
  private generateHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
        .swagger-ui .topbar { display: none; }
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
