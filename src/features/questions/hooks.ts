import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from 'api/config';
import apiClient from 'api/client';

export const useCreateQuizQuestion = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (payload: {
      quizId: number;
      type: 'mcq' | 'short' | 'code';
      prompt: string;
      options: string[];
      correctAnswer: string | string[];
    }): Promise<any> => {
      const { quizId, ...rest } = payload;
      const response = await apiClient.post(
        API_CONFIG.endpoints.quizzes.createQuestion(quizId),
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

export const useUpdateQuizQuestion = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (payload: {
      id: number;
      type: 'mcq' | 'short' | 'code';
      prompt: string;
      options: string[];
      correctAnswer: string | string[];
      position: 0;
    }): Promise<any> => {
      const response = await apiClient.patch(
        API_CONFIG.endpoints.questions.patch(payload.id),
        payload,
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

export const useDeleteQuizQuestion = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (questionId: number): Promise<any> => {
      const response = await apiClient.delete(
        API_CONFIG.endpoints.questions.delete(questionId),
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
