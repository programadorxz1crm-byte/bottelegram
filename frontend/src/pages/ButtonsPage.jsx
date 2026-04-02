import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Popconfirm, Space, Select, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const { Option } = Select;

const ButtonsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [buttons, setButtons] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      const response = await axios.get(`${API_URL}/buttons`);
      setButtons(response.data);
    } catch (error) {
      console.error("Error al obtener los botones:", error);
    }
  };

  const handleAdd = () => {
    setEditingButton(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingButton(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/buttons/${id}`);
      fetchButtons();
    } catch (error) {
      console.error("Error al eliminar el botón:", error);
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingButton) {
          await axios.put(`${API_URL}/buttons/${editingButton.id}`, values);
        } else {
          await axios.post(`${API_URL}/buttons`, values);
        }
        fetchButtons();
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error al guardar el botón:", error);
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
      title: 'Texto del Botón',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Editar</a>
          <Popconfirm title="¿Estás seguro de que quieres eliminar este botón?" onConfirm={() => handleDelete(record.id)}>
            <a>Eliminar</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Gestión de Botones">
      <Button
        type="primary"
        className="btn-primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Añadir Botón
      </Button>
      <Table columns={columns} dataSource={buttons} rowKey="id" />

      <Modal 
        title={editingButton ? "Editar Botón" : "Añadir Nuevo Botón"} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okButtonProps={{ className: 'btn-primary' }}
      >
        <Form form={form} layout="vertical" name="button_form">
          <Form.Item
            name="text"
            label="Texto del Botón"
            rules={[{ required: true, message: 'Por favor, introduce el texto del botón.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Tipo de Botón"
            rules={[{ required: true, message: 'Por favor, selecciona un tipo de botón.' }]}
          >
            <Select placeholder="Selecciona un tipo">
              <Option value="url">URL</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: 'Por favor, introduce la URL.' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ButtonsPage;
