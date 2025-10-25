import { useMutation, useQuery } from '@tanstack/react-query';
import { API_CONFIG } from 'api/config';
import apiClient from 'api/client';

export const getQuizItem = async (itemId: number): Promise<any> => {
  const response = await apiClient.get(
    API_CONFIG.endpoints.quizzes.get(itemId),
  );
  return response?.data ?? {};
};

export const useGetQuizItems = () => {
  return useQuery<any, Error>({
    queryKey: ['quiz-items'],
    queryFn: async (): Promise<any> => {
      const response = await apiClient.get(API_CONFIG.endpoints.quizzes.list);
      return response?.data ?? [];
    },
    // staleTime: 5 * 1000,
    // gcTime: 2 * 60 * 1000,
  });
};

export const useGetQuizItem = (itemId: number) => {
  return useQuery<any, Error>({
    queryKey: ['quiz-item', itemId],
    queryFn: () => getQuizItem(itemId),
    // staleTime: 30 * 1000,
    // gcTime: 2 * 60 * 1000,
    enabled: !!itemId,
  });
};

export const useCreateQuiz = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      timeLimitSeconds: number;
      isPublished: boolean;
    }): Promise<any> => {
      const response = await apiClient.post(
        API_CONFIG.endpoints.quizzes.create,
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

export const useUpdateQuiz = ({
  onSuccess,
  onError,
}: {
  onSuccess?: any;
  onError?: any;
}) => {
  return useMutation({
    mutationFn: async (payload: {
      id: number;
      title: string;
      description: string;
      timeLimitSeconds: number;
      isPublished: boolean;
    }): Promise<any> => {
      const response = await apiClient.patch(
        API_CONFIG.endpoints.quizzes.patch(payload.id),
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
