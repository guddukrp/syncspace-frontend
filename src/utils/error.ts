import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Network error';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error occurred';
};