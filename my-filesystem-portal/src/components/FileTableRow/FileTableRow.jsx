import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import FileRenamePopup from '../FileRenamePopup/FileRenamePopup';
import { fileRename, directoryRename } from '../../api/file';
import { useNavigate } from 'react-router-dom';

export default function FileTableRow({
  userId,
  id,
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
      navigate(`/content/${userId}/${id}`);
    }
  };

  const handleRename = (newName, type) => {
    let renameData = {};

    if (type == 'directory') {
      renameData['directoryId'] = id;
      renameData['name'] = newName;

      // Send rename info to the directory update api
      directoryRename(renameData);
    } else {
      // Add rename info to renameData
      renameData['fileId'] = id;
      renameData['name'] = newName;

      // Send rename info to the file update api
      fileRename(renameData);
    }

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
            fileType={fileType}
          />
        </div>
      </td>
    </tr>
  );
}
