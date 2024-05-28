const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./db'); // Import database connection
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all users
app.get('/users', (req, res) => {
  const request = new sql.Request();
  request.query('SELECT * FROM Users', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving users from database.');
    } else {
      res.json(result.recordset);
    }
  });
});

// Route to create a new user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const request = new sql.Request();
  request.input('name', sql.VarChar, name);
  request.input('email', sql.VarChar, email);
  request.input('password', sql.VarChar, password);
  request.query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)', (err, result) => {
    if (err) {
      res.status(500).send('Error creating new user.');
    } else {
      res.status(201).send('User created successfully.');
    }
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
