import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import './FileRenamePopup.css';

const FileRenamePopup = ({ isOpen, onClose, onRename, fileName, fileType }) => {
  const [newName, setNewName] = useState(fileName);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRename(newName, fileType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-background">
      <div className="popup-container">
        <form onSubmit={handleSubmit}>
          <label>
            New Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
          <Button
            type="submit"
            style={{ marginRight: '10px', marginLeft: '10px' }}
          >
            Rename
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </form>
      </div>
    </div>
  );
};

export default FileRenamePopup;
