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
    if (e.target.checked == '') {
      setPermission({ ...permission, [e.target.name]: false });
    } else {
      setPermission({ ...permission, [e.target.name]: true });
    }
  };

  useEffect(() => {
    setPermission(initialPermission);
  }, [initialPermission]);

  const onClickChange = () => {
    const permissionsReformat = [
      permission.read,
      permission.write,
      permission.execute,
    ];
    if (fileType === 'file') {
      changeFilePermission({
        fileId: id,
        permissions: permissionsReformat,
      }).then(() => {
        onClose();
        refresh();
      });
    } else {
      changeDirectoryPermission({
        directoryId: id,
        permissions: permissionsReformat,
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
