import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from 'api/config';
import apiClient from 'api/client';

export const useAttemptStart = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (quizId: number): Promise<any> => {
      const response = await apiClient.post(
        API_CONFIG.endpoints.attempts.start,
        { quizId },
      );

      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useAttemptAnswer = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (payload: {
      attemptId: number;
      questionId: number;
      value: number;
    }): Promise<any> => {
      const { attemptId, ...rest } = payload;
      const response = await apiClient.post(
        API_CONFIG.endpoints.attempts.answer(attemptId),
        rest,
      );

      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useAttemptSubmit = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (attemptId: number): Promise<any> => {
      const response = await apiClient.post(
        API_CONFIG.endpoints.attempts.submit(attemptId),
      );

      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useAttemptRecordEvent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (payload: {
      attemptId: number;
      event: string;
    }): Promise<any> => {
      const { attemptId, event } = payload;
      const response = await apiClient.post(
        API_CONFIG.endpoints.attempts.recordEvent(attemptId),
        {
          event,
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
