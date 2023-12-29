const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

app.post('/adduser', (req, res) => {
  console.log(req.body);
  res.send('Response from the server!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port} at http://localhost:${port}`);
  });
