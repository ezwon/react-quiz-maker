import React from 'react';
import { Typography, Form, Radio, Button } from 'antd';

type Props = {
  questions: any[];
  submitAnswer?: (questionId: number, value: number) => void;
  submitAttempt?: (answerValues: any) => void;
};

const AnswerQuestions: React.FC<Props> = ({
  questions,
  submitAnswer,
  submitAttempt,
}) => {
  const [form] = Form.useForm();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  if (questions.length === 0) {
    return (
      <Typography.Text>There is no questions on this quiz</Typography.Text>
    );
  }

  const handleSubmitAnswer = () => {
    const values = form.getFieldsValue();
    if (values?.answer?.[currentQuestionIndex] !== undefined) {
      submitAnswer?.(
        questions[currentQuestionIndex].id,
        values.answer[currentQuestionIndex],
      );

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Submit Attempt after answering the last question
        submitAttempt?.(values);
        setCurrentQuestionIndex(0);
      }
    }
  };

  return (
    <div className="relative mx-auto my-[200px] flex h-[500px] min-w-[700px] max-w-[700px] flex-col gap-y-4 bg-gray-100 p-[20px]">
      <Typography.Text>
        <strong>
          Question {`${currentQuestionIndex + 1} of ${questions.length}`}
        </strong>
        <p>{questions[currentQuestionIndex].prompt}</p>
      </Typography.Text>
      <Form form={form} layout="vertical">
        {questions.map((question, index) => {
          return (
            <Form.Item
              hidden
              key={`question-${question.id}`}
              name={['answer', index]}
            />
          );
        })}
        <Form.Item label={null} name={['answer', currentQuestionIndex]}>
          <Radio.Group
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
            options={questions[currentQuestionIndex].options?.map(
              (option, index) => {
                return {
                  value: index,
                  label: option,
                };
              },
            )}
          />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {(updatedForm) => {
            const { answer } = updatedForm.getFieldsValue();
            return (
              <div className="absolute bottom-0 left-0 flex w-full justify-between p-3 align-middle leading-none">
                {/* <Button */}
                {/*  disabled={currentQuestionIndex === 0} */}
                {/*  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} */}
                {/* > */}
                {/*  Previous */}
                {/* </Button> */}
                {currentQuestionIndex < questions.length - 1 && (
                  <Button
                    disabled={answer?.[currentQuestionIndex] === undefined}
                    onClick={handleSubmitAnswer}
                  >
                    Submit answer and move to Next Question
                  </Button>
                )}
                {currentQuestionIndex === questions.length - 1 && (
                  <Button
                    disabled={answer?.[currentQuestionIndex] === undefined}
                    onClick={handleSubmitAnswer}
                  >
                    Submit answer and Finish the Quiz
                  </Button>
                )}

                {/* <Button */}
                {/*  disabled={currentQuestionIndex === questions.length - 1} */}
                {/*  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} */}
                {/* > */}
                {/*  Next */}
                {/* </Button> */}
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );
};

export default AnswerQuestions;
