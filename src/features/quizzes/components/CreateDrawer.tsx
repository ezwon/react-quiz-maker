import React, { useState } from 'react';
import {
  Button,
  Typography,
  Form,
  Drawer,
  Input,
  InputNumber,
  Switch,
  notification,
} from 'antd';
import { CloseOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

import { useCreateQuiz } from 'features/quizzes/hooks';
import { handleApiMutationError, secondsToHoursAndMinutes } from 'utils/helper';

type Props = {
  onRecordCreated?: () => void;
};

const CreateDrawer: React.FC<Props> = ({ onRecordCreated }) => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const createQuiz = useCreateQuiz({
    onSuccess: (data) => {
      form.resetFields();
      setIsDrawerVisible(false);
      notification.success({
        message: 'Quiz',
        description: 'The quiz has been created successfully.',
        placement: 'bottomLeft',
      });

      onRecordCreated?.();
      // eslint-disable-next-line no-console
      console.log('Quiz created', data);
    },
    onError: (error) => {
      handleApiMutationError('Quiz', error);
    },
  });

  const handleCreate = () => {
    form
      .validateFields()
      .then(async (values) => {
        createQuiz.mutate(values);
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
        New Quiz
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
              loading={createQuiz.isPending}
              icon={<SaveOutlined />}
              onClick={handleCreate}
            >
              Create Quiz
            </Button>
          </div>
        }
      >
        <div className="flex h-[calc(100vh-50px)] flex-col p-[20px]">
          <header className="flex justify-between">
            <Typography.Title level={4}>Create New Quiz</Typography.Title>
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
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default CreateDrawer;
