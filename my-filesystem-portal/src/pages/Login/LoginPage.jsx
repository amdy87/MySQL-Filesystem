import './LoginPage.css';
import React, { useEffect, useState } from 'react';
import { Header } from '@components';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { login } from '@api/user';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onEmailInput = (e) => setEmail(e.target.value.trim());
  const onPasswordInput = (e) => setPassword(e.target.value);
  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/file');
    }
  }, [navigate]);
  const onLogin = () => {
    if (email.length === 0) {
      alert('Please input your email');
      return;
    }
    if (!(email.length >= 5 && /(?=.*.+@.+\..+)/.test(email))) {
      alert('Please input a valid email');
      return;
    }
    if (password.length === 0) {
      alert('Please input your password');
      return;
    }
    login({ password, email }).then((data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.authToken);
      navigate('/file');
    });
  };

  const toSignUp = () => {
    navigate('/signup');
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
              <Form.Group className="mb-3" controlId="loginForm.email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  data-testid="email-input"
                  onInput={onEmailInput}
                  value={email}
                  type="email"
                />
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
            <Button variant="secondary" onClick={onLogin}>
              Login
            </Button>
          </Col>
          <Col md={'auto'}>
            <Button variant="secondary" onClick={toSignUp}>
              Sign Up
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
