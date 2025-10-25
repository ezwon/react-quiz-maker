import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // @ts-ignore
  return (
    <Layout className="min-h-[100vh]">
      <Sider
        className="border-r border-solid border-gray-200 dark:border-[#303030]"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={180}
      >
        <div className="logo my-[10px] flex h-[44px]">
          <SettingOutlined />
        </div>
        <Menu
          className="!border-none"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/quizzes',
              icon: <DashboardOutlined />,
              label: 'Quizzes',
              onClick: () => {
                navigate('/quizzes');
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-start pl-[10px] align-middle"
          style={{ background: '#e2e2e2' }}
        >
          <Button
            shape="circle"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Header>
        <Content
          className="px-[24px] py-[14px]"
          style={{
            margin: '16px',
            minHeight: 280,
            background: '#e2e2e2',
            borderRadius: '10px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
