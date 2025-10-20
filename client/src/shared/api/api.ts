// Base API service for making HTTP requests
import { API_CONFIG } from "../config/api";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ZodTypeAny } from "zod";

export class ApiService {
  private baseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    console.log(this.baseUrl, API_CONFIG);
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });
  }

  private isZodSchema(value: unknown): value is ZodTypeAny {
    return (
      typeof value === "object" &&
      value !== null &&
      // All Zod schemas expose safeParse/parse methods
      "safeParse" in (value as Record<string, unknown>) &&
      typeof (value as { safeParse?: unknown }).safeParse === "function"
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T>;
  async get<S extends ZodTypeAny>(
    endpoint: string,
    schema: S,
    config?: AxiosRequestConfig
  ): Promise<ReturnType<S["parse"]>>;
  async get(
    endpoint: string,
    schemaOrConfig?: ZodTypeAny | AxiosRequestConfig,
    maybeConfig?: AxiosRequestConfig
  ): Promise<unknown> {
    try {
      const schema = this.isZodSchema(schemaOrConfig)
        ? schemaOrConfig
        : undefined;
      const config = (
        this.isZodSchema(schemaOrConfig) ? maybeConfig : schemaOrConfig
      ) as AxiosRequestConfig | undefined;

      const response = await this.axiosInstance.get(endpoint, config);
      const data = response.data;
      return schema ? schema.parse(data) : data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as unknown;
        const serverMessage =
          (typeof data === "string" ? data : (data as { message?: string; error?: string } | undefined)?.message) ||
          (typeof data === "object" && data !== null
            ? (data as { error?: string }).error
            : undefined);
        const fallback = `API Error: ${error.response?.status || "Unknown"} - ${error.message}`;
        throw new Error(serverMessage || fallback);
      }
      throw new Error(`Error with ${endpoint} - ${error}`);
    }
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>;
  async post<S extends ZodTypeAny>(
    endpoint: string,
    data: unknown,
    schema: S,
    config?: AxiosRequestConfig
  ): Promise<ReturnType<S["parse"]>>;
  async post(
    endpoint: string,
    data: unknown,
    schemaOrConfig?: ZodTypeAny | AxiosRequestConfig,
    maybeConfig?: AxiosRequestConfig
  ): Promise<unknown> {
    try {
      const schema = this.isZodSchema(schemaOrConfig)
        ? schemaOrConfig
        : undefined;
      const config = (
        this.isZodSchema(schemaOrConfig) ? maybeConfig : schemaOrConfig
      ) as AxiosRequestConfig | undefined;

      const response = await this.axiosInstance.post(endpoint, data, config);
      const responseData = response.data;
      return schema ? schema.parse(responseData) : responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as unknown;
        const serverMessage =
          (typeof data === "string" ? data : (data as { message?: string; error?: string } | undefined)?.message) ||
          (typeof data === "object" && data !== null
            ? (data as { error?: string }).error
            : undefined);
        const fallback = `API Error: ${error.response?.status || "Unknown"} - ${error.message}`;
        throw new Error(serverMessage || fallback);
      }
      throw new Error(`Error with ${endpoint} - ${error}`);
    }
  }

  async delete(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const response = await this.axiosInstance.delete(endpoint, config);
    return response;
  }
}

export const api = new ApiService();
