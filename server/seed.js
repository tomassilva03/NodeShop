
const { Pool } = require("pg");
const fs = require('fs');

const pool = new Pool({
    user: "node",
    host: "localhost",
    password: "node",
    port: 5432,
    database: "NodeShop"
});

// Read the SQL script file
const sqlScript = fs.readFileSync('NodeShopSchema.sql', 'utf8');

// Execute the SQL script
pool.query(sqlScript)
  .then((response) => {
    console.log("Database seeded successfully! Check pgAdmin for the new data.");
  })
  .catch((err) => {
    console.log("Error seeding the database!");
    console.error(err.message); // Log the error message
    if (err.position) {
      console.error(`Error position: ${err.position}`);
      // Optionally, extract the line containing the error
      const lines = sqlScript.split('\n');
      const errorLine = lines[err.position.row - 1];
      console.error(`Error line: ${errorLine}`);
    }
  })
  .finally(() => {
    // Close the database connection
    pool.end();
  });

module.exports = pool;
