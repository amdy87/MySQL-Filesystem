import React from 'react';
import { Container, Navbar, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import mysqllogo from '@assets/mysqllogo.jpg';
export default function Header({ username }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <Navbar style={{ height: 60 }} bg="light" className="bg-body-tertiary">
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
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>Welcome, {username}</Navbar.Text>
            </Navbar.Collapse>
            <Col md="auto" className="align-items-center">
              <Button
                variant="secondary"
                style={{ marginLeft: 20 }}
                onClick={logout}
              >
                Logout
              </Button>
            </Col>
          </>
        ) : (
          <></>
        )}
      </Container>
    </Navbar>
  );
}
