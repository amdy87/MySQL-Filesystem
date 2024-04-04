import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import FileRenamePopup from '../FileRenamePopup/FileRenamePopup';
import { fileRename } from '../../api/file';
import { useNavigate } from 'react-router-dom';

export default function FileTableRow({
  userId,
  fileId,
  fileName,
  fileType,
  permissions,
  updatedAt,
  clickDirectory,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  // On file or directory click
  const click = () => {
    // If file type is directory, go inside directory
    if (fileType == 'directory') {
      clickDirectory(fileName);
    } else {
      console.log(userId);
      // Navigates to the file view page for that file
      navigate(`/content/${userId}/${fileId}`);
    }
  };

  const handleRename = (name) => {
    let renameData = {};

    // TODO: Collect the fileId from the file tree.

    // Add rename info to renameData
    renameData['fileId'] = 1;
    renameData['name'] = name;

    // Send rename info to the api post call method
    fileRename(renameData);

    // Close the rename popup window
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
