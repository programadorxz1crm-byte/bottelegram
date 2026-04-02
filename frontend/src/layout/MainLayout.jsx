import React, { useState } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MessageOutlined,
  AppstoreOutlined,
  PaperClipOutlined,
  UserOutlined,
  BuildOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, Routes, Route } from 'react-router-dom';
import MessagesPage from '../pages/MessagesPage';
import ButtonsPage from '../pages/ButtonsPage';
import MultimediaPage from '../pages/MultimediaPage';
import ConstructorPage from '../pages/ConstructorPage';
import SettingsPage from '../pages/SettingsPage';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="custom-layout" style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: '10px'}} />
            {!collapsed && <div style={{ color: 'white', fontSize: '16px'}}>Admin</div>}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<BuildOutlined />}>
            <Link to="/">Constructor</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<MessageOutlined />}>
            <Link to="/messages">Mensajes</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />}>
            <Link to="/buttons">Botones</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<PaperClipOutlined />}>
            <Link to="/multimedia">Multimedia</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<SettingOutlined />}>
            <Link to="/settings">Ajustes</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 24px' }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
            style: { fontSize: '18px' }
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'var(--content-bg)'
          }}
        >
          <Routes>
            <Route path="/" element={<ConstructorPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/buttons" element={<ButtonsPage />} />
            <Route path="/multimedia" element={<MultimediaPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
