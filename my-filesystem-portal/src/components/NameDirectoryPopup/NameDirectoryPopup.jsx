import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import '../Popup.css';

const NameDirectoryPopup = ({ isOpen, onClose, onDirCreation }) => {
  const [dirName, setDirName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDirCreation(dirName);
    onClose();
    setDirName('')
  };

  if (!isOpen) return null;

  return (
    <div className="popup-background">
      <div className="popup-container">
        <form onSubmit={handleSubmit}>
          <label>
            Directory Name:
            <input
              type="text"
              value={dirName}
              onChange={(e) => setDirName(e.target.value)}
            />
          </label>
          <Button
            type="submit"
            style={{ marginRight: '10px', marginLeft: '10px' }}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </form>
      </div>
    </div>
  );
};

export default NameDirectoryPopup;
