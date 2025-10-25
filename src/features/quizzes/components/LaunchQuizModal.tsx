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
import { handleApiMutationError } from 'utils/helper';
import { useUpdateEffect } from 'react-use';

import KeyLogger from 'features/attempts/components/KeyLogger';
import Countdown from 'features/quizzes/components/Countdown';
import AnswerQuestions from 'features/quizzes/components/AnswerQuestions';

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
      console.log('submitAttempt: ', data);
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
  };

  const handleStartAttempt = () => {
    startAttempt.mutate(quizId);
  };

  const handleSubmitAttempt = () => {
    submitAttempt.mutate(attemptId);
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
      content: <div>Quiz Information Contents</div>,
    },
    {
      title: 'Progress',
      content: (
        <FullScreen onChange={setIsFullScreen} handle={handle}>
          <div
            className={`relative flex w-full flex-col justify-start bg-gray-200 ${
              isFullScreen ? 'h-full' : 'h-[400px]'
            }`}
          >
            {attemptId && !isFinished && (
              <Typography.Text className="absolute left-0 w-full pt-[10px] text-[90px] ">
                <Countdown seconds={quizDetails?.timeLimitSeconds} />
              </Typography.Text>
            )}

            <div
              className={`mx-auto w-full ${isFullScreen ? '' : 'invisible'}`}
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
      content: <div>Summary Contents</div>,
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
          {current > 0 && (
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
