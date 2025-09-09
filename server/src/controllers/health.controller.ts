import { Controller, Get, Route, Tags } from "tsoa";
import { HealthResponse } from "../models/common.model";

@Route("health")
@Tags("Health")
export class HealthController extends Controller {
  @Get()
  public async getHealth(): Promise<HealthResponse> {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }
}