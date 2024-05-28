// app.js
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./db'); // Импортируем модуль подключения к базе данных
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Пример маршрута для получения всех пользователей
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

// Пример маршрута для создания нового пользователя
// Пример маршрута для создания нового пользователя
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const request = new sql.Request();
    request.input('name', sql.VarChar, name);
    request.input('email', sql.VarChar, email);
    request.query('INSERT INTO Users (name, email) VALUES (@name, @email)', (err, result) => {
      if (err) {
        res.status(500).send('Error creating new user.');
      } else {
        res.status(201).send('User created successfully.');
      }
    });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  