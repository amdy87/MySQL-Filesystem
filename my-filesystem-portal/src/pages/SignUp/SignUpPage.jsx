import './SignUpPage.css';
import React, { useState } from 'react';
import { Header } from '@components';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signup } from '@api/user';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onPasswordInput = (e) => setPassword(e.target.value);
  const onNameInput = (e) => setName(e.target.value.trim());
  const onEmailInput = (e) => setEmail(e.target.value.trim());

  const toLogin = () => {
    navigate('login');
  };

  const onSignUp = () => {
    if (name.length === 0) {
      alert('please input the name');
      return;
    }
    if (email.length === 0) {
      alert('please input the email');
      return;
    }
    if (password.length === 0) {
      alert('please input the password');
      return;
    }
    signup({ name, email, password }).then((data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', JSON.stringify(data.authToken));
      navigate('/file');
    });
  };
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Header style={{ width: 50 }}></Header>
      <div className="container">
        <Row className="md-auto">
          <Col className="header">
            <div className="text">Welcome</div>
          </Col>
        </Row>
        <Row className="justify-content-md-center md-6">
          <Col xs={12} md={6} lg={4}>
            <Form>
              <Form.Group className="mb-3" controlId="loginForm.name">
                <Form.Label>Name</Form.Label>
                <Form.Control onInput={onNameInput} value={name} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginForm.email">
                <Form.Label>Email</Form.Label>
                <Form.Control onInput={onEmailInput} value={email} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginForm.password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onInput={onPasswordInput}
                  value={password}
                  type="password"
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center md-6">
          <Col md={'auto'}>
            <Button variant="secondary" onClick={toLogin}>
              Login
            </Button>
          </Col>
          <Col md={'auto'}>
            <Button variant="secondary" onClick={onSignUp}>
              Sign Up
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
