/**
 * @example {
 *   "id": "user-123",
 *   "name": "John Doe"
 * }
 */
export interface User {
  /** @example "user-123" */
  id: string;
  /** @example "John Doe" */
  name: string;
}

/**
 * @example {
 *   "name": "John Doe"
 * }
 */
export interface CreateUserRequest {
  /** @example "John Doe" */
  name: string;
}

/**
 * @example {
 *   "name": "John Updated"
 * }
 */
export interface UpdateUserRequest {
  /** @example "John Updated" */
  name: string;
}

/**
 * @example {
 *   "users": [
 *     {"id": "user-123", "name": "John Doe"},
 *     {"id": "user-456", "name": "Jane Smith"}
 *   ]
 * }
 */
export interface UsersResponse {
  users: User[];
}

/**
 * @example {
 *   "user": {"id": "user-123", "name": "John Doe"}
 * }
 */
export interface UserResponse {
  user: User;
}