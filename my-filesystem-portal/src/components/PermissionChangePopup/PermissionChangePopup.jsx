import { Modal, Form, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { changeFilePermission, changeDirectoryPermission } from '@api/file';

export default function PermissionChangePopup({
  id,
  show,
  onClose,
  refresh,
  initialPermission,
  fileType,
}) {
  const [permission, setPermission] = useState({
    read: false,
    write: false,
    execute: false,
  });

  const onCheckboxesChange = (e) => {
    setPermission({ ...permission, [e.target.name]: e.target.checked });
  };

  useEffect(() => {
    setPermission(initialPermission);
  }, [initialPermission]);

  const onClickChange = () => {
    if (fileType === 'file') {
      changeFilePermission({ fileId: id, permission }).then(() => {
        onClose();
        refresh();
      });
    } else {
      changeDirectoryPermission({
        directoryId: id,
        permission,
      }).then(() => {
        onClose();
        refresh();
      });
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title data-testid="change-permission-title">
          Change Permission
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Check
          inline
          label="read"
          name="read"
          type="checkbox"
          checked={permission.read}
          onChange={onCheckboxesChange}
          id="read-checkbox"
        />
        <Form.Check
          inline
          label="write"
          name="write"
          type="checkbox"
          checked={permission.write}
          onChange={onCheckboxesChange}
          id="write-checkbox"
        />
        <Form.Check
          inline
          label="execute"
          name="execute"
          type="checkbox"
          checked={permission.execute}
          onChange={onCheckboxesChange}
          id="execute-checkbox"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onClickChange}>
          Change Permission
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
