import React from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Button,
  Typography,
  Form,
  Drawer,
  Input,
  notification,
  Spin,
  InputNumber,
  Switch,
  Divider,
} from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';

import { useUpdateQuiz, useGetQuizItem } from 'features/quizzes/hooks';
import { handleApiMutationError, secondsToHoursAndMinutes } from 'utils/helper';

import QuestionList from 'features/questions/components/List';

type Props = {
  onRecordUpdated?: () => void;
  onClose: () => void;
  record: any;
};

const DetailsDrawer: React.FC<Props> = ({
  record,
  onRecordUpdated,
  onClose,
}) => {
  const [form] = Form.useForm();

  const updateQuiz = useUpdateQuiz({
    onSuccess: () => {
      notification.success({
        message: 'Quiz',
        description: 'The quiz details has been updated successfully.',
        placement: 'bottomLeft',
      });
      form.resetFields();
      onRecordUpdated?.();
      // eslint-disable-next-line no-console
      console.log('Quiz updated');
    },
    onError: (error) => {
      handleApiMutationError('Quiz', error);
    },
  });

  const { data: quizDetails, isLoading: pendingGetQuizData } = useGetQuizItem(
    record?.id,
  );

  const handleUpdate = () => {
    form
      .validateFields()
      .then(async (values) => {
        updateQuiz.mutate({
          id: quizDetails.id,
          ...values,
        });
        onRecordUpdated?.();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  const handleCloseDrawer = () => {
    form.resetFields();
    onClose?.();
  };

  useUpdateEffect(() => {
    form.setFieldsValue(quizDetails);
  }, [quizDetails]);

  return (
    <Drawer
      title={null}
      closeIcon={null}
      placement="right"
      width={600}
      onClose={handleCloseDrawer}
      styles={{
        body: {
          padding: 0,
        },
      }}
      open={!!record?.id}
      loading={pendingGetQuizData}
      footer={
        <div className="drawer-actions flex justify-end gap-x-2">
          <Button
            type="primary"
            loading={updateQuiz.isPending}
            icon={<SaveOutlined />}
            onClick={handleUpdate}
          >
            Update Quiz
          </Button>
        </div>
      }
    >
      <Spin spinning={updateQuiz.isPending || pendingGetQuizData}>
        <div className="flex h-[calc(100vh-50px)] flex-col p-[20px]">
          <header className="flex justify-between">
            <Typography.Title level={4}>Update Quiz</Typography.Title>
            <div className="drawer-actions flex justify-end gap-x-2">
              <Button
                type="primary"
                loading={updateQuiz.isPending}
                icon={<SaveOutlined />}
                onClick={handleUpdate}
              >
                Update Quiz
              </Button>
              <Button
                onClick={handleCloseDrawer}
                shape="circle"
                icon={<CloseOutlined />}
              />
            </div>
          </header>
          <Form form={form} layout="vertical">
            <div className="flex flex-col justify-start gap-y-2">
              <Form.Item hidden name="id" />
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input placeholder="Title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input.TextArea placeholder="Description" rows={3} />
              </Form.Item>
              <div className="flex items-center justify-start gap-x-2 align-middle">
                <Form.Item shouldUpdate noStyle>
                  {(updatedForm) => {
                    const { timeLimitSeconds } = updatedForm.getFieldsValue();
                    return (
                      <Form.Item
                        label="Time Limit (seconds)"
                        name="timeLimitSeconds"
                        className="mb-[10px]"
                        initialValue={30}
                        rules={[
                          { required: true, message: 'Time limit is required' },
                        ]}
                      >
                        <InputNumber
                          min={30}
                          max={60 * 60 * 60 * 2}
                          className="w-full"
                          placeholder="Time Limit"
                          addonAfter={
                            <Typography.Text>
                              {secondsToHoursAndMinutes(timeLimitSeconds)}
                            </Typography.Text>
                          }
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <div className="flex items-center justify-start gap-x-2 pt-[18px] align-middle">
                  <Button
                    onClick={() =>
                      form.setFieldValue('timeLimitSeconds', 15 * 60)
                    }
                  >
                    15mins
                  </Button>
                  <Button
                    onClick={() =>
                      form.setFieldValue('timeLimitSeconds', 45 * 60)
                    }
                  >
                    45mins
                  </Button>
                  <Button
                    onClick={() =>
                      form.setFieldValue('timeLimitSeconds', 60 * 60)
                    }
                  >
                    1hr
                  </Button>
                  <Button
                    onClick={() =>
                      form.setFieldValue('timeLimitSeconds', 60 * 60 * 2)
                    }
                  >
                    2hrs
                  </Button>
                </div>
              </div>
              <Form.Item className="!m-0" label="Published" name="isPublished">
                <Switch />
              </Form.Item>
            </div>
          </Form>
          <Divider />
          {quizDetails?.id && <QuestionList quiz={quizDetails} />}
        </div>
      </Spin>
    </Drawer>
  );
};

export default DetailsDrawer;
