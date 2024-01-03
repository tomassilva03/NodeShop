import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
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
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [userExists, setUserExistsState] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const country_phone_code = [
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkUserExists = async (email) => {
    try {
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

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData({
      ...formData,
      country_phone_code: country.code,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userAlreadyExists = await checkUserExists(formData.email);

    if (userAlreadyExists) {
      console.error('User with this email already exists');
      setUserExistsState(true);
      return;
    }

    setUserExistsState(false);

    if (!isPasswordValid(formData.password)) {
      console.error('Password must have at least 8 characters');
      setPasswordError(true);
      return;
    }

    setPasswordError(false);

    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);

    const fullPhoneNumber = `${formData.country_phone_code}${formData.phone_number}`;

    try {

      const updatedFormData = {
        ...formData,
        phone_number: fullPhoneNumber,
      };

      const response = await axios.post('/auth/api/register', updatedFormData);

      console.log('Registration successful:', response.data);
      // Redirect the user to home
    } catch (error) {
      console.error('Registration error:', error.response.data);
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
            <InputGroup>
              <DropdownButton
                variant="outline-secondary"
                title={selectedCountry ? `${selectedCountry.country} (${selectedCountry.code})` : 'Select Country'}
                id="input-group-dropdown-1"
              >
                {country_phone_code.map((country) => (
                  <Dropdown.Item
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                  >
                    {country.country} ({country.code})
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Button className="mt-2" variant="success" type="submit">
            Register
          </Button>
        </Form>

        <div className="mt-3">
          <p>
            Already have an account? <Link to="/NodeShop/login">Login here</Link>.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
