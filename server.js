const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const pool = new Pool({
    user: 'postgres',  // Replace with your PostgreSQL username
    host: 'db',  // Replace with the hostname of your PostgreSQL server (if running on a different machine, use the IP or hostname)
    database: 'chatdb',  // Replace with the name of the database you created
    password: 'admin',  // Replace with your PostgreSQL password
    port: 5432,  // Replace with the port number of your PostgreSQL server
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/messages', async (req, res) => {
    console.log('before pool connection')
    const client = await pool.connect();
    console.log('after pool connection')
    const result = await client.query('SELECT * FROM messages ORDER BY id DESC LIMIT 100');
    console.log('after pool in result', result);
    const results = { 'results': (result) ? result.rows : null };
    res.send(results);
    client.release();
});

app.post('/messages', async (req, res) => {
    const client = await pool.connect();
    const { username, message } = req.body;
    const result = await client.query('INSERT INTO messages (username, message) VALUES ($1, $2)', [username, message]);
    res.send(result);
    client.release();
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
