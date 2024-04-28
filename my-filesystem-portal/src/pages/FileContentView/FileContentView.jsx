import { Header } from '@components';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { collectUserContent, updateFile } from '../../api/file';
import React, { useState, useEffect } from 'react';

export default function FileContentView() {
  const location = useLocation();
  const treeFromParams = location.state?.tree;
  const navigate = useNavigate();

  const { userId, fileId } = useParams();
  const [filePath, setFilePath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileEditContent, setFileEditContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [permission, setPermission] = useState({
    read: false,
    write: false,
    execute: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData = await collectUserContent(userId);

        const file = userData.files.find(
          (file) => file.id === parseInt(fileId),
        );

        if (file) {
          setFileContent(file.content);
          setFileEditContent(file.content);
          setFileName(file.name);
          setFilePath(file.path);
          const filePerms = {
            read: file.permissions[0].enabled,
            write: file.permissions[1].enabled,
            execute: file.permissions[2].enabled,
          };
          setPermission(filePerms);
        }
      } catch (error) {
        console.error('Failed to fetch file content:', error);
      }
    };

    fetchData();
  }, [userId, fileId]);

  const onInputChange = (event) => {
    setFileEditContent(event.target.value);
  };

  const onClickEdit = () => {
    setFileEditContent(fileContent);
    setIsEditing(true);
  };

  const onConfirmEdit = () => {
    // prevent user from creating a file larger than our server will handle
    if (fileEditContent.length > 175) {
      alert(
        `File length too long. Only 175 characters are supported and you have ${fileEditContent.length}`,
      );
      return;
    }

    updateFile({ fileId: parseInt(fileId), content: fileEditContent }).then(
      () => {
        setFileContent(fileEditContent);
        setIsEditing(false);
      },
    );
  };

  // Navagates back to file tree view when clicked
  const onClickBackPage = () => {
    // Navigate back to the previous directory using the passed tree state
    navigate('/file', { state: { tree: treeFromParams }, replace: true });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header style={{ width: 50 }}></Header>
      <Row style={{ borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
        <Col className="m-3">
          <Row>
            <h6>{filePath}</h6>
            <h1>{fileName}</h1>
          </Row>
        </Col>
        <Col md="auto" className="m-3">
          <Button onClick={onClickBackPage}>Back</Button>
        </Col>
        {permission.write && !isEditing && (
          <Col md="auto" className="m-3">
            <Button onClick={onClickEdit}>Edit File</Button>
          </Col>
        )}
      </Row>
      {permission.write && isEditing ? (
        <Form>
          <Form.Group className="mb-3" controlId="form.fileContent">
            <Form.Label></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={fileEditContent}
              onChange={onInputChange}
            />
          </Form.Group>
          <Row>
            <Col md="auto" className="m-3">
              <Button onClick={onConfirmEdit}>Confirm</Button>
            </Col>
            <Col md="auto" className="m-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <div
          style={{
            marginTop: '10px',
            marginLeft: '15px',
            marginRight: '15px',
            wordWrap: 'break-word',
          }}
        >
          {fileContent}
        </div>
      )}
    </div>
  );
}
