import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const SettingsPage = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Cargar la configuración actual cuando el componente se monta
    axios.get(`${API_URL}/config`)
      .then(response => {
        form.setFieldsValue(response.data);
      })
      .catch(error => {
        console.error('No se pudo cargar la configuración', error);
      });
  }, [form]);

  const onFinish = async (values) => {
    try {
      await axios.post(`${API_URL}/config`, values);
      message.success('¡Configuración guardada con éxito! El bot se reiniciará con el nuevo token.');
    } catch (error) {
      message.error('No se pudo guardar la configuración.');
    }
  };

  return (
    <Card title="Ajustes de Configuración">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="TELEGRAM_TOKEN"
          label="Token del Bot de Telegram"
          rules={[{ required: true, message: 'Por favor, introduce el token de tu bot.' }]}
        >
          <Input.Password placeholder="Introduce tu token aquí" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar Configuración
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SettingsPage;
