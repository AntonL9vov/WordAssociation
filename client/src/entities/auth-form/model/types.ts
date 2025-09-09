export interface AuthFormData {
  playerName: string;
}

export interface AuthFormErrors {
  playerName?: string;
}

export interface AuthFormState {
  data: AuthFormData;
  errors: AuthFormErrors;
  isLoading: boolean;
}

