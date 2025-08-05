import { Controller, Get, Route, Tags, Example } from 'tsoa';
import { HealthResponse } from '../models/common.model';

@Route('api/health')
@Tags('Health')
export class HealthController extends Controller {
  /**
   * Проверка состояния API сервера
   * @summary Health check
   */
  @Get()
  @Example<HealthResponse>({
    status: 'OK',
    timestamp: '2023-01-01T00:00:00Z'
  })
  public async getHealth(): Promise<HealthResponse> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    };
  }
}