import { Header } from '@components';
import { Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { collectUserContent } from '../../api/file';
import React, { useState, useEffect } from 'react';

export default function FileContentView() {
  const { userId, fileId } = useParams();
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData = await collectUserContent(userId);

        const file = userData.files.find(
          (file) => file.id === parseInt(fileId),
        );

        if (file) {
          setFileContent(file.content);
          setFileName(file.name);
        }
      } catch (error) {
        console.error('Failed to fetch file content:', error);
      }
    };

    fetchData();
  }, [userId, fileId]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header style={{ width: 50 }}></Header>
      <Row style={{ borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
        <Col className="m-3">
          <h1>{fileName}</h1>
        </Col>
        <Col md="auto" className="m-3">
          <Button>Edit File</Button>
        </Col>
      </Row>
      <div style={{ marginTop: '10px', marginLeft: '15px' }}>{fileContent}</div>
    </div>
  );
}
