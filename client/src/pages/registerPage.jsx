import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import MainLayout from '../components/MainLayout';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    countryCode: '',
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [userExists, setUserExistsState] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const handleClosePasswordsMatch = () => {
    setPasswordsMatch(true);
  };

  const handleCloseUserExists = () => {
    setUserExistsState(false);
  };

  const handleClosePasswordError = () => {
    setPasswordError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userAlreadyExists = await checkUserExists(formData.email);

    if (userAlreadyExists) {
      // Display an error message or prevent form submission
      console.error('User with this email already exists');
      setUserExistsState(true);
      return;
    }

    setUserExistsState(false);

    if (!isPasswordValid(formData.password)) {
      // Display an error message or prevent form submission
      console.error('Password must have at least 8 characters');
      setPasswordError(true);
      return;
    }

    setPasswordError(false);

    // Check if the passwords match
    if (formData.password !== formData.confirmPassword) {
      // Display an error message or prevent form submission
      console.error('Passwords do not match');
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);

    try {
      // Make an API request to your backend for user registration
      const response = await axios.post('/auth/api/register', formData);
  
      // Handle the response
      console.log('Registration successful:', response.data);
      // Redirect the user to a success page or perform other actions
  
    } catch (error) {
      // Handle registration error
      console.error('Registration error:', error.response.data);
      // Display an error message to the user or perform other error handling
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>NodeShop | Register</title>
      </Helmet>
      <div className="container mt-5">
        <h2>Register</h2>
        {!passwordsMatch && (
          <Alert variant="danger" dismissible onClose={handleClosePasswordsMatch}>
            Passwords do not match. Please check your input.
          </Alert>
        )}
        {userExists && (
          <Alert variant="danger" dismissible onClose={handleCloseUserExists}>
            User with this email already exists. Please use a different email.
          </Alert>
        )}
        {PasswordError && (
          <Alert variant="danger" dismissible onClose={handleClosePasswordError}>
            Password must have at least 8 characters
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

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

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button onClick={() => setShowPassword(!showPassword)} variant="outline-secondary" id="button-addon2">
                {showPassword ? 'Hide password' : 'Show password'}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your phone number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCountryCode">
            <Form.Label>Country Code</Form.Label>
            <Form.Control
              as="select"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
            >
              <option value="">Select Country Code</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              {/* Add more options as needed */}
            </Form.Control>
          </Form.Group>

          <Button variant="success" type="submit">
            Register
          </Button>
        </Form>

        <div className="mt-3">
            <p>
                Already have an account? <Link to="/login">Login here</Link>.
            </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
