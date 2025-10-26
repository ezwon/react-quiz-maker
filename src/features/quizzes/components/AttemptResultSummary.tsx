import React from 'react';
import { Empty, Table, TableColumnsType, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

type Props = {
  summaryDetails: {
    details: {
      correct: boolean;
      expected: string;
      questionId: number;
    }[];
    score: number;
  };
  questions: any[];
};

const AttemptResultSummary: React.FC<Props> = ({
  summaryDetails,
  questions,
}) => {
  const summaryDetailsObject: { [key: string]: any } =
    summaryDetails.details.reduce(
      (acc: { [key: string | number]: any }, item: any) => {
        acc[item.questionId] = item;
        return acc;
      },
      {},
    );

  const columns: TableColumnsType<any> = [
    {
      title: 'Question',
      dataIndex: 'prompt',
      key: 'prompt',
      align: 'left',
    },
    {
      title: 'Correct Answer',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      render: (_, record) => {
        return summaryDetailsObject[record.id].expected;
      },
    },
    {
      title: 'Result',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (_, record) => {
        return summaryDetailsObject[record.id].correct ? (
          <CheckCircleOutlined
            style={{ color: '#60ef55' }}
            className="text-[20px]"
          />
        ) : (
          <CloseCircleOutlined
            style={{ color: '#e6273d' }}
            className="!text-red text-[20px]"
          />
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-y-2 px-5">
      <Typography.Text>
        Score:{' '}
        <strong>
          {summaryDetails?.score}/{questions.length}
        </strong>
      </Typography.Text>
      <Table<any>
        size="small"
        bordered
        dataSource={questions}
        columns={columns}
        locale={{
          emptyText: <Empty description="No data" />,
        }}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
};

export default AttemptResultSummary;
