import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';

import {
  TableColumnsType,
  Empty,
  Table,
  Button,
  Typography,
  Input,
  Tooltip,
} from 'antd';

import { SettingOutlined, RocketOutlined } from '@ant-design/icons';

import { useGetQuizItems } from 'features/quizzes/hooks';
import { secondsToHoursAndMinutes } from 'utils/helper';

import CreateDrawer from 'features/quizzes/components/CreateDrawer';
import DetailsDrawer from 'features/quizzes/components/DetailsDrawer';
import LaunchQuizModal from 'features/quizzes/components/LaunchQuizModal';

const QuizManagementList: React.FC = (): JSX.Element => {
  const [searchText, setSearchText] = useState('');
  const [activeRecord, setActiveRecord] = useState<any | null>(null);
  const [launchQuizId, setLaunchQuizId] = useState<number | null>(null);

  const {
    data,
    refetch: getQuizItems,
    isPending,
    isFetching,
  } = useGetQuizItems();

  const handleSuccess = () => {
    getQuizItems();
    setActiveRecord(null);
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 50,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      align: 'left',
      width: 300,
      render: (_, record) => {
        return (
          <Typography.Text ellipsis className="max-w-[300px]">
            <Highlighter
              searchWords={[searchText]}
              autoEscape
              textToHighlight={record.title}
            />
          </Typography.Text>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      render: (_, record) => {
        return (
          <Typography.Text>
            <Highlighter
              searchWords={[searchText]}
              autoEscape
              textToHighlight={record.description}
            />
          </Typography.Text>
        );
      },
    },
    {
      title: 'Published',
      dataIndex: 'isPublished',
      key: 'isPublished',
      align: 'center',
      width: 120,
      render: (isPublished) => {
        return <Typography.Text>{isPublished ? 'Yes' : 'No'}</Typography.Text>;
      },
    },
    {
      title: 'Time Limit',
      dataIndex: 'timeLimitSeconds',
      key: 'timeLimitSeconds',
      align: 'center',
      width: 100,
      render: (timeLimitSeconds) => {
        return (
          <Typography.Text>
            {secondsToHoursAndMinutes(timeLimitSeconds)}
          </Typography.Text>
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'right',
      width: 100,
      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-x-2 align-middle">
            <Tooltip title="Manage Quiz Settings">
              <Button
                title="Edit"
                onClick={() => setActiveRecord(record)}
                variant="text"
                shape="circle"
                icon={<SettingOutlined />}
              />
            </Tooltip>
            <Tooltip title="Launch Quiz">
              <Button
                type="primary"
                onClick={() => setLaunchQuizId(record.id)}
                variant="text"
                shape="circle"
                icon={<RocketOutlined />}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const filteredData = data?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col gap-y-[20px]">
      <div className="flex h-[30px] items-center justify-between">
        <Input
          style={{ width: '400px' }}
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <CreateDrawer onRecordCreated={handleSuccess} />
      </div>
      <Table<any>
        size="small"
        bordered
        loading={isPending || isFetching}
        scroll={{ y: 'calc(100vh - 115px)' }}
        dataSource={filteredData}
        columns={columns}
        locale={{
          emptyText: <Empty description="No data" />,
        }}
        rowKey="id"
      />
      <DetailsDrawer
        record={activeRecord}
        onClose={() => setActiveRecord(null)}
        onRecordUpdated={handleSuccess}
      />
      <LaunchQuizModal
        onClose={() => setLaunchQuizId(null)}
        quizId={launchQuizId}
      />
    </div>
  );
};

export default QuizManagementList;
