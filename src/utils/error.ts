type ErrorResponse = {
  data?: {
    message?: string;
  };
  error?: string;
  message?: string;
  status?: number | string;
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const response = error as ErrorResponse;
    return response.data?.message || response.message || response.error || 'Network error';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error occurred';
};
