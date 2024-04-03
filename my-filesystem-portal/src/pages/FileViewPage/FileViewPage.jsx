import {
  Breadcrumb,
  Container,
  Table,
  Row,
  Button,
  Col,
} from 'react-bootstrap';
import { Header, FileTableRow } from '@components';
import { useEffect, useState } from 'react';
import { getFileTree, sendFile } from '@api/file';

export default function FileViewPage() {
  const [tree, setTree] = useState();
  const [displayedFiles, setDisplayedFiles] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    updateFileTree(); // Initial fetch of the file tree
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  // Refreshes the tree files
  const updateFileTree = () => {
    getFileTree().then((data) => {
      setTree({
        path: [data.name],
        files: data,
      });
    });
  };

  useEffect(() => {
    if (tree) {
      let files = [];
      let currentDir = tree.files,
        parentDir = null;
      // look for the current directory by the path stack
      for (let i = 1; i < tree.path.length; i++) {
        if (currentDir.directories) {
          parentDir = currentDir;
          currentDir = currentDir.directories.find(
            (dir) => dir.name === tree.path[i],
          );
        }
      }

      files.push({
        fileName: '.',
        fileType: 'directory',
        permissions: currentDir.metadata.perms,
        updatedAt: currentDir.metadata.updatedAt,
      });
      // add the parent directory if not in the root
      if (tree.path.length > 1) {
        files.push({
          fileName: '..',
          fileType: 'directory',
          permissions: parentDir.metadata.perms,
          updatedAt: parentDir.metadata.updatedAt,
        });
      }
      files = files.concat(
        currentDir.directories.map((dir) => {
          return {
            fileName: dir.name,
            fileType: 'directory',
            permissions: dir.metadata.perms,
            updatedAt: dir.metadata.updatedAt,
          };
        }),
      );
      files = files.concat(
        currentDir.files.map((file) => {
          return {
            fileName: file.name,
            fileType: 'file',
            permissions: file.metadata.perms,
            updatedAt: file.metadata.updatedAt,
          };
        }),
      );
      setDisplayedFiles(files);
    }
  }, [tree]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    let formData = {};

    let path = '';
    // Collecting the tree path to the file
    for (let i = 0; i < tree.path.length; i++) {
      path = path + '/' + tree.path[i];
    }

    // Adding file info to formData
    formData['ownerId'] = 1;
    formData['name'] = file.name;
    formData['path'] = path;
    formData['parentId'] = 1;

    // Collecting txt file contents as a string to send to api
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;

      formData['content'] = content;

      // sending formData to file.js for the api POST call
      let response = sendFile(formData);

      // If the response of the sendFile is true then refresh the file tree
      if (response) {
        updateFileTree();
      }
    };
    reader.onerror = (error) => {
      // Log the file reading error
      console.log('Error reading file:', error);
    };
    reader.readAsText(file);
  };

  // Redirects the click action to the hiddenFileInput
  const handleClick = () => {
    document.getElementById('hiddenFileInput').click();
  };

  const clickDirectory = (name) => {
    const path = tree.path;
    if (name === '..') {
      path.pop();
    } else {
      path.push(name);
    }
    setTree({
      path: path,
      files: tree.files,
    });
  };

  const jumpDirectory = (index) => {
    const path = tree.path.slice(0, index + 1);
    setTree({
      path: path,
      files: tree.files,
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header style={{ width: 50 }} username={user ? user.name : ''}></Header>
      <Row>
        <Col className="m-3">
          <h1>{'Boyan Sun' + "'s FileSystem"}</h1>
        </Col>
        <Col md="auto" className="m-3">
          <input
            type="file"
            id="hiddenFileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            variant="secondary"
            style={{ marginLeft: 20 }}
            onClick={handleClick}
          >
            Add File
          </Button>
        </Col>
      </Row>
      <Breadcrumb className="m-3">
        {tree ? (
          tree.path.map((path, i) => {
            if (i != tree.path.length - 1) {
              return (
                <Breadcrumb.Item key={i} onClick={() => jumpDirectory(i)}>
                  {path}
                </Breadcrumb.Item>
              );
            } else {
              return (
                <Breadcrumb.Item key={i} active>
                  {path}
                </Breadcrumb.Item>
              );
            }
          })
        ) : (
          <></>
        )}
      </Breadcrumb>
      <Container fluid style={{ height: 'calc(100vh - 100px)' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
              <th>Permission</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedFiles
              ? displayedFiles.map((file, idx) => {
                  return (
                    <FileTableRow
                      // TODO: give this a better key?
                      key={idx}
                      {...file}
                      clickDirectory={clickDirectory}
                    ></FileTableRow>
                  );
                })
              : null}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
