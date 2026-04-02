import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Popconfirm, Space, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const MessagesPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  };

  const handleAdd = () => {
    setEditingMessage(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingMessage(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingMessage) {
          await axios.put(`${API_URL}/messages/${editingMessage.id}`, values);
        } else {
          await axios.post(`${API_URL}/messages`, values);
        }
        fetchMessages();
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Texto del Mensaje',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Editar</a>
          <Popconfirm title="¿Estás seguro de que quieres eliminar este mensaje?" onConfirm={() => handleDelete(record.id)}>
            <a>Eliminar</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Gestión de Mensajes">
      <Button
        type="primary"
        className="btn-primary" // Clase CSS personalizada
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Añadir Mensaje
      </Button>
      <Table columns={columns} dataSource={messages} rowKey="id" />

      <Modal 
        title={editingMessage ? "Editar Mensaje" : "Añadir Nuevo Mensaje"} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okButtonProps={{ className: 'btn-primary' }} // Aplicar estilo al botón OK del modal
      >
        <Form form={form} layout="vertical" name="message_form">
          <Form.Item
            name="text"
            label="Texto del Mensaje"
            rules={[{ required: true, message: 'Por favor, introduce el texto del mensaje.' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MessagesPage;
