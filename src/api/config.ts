export const API_CONFIG = {
  endpoints: {
    quizzes: {
      list: '/quizzes',
      create: '/quizzes',
      get: (quizId: number) => `/quizzes/${quizId}`,
      patch: (quizId: number) => `/quizzes/${quizId}`,
      createQuestion: (quizId: number) => `/quizzes/${quizId}/questions`,
    },
    questions: {
      patch: (questionId: number) => `/questions/${questionId}`,
      delete: (questionId: number) => `/questions/${questionId}`,
    },
    attempts: {
      start: '/attempts',
      answer: (attemptId: number) => `/attempts/${attemptId}/answer`,
      submit: (attemptId: number) => `/attempts/${attemptId}/submit`,
      recordEvent: (attemptId: number) => `/attempts/${attemptId}/events`,
    },
  },
};
