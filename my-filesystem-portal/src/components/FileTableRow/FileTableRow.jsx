import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import FileRenamePopup from '../FileRenamePopup/FileRenamePopup';
import { fileRename } from '../../api/file';

export default function FileTableRow({
  fileName,
  fileType,
  permissions,
  updatedAt,
  clickDirectory,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const click = () => {
    if (fileType == 'directory') {
      clickDirectory(fileName);
    } else {
      // TODO: popup the text file
    }
  };

  const handleRename = (name) => {
    let renameData = {};

    // TODO: Collect the fileId from the file tree.

    renameData['fileId'] = 1;
    renameData['name'] = name;

    fileRename(renameData);
    setIsPopupOpen(false);
  };

  return (
    <tr>
      <td>
        <a
          onClick={click}
          style={
            fileName != '.'
              ? {
                  color: '#646cff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }
              : {}
          }
        >
          {fileName}
        </a>
      </td>
      <td>{fileType}</td>
      <td>
        {(permissions.read ? 'R' : '') +
          (permissions.write ? 'W' : '') +
          (permissions.execute ? 'X' : '')}
      </td>
      <td>{new Date(updatedAt).toLocaleString()}</td>
      <td>
        <div>
          <Button variant="dark" className="mx-3">
            Delete
          </Button>
          <Button
            variant="dark"
            className="mx-3"
            onClick={() => setIsPopupOpen(true)}
          >
            Rename
          </Button>
          <FileRenamePopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onRename={handleRename}
            fileName={fileName}
          />
        </div>
      </td>
    </tr>
  );
}
