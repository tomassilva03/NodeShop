import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import MainLayout from '../components/MainLayout';

const LoginPage = () => {

    const history = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [userExists, setUserExistsState] = useState(true);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            if (response.status === 200) {
                console.log(response);
                history('/');
            } else {
                console.error('Incorrect password. Please try again.');
                setPasswordError(true);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
      <MainLayout>
        <Helmet>
          <title>NodeShop | Login</title>
        </Helmet>
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
              <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button onClick={() => setShowPassword(!showPassword)} variant="outline-secondary" id="button-addon2">
                  {showPassword ? 'Hide password' : 'Show password'}
                </Button>
              </InputGroup>
          </Form.Group>
    
            <Button variant="success" type="submit">
              Login
            </Button>
          </Form>

          <div className="mt-2">
                <p>
                    Don't have an account? <Link to="/register">Register here</Link>.
                </p>
            </div>
        </div>
      </MainLayout>
    );
};

export default LoginPage;