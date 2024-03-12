
import "./SignUpPage.css"
import React, { useState } from 'react'
import { Header } from '@components'
import { Button, Container, Row, Col, Form } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const[name, setName] = useState("")
    const[email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const onUsernameInput = (e) => setUsername(e.target.value);
    const onPasswordInput = (e) => setPassword(e.target.value);
    const onNameInput = (e) => setName(e.target.value);
    const onEmailInput = (e) => setEmail(e.target.value);

    const signUp = () => {
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        console.log(password, username, email, name);
        navigate("/file");

    }
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Header style={{ width: 50 }}></Header>
            <div className='container'>
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
                            <Form.Group className="mb-3" controlId="loginForm.username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control onInput={onUsernameInput} value={username} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="loginForm.password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control onInput={onPasswordInput} value={password} type="password" />
                            </Form.Group>
                        </Form>
                    </Col>

                </Row>
                <Row className="justify-content-md-center md-6">
                    <Col md={'auto'}>
                        <Button variant="secondary" onClick={signUp}>Sign Up</Button>
                    </Col>
                </Row>
            </div>
        </div>

    )
}