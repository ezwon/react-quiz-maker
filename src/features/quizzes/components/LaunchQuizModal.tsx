import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Button, Form, Modal, Steps, Typography } from 'antd';

import { useGetQuizItem } from 'features/quizzes/hooks';
import {
  useAttemptAnswerQuestion,
  useAttemptStart,
  useAttemptSubmit,
  useAttemptRecordEvent,
} from 'features/attempts/hooks';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { handleApiMutationError, secondsToHoursAndMinutes } from 'utils/helper';
import { useUpdateEffect } from 'react-use';

import KeyLogger from 'features/attempts/components/KeyLogger';
import Countdown from 'features/quizzes/components/Countdown';
import AnswerQuestions from 'features/quizzes/components/AnswerQuestions';
import AttemptResultSummary from './AttemptResultSummary';

type Props = {
  onClose: () => void;
  quizId: number;
};

const LaunchQuizModal: React.FC<Props> = ({ quizId, onClose }) => {
  const [form] = Form.useForm();
  const handle = useFullScreenHandle();

  const [current, setCurrent] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [attemptResultDetails, setAttemptResultDetails] = useState<{
    score: number;
    details: any;
  }>(null);

  const recordEvent = useAttemptRecordEvent({
    onError: (error) => {
      handleApiMutationError('Record Event', error);
    },
  });
  const startAttempt = useAttemptStart({
    onSuccess: (data) => {
      setAttemptId(data.id);
      recordEvent.mutate({
        attemptId: data.id,
        event: `Started attempt id: ${data.id} at ${data.startedAt}`,
      });
      handle.enter();
    },
    onError: (error) => {
      handleApiMutationError('Start Attempt', error);
    },
  });
  const submitAttempt = useAttemptSubmit({
    onSuccess: (data) => {
      setAttemptResultDetails(data);
      setIsFinished(true);
    },
    onError: (error) => {
      setIsFinished(true);
      handleApiMutationError('Submit Attempt', error);
    },
  });
  const answerQuestion = useAttemptAnswerQuestion({
    onSuccess: (data) => {
      console.log('answerQuestion: ', data);
    },
    onError: (error) => {
      handleApiMutationError('Submit Question Answer', error);
    },
  });

  const { data: quizDetails, isLoading: pendingGetQuizData } =
    useGetQuizItem(quizId);

  const handleCloseModal = () => {
    onClose?.();
    setAttemptId(null);
    setAttemptResultDetails(null);
    setCurrent(0);
  };

  const handleStartAttempt = () => {
    startAttempt.mutate(quizId);
  };

  const handleSubmitAttempt = (answerValues: any) => {
    submitAttempt.mutate(attemptId);
    console.log('answerValues: ', answerValues);

    // go to summary step
    setCurrent(2);

    handle.exit();
    recordEvent.mutate({
      attemptId,
      event: `Attempt id: ${attemptId} submitted at ${dayjs().format(
        'YYYY-MM-DD HH:mm:ss',
      )}`,
    });
  };

  const handleSubmitAnswer = (questionId, value) => {
    answerQuestion.mutate({
      attemptId,
      questionId,
      value,
    });
  };

  const steps = [
    {
      title: 'Quiz Information',
      content: (
        <div className="flex min-h-[400px] flex-col justify-start gap-y-2 bg-gray-200 pt-[20px] ">
          <Typography.Title level={4}>{quizDetails?.title}</Typography.Title>
          <Typography.Text>
            Time Limit:{' '}
            {secondsToHoursAndMinutes(quizDetails?.timeLimitSeconds)}
          </Typography.Text>
          <Typography.Text>
            Question Items: {quizDetails?.questions.length} question
            {quizDetails?.questions.length > 1 ? 's' : ''}
          </Typography.Text>
          <Typography.Text>{quizDetails?.description}</Typography.Text>
        </div>
      ),
    },
    {
      title: 'Answer Question',
      content: (
        <FullScreen onChange={setIsFullScreen} handle={handle}>
          <div
            className={`relative flex w-full flex-col justify-start bg-gray-200 ${
              isFullScreen ? 'h-full' : 'h-[400px]'
            }`}
          >
            {attemptId && !isFinished && isFullScreen && (
              <Typography.Text className="absolute left-0 w-full pt-[10px] text-[90px] ">
                <Countdown seconds={quizDetails?.timeLimitSeconds} />
              </Typography.Text>
            )}

            <div
              className={`mx-auto flex min-h-[200px] w-full flex-col justify-start gap-y-2 pt-[20px] ${
                !isFullScreen ? '' : 'invisible hidden'
              }`}
            >
              <Typography.Title level={4}>Enter Full Screen</Typography.Title>
              <Typography.Text>
                Click on <strong>Start Quiz</strong> to proceed on answering the
                questionnaires
              </Typography.Text>
              <Typography.Text>
                You will enter full-screen mode when you start the quiz
              </Typography.Text>

              {attemptId && !isFinished && (
                <React.Fragment>
                  <Typography.Text className="w-full pt-[10px] text-[20px]">
                    Time Left
                  </Typography.Text>
                  <Typography.Text className="w-full text-[30px]">
                    <Countdown seconds={quizDetails?.timeLimitSeconds} />
                  </Typography.Text>
                </React.Fragment>
              )}
            </div>

            <div
              className={`mx-auto h-auto w-full ${
                isFullScreen ? '' : 'invisible'
              }`}
            >
              <AnswerQuestions
                questions={quizDetails?.questions ?? []}
                submitAttempt={handleSubmitAttempt}
                submitAnswer={handleSubmitAnswer}
              />
            </div>

            <KeyLogger
              recordEvent={(keyEvent) =>
                recordEvent.mutate({
                  attemptId,
                  event: keyEvent,
                })
              }
            />
          </div>
        </FullScreen>
      ),
    },
    {
      title: 'Summary',
      content: (
        <div className="flex min-h-[400px] flex-col justify-start gap-y-2 bg-gray-200 pt-[20px] ">
          <Typography.Title level={4}>Answer Result Summary</Typography.Title>
          {attemptResultDetails && (
            <AttemptResultSummary
              summaryDetails={attemptResultDetails}
              questions={quizDetails?.questions}
            />
          )}
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  useUpdateEffect(() => {
    // record full-screen mode when there is an active attempt
    if (!isFullScreen && attemptId) {
      recordEvent.mutate({
        attemptId,
        event: `Exit full-screen mode at ${dayjs().format(
          'YYYY-MM-DD HH:mm:ss',
        )}`,
      });
    }
  }, [isFullScreen]);

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    backgroundColor: '#fafafa',
    borderRadius: '10px',
    border: `1px dashed #fafafa`,
    marginTop: 16,
  };

  return (
    <Modal
      title={null}
      closeIcon={null}
      width={900}
      styles={{
        body: {
          padding: 0,
        },
      }}
      open={!!quizId}
      loading={pendingGetQuizData}
      footer={null}
    >
      <Steps type="default" current={current} items={items} />
      <Form form={form} layout="vertical">
        <div style={contentStyle}>{steps[current].content}</div>
      </Form>
      <div className="mt-3 flex w-full items-center justify-between align-middle">
        <div className="flex justify-between gap-x-2">
          {current > 0 && current !== 2 && (
            <Button onClick={() => setCurrent(current - 1)}>Back</Button>
          )}
          {current === 0 && (
            <Button type="primary" onClick={() => setCurrent(current + 1)}>
              Next
            </Button>
          )}

          {current === 1 && (
            <Button
              type="primary"
              loading={startAttempt.isPending}
              onClick={handleStartAttempt}
            >
              {attemptId ? 'Resume ' : 'Start '}Quiz
            </Button>
          )}
        </div>
        <div className="flex items-center justify-end gap-x-2 align-middle ">
          <Button onClick={handleCloseModal}>Close Quiz</Button>
        </div>
      </div>
    </Modal>
  );
};

export default LaunchQuizModal;
