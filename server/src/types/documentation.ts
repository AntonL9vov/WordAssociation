export interface SocketEventMetadata {
  event: string;
  description?: string;
  parameters?: EventParameter[];
  response?: EventResponse;
  category: string;
  direction: 'incoming' | 'outgoing';
}

export interface EventParameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  example?: any;
}

export interface EventResponse {
  type: string;
  description?: string;
  example?: any;
}

export interface SocketDocumentation {
  version: string;
  title: string;
  description: string;
  events: SocketEventMetadata[];
  categories: string[];
} 