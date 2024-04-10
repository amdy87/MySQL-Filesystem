import { Button, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import NameDirectoryPopup from '../NameDirectoryPopup/NameDirectoryPopup';
import { sendDirectory } from '../../api/file';

export default function DirectoryCreationButton({
  tree,
  currentDirId,
  user,
  updateFileTree,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const createDirectory = (dirName) => {
    let formData = {};

    let path = '';
    // Collecting the tree path to the file
    for (let i = 0; i < tree.path.length; i++) {
      path = path + '/' + tree.path[i];
    }

    formData['ownerId'] = user.id;
    formData['name'] = dirName;
    formData['path'] = path;
    formData['parentId'] = currentDirId;

    sendDirectory(formData).then(updateFileTree);

    setIsPopupOpen(false);
  };

  return (
    <Col md="auto" className="m-3">
      <Button
        variant="secondary"
        style={{ marginLeft: 20 }}
        onClick={() => setIsPopupOpen(true)}
      >
        Add Directory
      </Button>
      <NameDirectoryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onDirCreation={createDirectory}
      />
    </Col>
  );
}
