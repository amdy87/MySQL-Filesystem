import React, { useState } from 'react';
import {
  Container,
  Navbar,
  Col,
  NavDropdown,
  Modal,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '@api/user';
import mysqllogo from '@assets/mysqllogo.jpg';
export default function Header({ username, userId }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const onDeleteAccount = () => {
    setShow(false);
    deleteAccount({ userId }).then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      navigate('/');
    });
  };

  const handleClose = () => setShow(false);
  const showModal = () => setShow(true);

  return (
    <Navbar style={{ height: 60 }} bg="light" className="bg-body-tertiary">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Action Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleteing account will result in deletion of all files in the
          filesystem. Please confirm this action.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            data-testid="close-button"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={onDeleteAccount}
            data-testid="confirm-button"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Container fluid>
        <Navbar.Brand href="/file" className="align-items-center">
          <img
            alt=""
            src={mysqllogo}
            width="50"
            height="50"
            className="d-inline-block align-top"
            style={{ borderRadius: '50%' }}
          />
        </Navbar.Brand>
        <Col md="auto" style={{ fontSize: 16, fontWeight: 700 }}>
          MyFileSystem
        </Col>
        <Navbar.Toggle />
        {username ? (
          <>
            <NavDropdown title={'Welcome ' + username} id="user-nav-dropdown">
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              <NavDropdown.Item onClick={showModal}>
                Delete Account
              </NavDropdown.Item>
            </NavDropdown>
          </>
        ) : (
          <></>
        )}
      </Container>
    </Navbar>
  );
}
