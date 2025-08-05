/**
 * @example {
 *   "error": "User not found",
 *   "message": "User with ID user-123 not found"
 * }
 */
export interface ErrorResponse {
  /** @example "User not found" */
  error: string;
  /** @example "User with ID user-123 not found" */
  message: string;
}

/**
 * @example {
 *   "status": "OK",
 *   "timestamp": "2023-01-01T00:00:00Z"
 * }
 */
export interface HealthResponse {
  /** @example "OK" */
  status: string;
  /** @example "2023-01-01T00:00:00Z" */
  timestamp: string;
}