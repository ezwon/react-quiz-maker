import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuizPage from './pages/quiz';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}

export default Router;
