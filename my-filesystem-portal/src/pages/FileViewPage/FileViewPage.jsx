import {
  Breadcrumb,
  Container,
  Table,
  Row,
  Button,
  Col,
} from 'react-bootstrap';
import { Header, FileTableRow } from '@components';
import DirectoryCreationButton from '../../components/DirectoryCreation/DirectoryCreationButton';
import { useCallback, useEffect, useState } from 'react';
import { getFileTree, sendFile } from '@api/file';

export default function FileViewPage() {
  const [tree, setTree] = useState();
  const [displayedFiles, setDisplayedFiles] = useState();
  const [user, setUser] = useState();

  // Refreshes the tree files
  const updateFileTree = useCallback(() => {
    getFileTree({ userId: user.id, parentId: user.rootDirId }).then((data) => {
      setTree({
        path: [data.name],
        files: data,
      });
    });
  }, [user]);

  // set the user state from the local storage
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  // Update the file tree when the user state changes
  useEffect(() => {
    if (user) {
      updateFileTree(user.id, user.rootDirId);
    }
  }, [user, updateFileTree]);

  // Update the displayed files when the tree.path changes
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
        id: currentDir.id,
        fileName: '.',
        fileType: 'directory',
        permissions: currentDir.metadata.perms,
        updatedAt: currentDir.metadata.updatedAt,
      });
      // add the parent directory if not in the root
      if (tree.path.length > 1) {
        files.push({
          id: parentDir.id,
          fileName: '..',
          fileType: 'directory',
          permissions: parentDir.metadata.perms,
          updatedAt: parentDir.metadata.updatedAt,
        });
      }
      if (currentDir.directories) {
        files = files.concat(
          currentDir.directories.map((dir) => {
            return {
              id: dir.id,
              fileName: dir.name,
              fileType: 'directory',
              permissions: dir.metadata.perms,
              updatedAt: dir.metadata.updatedAt,
            };
          }),
        );
      }
      if (currentDir.files) {
        files = files.concat(
          currentDir.files.map((file) => {
            return {
              id: file.id,
              fileName: file.name,
              fileType: 'file',
              permissions: file.metadata.perms,
              updatedAt: file.metadata.updatedAt,
            };
          }),
        );
      }
      setDisplayedFiles(files);
    }
  }, [tree]);

  const handleFileChange = async (event) => {
    // Collect file
    const file = event.target.files[0];

    let formData = {};

    let path = '';
    // Collecting the tree path to the file
    for (let i = 0; i < tree.path.length; i++) {
      path = path + '/' + tree.path[i];
    }

    // Adding file info to formData
    formData['ownerId'] = user.id;
    formData['name'] = file.name;
    formData['path'] = path;
    formData['parentId'] = displayedFiles[0].id;

    // Collecting txt file contents as a string to send to api
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;

      formData['content'] = content;

      // sending formData to file.js for the api POST call
      sendFile(formData).then(updateFileTree);
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
      <Header
        style={{ width: 50 }}
        username={user ? user.name : ''}
        userId={user ? user.id : -1}
      ></Header>
      <Row>
        <Col className="m-3">
          <h1>{user ? user.name + "'s FileSystem" : ''}</h1>
        </Col>
        {displayedFiles ? (
          <DirectoryCreationButton
            tree={tree}
            user={user}
            currentDirId={displayedFiles[0].id}
            updateFileTree={updateFileTree}
          />
        ) : (
          <></>
        )}
        <Col md="auto" className="m-3">
          <input
            type="file"
            id="hiddenFileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button variant="secondary" onClick={handleClick}>
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
              ? displayedFiles.map((file) => {
                  return (
                    <FileTableRow
                      key={file.id}
                      userId={user.id}
                      {...file}
                      clickDirectory={clickDirectory}
                      refresh={updateFileTree}
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
