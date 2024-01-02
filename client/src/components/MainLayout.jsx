import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const MainLayout = ({ children }) => {
    return (
        <div>
            {/* Navbar */}
            <Navbar bg="success" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/NodeShop/">NodeShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/NodeShop/">Home</Nav.Link>
                            {/* Add other navbar links as needed */}
                        </Nav>
                        <Nav>
                            <Nav.Link href="/NodeShop/login">Login</Nav.Link>
                            <Nav.Link href="/NodeShop/register">Register</Nav.Link>
                            {/* Add user-related actions like logout */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Content */}
            <Container className="mt-3">{children}</Container>
        </div>
    );
};

export default MainLayout;
