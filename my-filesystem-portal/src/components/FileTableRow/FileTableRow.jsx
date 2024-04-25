import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import FileRenamePopup from '../FileRenamePopup/FileRenamePopup';
import PermissionChangePopup from '../PermissionChangePopup/PermissionChangePopup';
import {
  fileRename,
  directoryRename,
  deleteFile,
  deleteDirectory,
} from '../../api/file';
import { useNavigate } from 'react-router-dom';

export default function FileTableRow({
  userId,
  id,
  fileName,
  fileType,
  permissions,
  updatedAt,
  clickDirectory,
  refresh,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const navigate = useNavigate();

  // On file or directory click
  const click = () => {
    // If file type is directory, go inside directory
    if (fileType == 'directory' && permissions.read) {
      clickDirectory(fileName, id, permissions, updatedAt);
    } else if (permissions.read) {
      // Navigates to the file view page for that file
      navigate(`/content/${userId}/${id}`);
    } else {
      alert(`You do not have read access to this ${fileType}`);
    }
  };

  const handleRename = (newName, type) => {
    let renameData = {};

    if (type == 'directory') {
      renameData['directoryId'] = id;
      renameData['name'] = newName;

      // Send rename info to the directory update api
      directoryRename(renameData).then(() => {
        refresh();
      });
    } else {
      // Add rename info to renameData
      renameData['fileId'] = id;
      renameData['name'] = newName;

      // Send rename info to the file update api
      fileRename(renameData).then(() => {
        refresh();
      });
    }

    // Close the rename popup window
    setIsPopupOpen(false);
  };

  // delete file or directory and refresh the page
  const onClickDelete = () => {
    console.log(fileType);
    if (fileType != 'directory') {
      if (confirm('Are you sure you want to delete this file?')) {
        deleteFile({ fileId: id }).then(() => {
          refresh();
        });
      }
    } else {
      if (confirm('Are you sure you want to delete this directory?')) {
        deleteDirectory({ directoryId: id }).then(() => {
          refresh();
        });
      }
    }
  };

  return (
    <tr>
      <PermissionChangePopup
        id={id}
        show={showPermissionPopup}
        onClose={() => {
          setShowPermissionPopup(false);
        }}
        initialPermission={permissions}
        refresh={refresh}
        fileType={fileType}
      ></PermissionChangePopup>
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
          role="link"
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
          {
            // if the directory is root, do not show the delete button
            fileName != '.' && fileName != '..' && (
              <Button variant="danger" onClick={onClickDelete}>
                Delete
              </Button>
            )
          }

          {
            // if the directory is root, do not show the rename button
            fileName != '.' && fileName != '..' && (
              <Button
                variant="dark"
                className="mx-3"
                onClick={() => setIsPopupOpen(true)}
              >
                Rename
              </Button>
            )
          }
          <FileRenamePopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onRename={handleRename}
            fileName={fileName}
            fileType={fileType}
          />
          {
            // if the directory is root, do not show the permission button
            fileName != '.' && fileName != '..' && (
              <Button
                variant="dark"
                onClick={() => setShowPermissionPopup(true)}
              >
                Change Permission
              </Button>
            )
          }
        </div>
      </td>
    </tr>
  );
}
