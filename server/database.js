const { Pool } = require("pg");
const fs = require('fs');

const pool = new Pool({
    user: "node",
    host: "localhost",
    password: "node",
    port: 5432,
    database: "NodeShop"
});

module.exports = pool;
