import {
  Breadcrumb,
  Container,
  Table,
  Row,
  Button,
  Col,
} from 'react-bootstrap';
import { Header, FileTableRow, SwitchUserCanvas } from '@components';
import DirectoryCreationButton from '../../components/DirectoryCreation/DirectoryCreationButton';
import { useCallback, useEffect, useState } from 'react';
import { getFileTree, sendFile } from '@api/file';

export default function FileViewPage() {
  const [tree, setTree] = useState();
  const [displayedFiles, setDisplayedFiles] = useState();
  const [user, setUser] = useState();
  const [displayedUser, setDisplayedUser] = useState();
  const [showCanvas, setShowCanvas] = useState(false);

  // Refreshes the tree files
  const updateFileTree = useCallback(() => {
    getFileTree({
      userId: displayedUser.id,
      parentId: tree[tree.length - 1].id,
    }).then((currentDir) => {
      let files = [];
      files.push({
        id: currentDir.id,
        fileName: '.',
        fileType: 'directory',
        permissions: currentDir.metadata.perms,
        updatedAt: currentDir.metadata.updatedAt,
      });
      // add the parent directory if not in the root
      if (tree.length > 1) {
        files.push({
          id: tree[tree.length - 2].id,
          fileName: '..',
          fileType: 'directory',
          permissions: tree[tree.length - 2].permissions,
          updatedAt: tree[tree.length - 2].updatedAt,
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
    });
  }, [tree, displayedUser]);

  // Get the initial file tree
  const getInitialFileTree = useCallback(() => {
    getFileTree({
      userId: displayedUser.id,
      parentId: displayedUser.rootDirId,
    }).then((data) => {
      setTree([
        {
          name: data.name,
          id: data.id,
          permissions: data.metadata.perms,
          updatedAt: data.metadata.updatedAt,
        },
      ]);
    });
  }, [displayedUser]);

  const switchUser = (newUser) => {
    setDisplayedUser(newUser);
    setShowCanvas(false);
  };

  // set the user state from the local storage
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    setDisplayedUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  // Update the file tree when the user state changes
  useEffect(() => {
    if (displayedUser) {
      getInitialFileTree();
    }
  }, [displayedUser, getInitialFileTree]);

  // Update the displayed files when the tree changes
  useEffect(() => {
    if (tree) {
      updateFileTree();
    }
  }, [tree, updateFileTree]);

  const handleFileChange = async (event) => {
    // Collect file
    const file = event.target.files[0];

    let formData = {};

    let path = '';
    // Collecting the tree path to the file
    for (let i = 0; i < tree.length; i++) {
      path = path + '/' + tree[i];
    }

    // Adding file info to formData
    formData['ownerId'] = displayedUser.id;
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

  const clickDirectory = (name, id, permissions, updatedAt) => {
    const treeCopy = [...tree];
    if (name === '..') {
      treeCopy.pop();
    } else {
      treeCopy.push({ name, id, permissions, updatedAt });
    }
    setTree(treeCopy);
  };

  const jumpDirectory = (index) => {
    const path = tree.slice(0, index + 1);
    setTree(path);
  };

  const closeCanvas = () => {
    setShowCanvas(false);
  };
  console.log(user);
  // console.log(user.role === "ADMIN");

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {displayedUser && user?.role === 'ADMIN' ? (
        <SwitchUserCanvas
          show={showCanvas}
          currentUser={displayedUser}
          switchUser={switchUser}
          onClose={closeCanvas}
        ></SwitchUserCanvas>
      ) : (
        <></>
      )}
      <Header
        style={{ width: 50 }}
        username={user ? user.name : ''}
        userId={user ? user.id : -1}
      ></Header>
      <Row>
        <Col className="m-3">
          <h1>{displayedUser ? displayedUser.name + "'s FileSystem" : ''}</h1>
        </Col>
        {displayedFiles &&
        user &&
        displayedUser &&
        user.id === displayedUser.id ? (
          <DirectoryCreationButton
            tree={tree}
            user={displayedUser}
            currentDirId={displayedFiles[0].id}
            updateFileTree={updateFileTree}
          />
        ) : (
          <></>
        )}
        {user && displayedUser && user.id === displayedUser.id ? (
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
        ) : (
          <></>
        )}
        {displayedUser && user?.role === 'ADMIN' ? (
          <Col md="auto" className="m-3">
            <Button variant="primary" onClick={() => setShowCanvas(true)}>
              Switch User
            </Button>
          </Col>
        ) : (
          <></>
        )}
      </Row>
      <Breadcrumb className="m-3">
        {tree ? (
          tree.map((path, i) => {
            if (i != tree.length - 1) {
              return (
                <Breadcrumb.Item key={i} onClick={() => jumpDirectory(i)}>
                  {path.name}
                </Breadcrumb.Item>
              );
            } else {
              return (
                <Breadcrumb.Item key={i} active>
                  {path.name}
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
                      userId={displayedUser.id}
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
