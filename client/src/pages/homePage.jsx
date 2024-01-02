import React from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '../components/MainLayout';

const HomePage = () => {
    return (
        <MainLayout>
            <Helmet>
                <title>NodeShop | Home</title>
            </Helmet>
            <h2>Welcome to Your App</h2>
            {/* Add your home page content here */}
        </MainLayout>
    );
};

export default HomePage;
