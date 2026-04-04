import React, { useState, useEffect } from 'react';
import { Upload, message, List, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const API_URL = import.meta.env.VITE_API_URL;

const MultimediaPage = () => {
  const [fileList, setFileList] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/files`);
      // Asumiendo que la respuesta es un array de objetos {name, url}
      setFileList(response.data);
    } catch (error) {
      console.error("Error al obtener los archivos:", error);
      message.error('No se pudieron cargar los archivos existentes.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const props = {
    name: 'file',
    multiple: true,
    action: `${API_URL}/upload`,
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} subido correctamente.`);
        fetchFiles(); // Recargar la lista de archivos después de una subida exitosa
      } else if (status === 'error') {
        message.error(`${info.file.name} no se pudo subir.`);
      }
    },
  };

  return (
    <Card title="Gestión de Multimedia">
      <Dragger {...props} style={{ marginBottom: 24 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Haz clic o arrastra archivos a esta área para subirlos</p>
        <p className="ant-upload-hint">
          Soporte para subida única o múltiple.
        </p>
      </Dragger>

      <List
        header={<div>Archivos Subidos</div>}
        bordered
        dataSource={fileList}
        renderItem={item => (
          <List.Item>
            {/* La URL completa ya viene del backend */}
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MultimediaPage;
