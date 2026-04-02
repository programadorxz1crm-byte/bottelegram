import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL || '/api';

const ConstructorPage = () => {
  const [messages, setMessages] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [responses, setResponses] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [msgRes, btnRes, respRes] = await Promise.all([
        axios.get(`${API_URL}/messages`),
        axios.get(`${API_URL}/buttons`),
        axios.get(`${API_URL}/responses`)
      ]);
      setMessages(msgRes.data.map(m => ({...m, id: m._id})));
      setButtons(btnRes.data.map(b => ({...b, id: b._id})));
      setResponses(respRes.data.map(r => ({...r, id: r._id})));
    } catch (error) {
      console.error("Error al cargar datos para el constructor:", error);
    }
  };

  const onFinish = async (values) => {
    try {
      await axios.post(`${API_URL}/responses`, values);
      message.success('Respuesta guardada correctamente');
      fetchData();
      form.resetFields();
    } catch (error) {
      message.error('Error al guardar la respuesta');
      console.error("Error al guardar la respuesta:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/responses/${id}`);
      message.success('Respuesta eliminada correctamente');
      fetchData();
    } catch (error) {
      message.error('Error al eliminar la respuesta');
      console.error("Error al eliminar la respuesta:", error);
    }
  };

  const columns = [
    {
      title: 'Comando',
      dataIndex: 'command',
      key: 'command',
    },
    {
      title: 'Mensaje Asociado',
      key: 'message',
      render: (_, record) => {
        const msg = messages.find(m => m.id === record.messageId);
        return msg ? msg.text : 'N/A';
      }
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="¿Estás seguro de que quieres eliminar esto?" onConfirm={() => handleDelete(record.id)}>
          <a>Eliminar</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Card title="Crear Nueva Respuesta">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ command: '/' }}
        >
          <Form.Item
            name="command"
            label="Comando de Activación"
            rules={[{ required: true, message: 'Por favor, define un comando (ej: /start)' }]}
          >
            <Input placeholder="/start" />
          </Form.Item>

          <Form.Item
            name="messageId"
            label="Mensaje de Texto"
            rules={[{ required: true, message: 'Por favor, selecciona un mensaje.' }]}
          >
            <Select placeholder="Selecciona un mensaje de la lista">
              {messages.map(msg => (
                <Option key={msg.id} value={msg.id}>{msg.text}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="buttonIds"
            label="Botones (opcional)"
          >
            <Select mode="multiple" placeholder="Selecciona uno o más botones">
              {buttons.map(btn => (
                <Option key={btn.id} value={btn.id}>{btn.text}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn-primary">
              Guardar Respuesta
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Respuestas Guardadas">
        <Table columns={columns} dataSource={responses} rowKey="id" />
      </Card>
    </Space>
  );
};

export default ConstructorPage;
