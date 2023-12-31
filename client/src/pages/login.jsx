import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [userExists, setUserExistsState] = useState(true);
    const [passwordError, setPasswordError] = useState(false);

    const handleCloseUserExists = () => {
        setUserExistsState(true);
    }

    const handleClosePasswordError = () => {
        setPasswordError(false);
    }


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const checkUserExists = async (email) => {
        try {
          // Implement logic to check user existence (e.g., make an API request)
          const response = await axios.get(`/auth/api/check-user?email=${email}`);
          return response.data.exists;
        } catch (error) {
          console.error('Error checking user existence:', error.message);
          return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userAlreadyExists = await checkUserExists(formData.email);

        if (!userAlreadyExists) {
        // Display an error message or prevent form submission
        console.error('A user with that email does not exist. Please register first.');
        setUserExistsState(false);
        return;
        }

        setUserExistsState(true);

        try {
            const response = await axios.post('/auth/api/login', formData);
            console.log(response);
        } catch (error) {
            console.error('Error logging in:', error);
            setPasswordError(true);
        }
    }

    return (
        <div className="container mt-5">
          <h2>Login</h2>
            {!userExists && (
            <Alert variant="danger" onClose={handleCloseUserExists} dismissible>
                A user with that email does not exist. Please register first.
            </Alert>
            )}
            {passwordError && (
            <Alert variant="danger" onClose={handleClosePasswordError} dismissible>
                Password is incorrect.
            </Alert>
            )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
    
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
    
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>

          <div className="mt-3">
                <p>
                    Don't have an accountt? <Link to="/register">Register here</Link>.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;