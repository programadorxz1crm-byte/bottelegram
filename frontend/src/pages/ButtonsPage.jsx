import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const ButtonsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newButton = {
        key: dataSource.length + 1,
        id: dataSource.length + 1,
        text: values.text,
        type: values.type,
        url: values.url || 'N/A',
      };
      setDataSource([...dataSource, newButton]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Texto del Botón', dataIndex: 'text', key: 'text' },
    { title: 'Tipo', dataIndex: 'type', key: 'type' },
    { title: 'URL', dataIndex: 'url', key: 'url' },
    { title: 'Acciones', key: 'actions', render: () => <a>Eliminar</a> },
  ];

  return (
    <>
      <Card title="Gestión de Botones">
        <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
          + Añadir Botón
        </Button>
        <Table dataSource={dataSource} columns={columns} rowKey="id" />
      </Card>
      <Modal title="Añadir Nuevo Botón" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item name="text" label="Texto del Botón" rules={[{ required: true, message: 'Por favor ingresa el texto del botón' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Tipo" rules={[{ required: true, message: 'Por favor selecciona un tipo' }]}>
            <Select placeholder="Selecciona un tipo">
              <Option value="url">URL</Option>
              <Option value="callback">Callback</Option>
            </Select>
          </Form.Item>
          <Form.Item name="url" label="URL (si el tipo es URL)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ButtonsPage;
