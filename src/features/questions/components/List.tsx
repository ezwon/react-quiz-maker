import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';

import {
  TableColumnsType,
  Empty,
  Table,
  Button,
  Typography,
  Input,
  notification,
} from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useDeleteQuizQuestion } from 'features/questions/hooks';
import { handleApiMutationError } from 'utils/helper';

import CreateQuestionDrawer from 'features/questions/components/CreateDrawer';
import UpdateQuestionDrawer from 'features/questions/components/DetailsDrawer';
import { useGetQuizItem } from '../../quizzes/hooks';

type Props = {
  quiz: any;
};

const QuestionList: React.FC<Props> = ({ quiz }) => {
  const [searchText, setSearchText] = useState('');
  const [activeRecord, setActiveRecord] = useState<any | null>(null);

  const { refetch: getQuizItem } = useGetQuizItem(quiz?.id);

  const deleteQuestion = useDeleteQuizQuestion({
    onSuccess: () => {
      getQuizItem();
      notification.success({
        message: 'Questions',
        description: 'The question has been deleted successfully.',
        placement: 'bottomLeft',
      });
    },
    onError: (error) => {
      handleApiMutationError('Questions', error);
    },
  });

  const columns: TableColumnsType<any> = [
    {
      title: '',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
      width: 40,
    },
    {
      title: 'Question',
      dataIndex: 'prompt',
      key: 'prompt',
      align: 'left',
      render: (prompt) => {
        return (
          <Typography.Text ellipsis className="max-w-[300px]">
            <Highlighter
              searchWords={[searchText]}
              autoEscape
              textToHighlight={prompt}
            />
          </Typography.Text>
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-x-2 align-middle">
            <Button
              onClick={() => setActiveRecord(record)}
              variant="text"
              shape="circle"
              icon={<EditOutlined />}
            />
            <Button
              danger
              variant="text"
              shape="circle"
              onClick={() => deleteQuestion.mutate(record.id)}
              icon={<DeleteOutlined />}
            />
          </div>
        );
      },
    },
  ];

  const filteredData = quiz?.questions.filter((item) =>
    item.prompt.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col gap-y-[20px]">
      <Typography.Title
        level={4}
        className="flex items-center justify-between align-middle"
      >
        Questions
        <CreateQuestionDrawer quizId={quiz.id} onSuccess={getQuizItem} />
      </Typography.Title>
      <div className="flex h-[30px] items-center justify-start">
        <Input
          style={{ width: '100%' }}
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table<any>
        size="small"
        bordered
        loading={deleteQuestion.isPending}
        showSorterTooltip={false}
        dataSource={filteredData}
        columns={columns}
        locale={{
          emptyText: <Empty description="No data" />,
        }}
        pagination={false}
        rowKey="id"
      />
      <UpdateQuestionDrawer
        record={activeRecord}
        onClose={() => setActiveRecord(null)}
        onRecordUpdated={getQuizItem}
      />
    </div>
  );
};

export default QuestionList;
