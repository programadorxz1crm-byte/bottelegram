import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post(`${API_URL}/login`, values);
      message.success('¡Inicio de sesión exitoso!');
      setIsAuthenticated(true);
      navigate('/'); // Redirigir al dashboard
    } catch (error) {
      message.error('Credenciales inválidas');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="Iniciar Sesión" style={{ width: 350 }}>
        <Form
          name="login_form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor, ingresa tu usuario' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario (admin)" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña (admin)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
