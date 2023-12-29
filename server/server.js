const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
// Use other route files as needed

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port} at http://localhost:${port}`);
  });
