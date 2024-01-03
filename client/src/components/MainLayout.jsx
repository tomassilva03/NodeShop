import React from 'react';
import logo from '../img/Node.png';
import { Navbar, Nav, Container, Button, Form, Offcanvas } from 'react-bootstrap';

const MainLayout = ({ children }) => {
    return (
        <>
        <Navbar key="lg" expand="lg" className="bg-secondary-subtle mb-3">
          <Container fluid>
          <Navbar.Brand href="/NodeShop/">
          <img 
            src={logo}
            alt="NodeShop Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
            />{' '}
            NodeShop</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-lg`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
              className="bg-secondary-subtle"
            >
              <Offcanvas.Header closeButton>
              <img 
                src={logo}
                alt="NodeShop Logo"
                width="30"
                height="30"
                className="d-inline-block align-top"
                />{' '}
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                  NodeShop
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/NodeShop/">Home</Nav.Link>
                  <Nav.Link href="/NodeShop/login">Login</Nav.Link>
                  <Nav.Link href="/NodeShop/register">Register</Nav.Link>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        <Container className="mt-3" fluid>
          {children}
        </Container>
    </>
    );
};

export default MainLayout;
