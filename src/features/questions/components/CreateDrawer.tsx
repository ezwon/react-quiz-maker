import React, { useState } from 'react';
import {
  Button,
  Typography,
  Form,
  Drawer,
  Input,
  notification,
  Select,
  Radio,
} from 'antd';
import { CloseOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

import { useCreateQuizQuestion } from 'features/questions/hooks';
import { handleApiMutationError } from 'utils/helper';

type Props = {
  quizId: number;
  onSuccess?: () => void;
};

const CreateDrawer: React.FC<Props> = ({ onSuccess, quizId }) => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const createQuestion = useCreateQuizQuestion({
    onSuccess: (data) => {
      form.resetFields();
      setIsDrawerVisible(false);
      notification.success({
        message: 'Questions',
        description: 'Question has been added successfully.',
        placement: 'bottomLeft',
      });

      onSuccess?.();
      // eslint-disable-next-line no-console
      console.log('Question created', data);
    },
    onError: (error) => {
      handleApiMutationError('Question', error);
    },
  });

  const handleCreate = () => {
    form
      .validateFields()
      .then(async (values) => {
        let correctAnswer;

        switch (values.type) {
          // implement multiple selected correctAnswer for mcq
          case 'mcq':
          case 'code':
          case 'short':
            correctAnswer = values.correctAnswer;
            break;
          default:
            correctAnswer = null;
        }

        const payload = {
          ...values,
          correctAnswer,
        };

        createQuestion.mutate(payload);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsDrawerVisible(true)}
      >
        Add Question
      </Button>
      <Drawer
        title={null}
        closeIcon={null}
        placement="right"
        width={600}
        onClose={() => {
          setIsDrawerVisible(false);
          form.resetFields();
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
        open={isDrawerVisible}
        footer={
          <div className="drawer-actions flex justify-end gap-x-2">
            <Button
              type="primary"
              loading={createQuestion.isPending}
              icon={<SaveOutlined />}
              onClick={handleCreate}
            >
              Create Question
            </Button>
          </div>
        }
      >
        <div className="flex h-[calc(100vh-50px)] flex-col p-[20px]">
          <header className="flex justify-between">
            <Typography.Title level={4}>New Question</Typography.Title>
            <div className="drawer-actions flex justify-end gap-x-2">
              <Button
                onClick={() => setIsDrawerVisible(false)}
                shape="circle"
                icon={<CloseOutlined />}
              />
            </div>
          </header>
          <Form form={form} layout="vertical">
            <div className="flex flex-col justify-start gap-y-2">
              <Form.Item hidden name="quizId" initialValue={quizId} />
              <Form.Item label="Type" name="type" initialValue="mcq">
                <Select
                  placeholder="Select Question Type"
                  options={[
                    { label: 'Multiple Choice', value: 'mcq' },
                    { label: 'Short Answer', value: 'short' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Question"
                name="prompt"
                rules={[{ required: true, message: 'Question is required' }]}
              >
                <Input.TextArea placeholder="Question" rows={2} />
              </Form.Item>
              <Form.Item shouldUpdate noStyle>
                {(updatedForm) => {
                  const { type } = updatedForm.getFieldsValue();

                  if (type === 'mcq') {
                    return (
                      <Form.Item
                        label={
                          <Typography.Text>
                            Options{' '}
                            <span className="text-[12px] italic text-gray-500">
                              - type and press enter to add answer option
                            </span>
                          </Typography.Text>
                        }
                        name="options"
                        rules={[
                          { required: true, message: 'Options is required' },
                        ]}
                      >
                        <Select
                          showSearch={false}
                          suffixIcon={null}
                          placeholder="Enter at least 2 options"
                          mode="tags"
                        />
                      </Form.Item>
                    );
                  }

                  return null;
                }}
              </Form.Item>
              <div className="flex w-full items-center justify-start gap-x-2 align-middle">
                <Form.Item hidden name="options" />
                <Form.Item shouldUpdate noStyle className="w-full">
                  {(updatedForm) => {
                    const { type, options } = updatedForm.getFieldsValue();

                    if (type === 'short')
                      return (
                        <Form.Item
                          label={null}
                          name="correctAnswer"
                          rules={[
                            { required: true, message: 'Answer is required' },
                          ]}
                          className="w-full"
                        >
                          <Input
                            style={{ width: '100%' }}
                            placeholder="Answer"
                          />
                        </Form.Item>
                      );

                    return (
                      <div className="flex flex-col justify-start gap-y-2">
                        <Typography.Text className="mb-[10px]">
                          Correct Answer{' '}
                          <span className="text-[12px] italic text-gray-500">
                            {options?.length > 0
                              ? '- select the correct answer'
                              : '- add answer options above to select correct answer'}
                          </span>
                        </Typography.Text>
                        <Form.Item
                          label={null}
                          name="correctAnswer"
                          className="mb-[10px]"
                        >
                          <Radio.Group
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                            }}
                            options={options?.map((option, index) => {
                              return {
                                value: index,
                                label: option,
                              };
                            })}
                          />
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

CreateDrawer.defaultProps = {
  onSuccess: undefined,
};

export default CreateDrawer;
