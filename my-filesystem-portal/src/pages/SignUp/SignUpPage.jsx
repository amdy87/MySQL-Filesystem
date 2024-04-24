import './SignUpPage.css';
import React, { useState } from 'react';
import { Header } from '@components';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signup } from '@api/user';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const navigate = useNavigate();

  const onPasswordInput = (e) => setPassword(e.target.value);
  const onNameInput = (e) => setName(e.target.value.trim());
  const onEmailInput = (e) => setEmail(e.target.value.trim());
  const onPasswordCheckInput = (e) => setPasswordCheck(e.target.value);

  const toLogin = () => {
    navigate('/');
  };

  const onSignUp = () => {
    if (name.length === 0) {
      alert('Please input your name');
      return;
    }
    if (email.length === 0) {
      alert('Please input your email');
      return;
    }
    if (
      password.length < 8 ||
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)
    ) {
      alert(
        'Please input a password with the following requirements: 8 or more characters, at least one uppercase letter, lowercase letter, and digit',
      );
      return;
    }
    if (password != passwordCheck) {
      alert('The passwords entered do not match');
      return;
    }
    signup({ name, email, password }).then((data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.authToken);
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
              <Form.Group className="mb-3" controlId="loginForm.passwordCheck">
                <Form.Label>Retype Password</Form.Label>
                <Form.Control
                  onInput={onPasswordCheckInput}
                  value={passwordCheck}
                  type="password"
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center md-6">
          <Col md={'auto'}>
            <Button variant="secondary" onClick={toLogin}>
              Back to Login
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
