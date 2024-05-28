const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./db'); // Импортируем подключение к базе данных
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Обслуживание статических файлов из директории "public"
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для получения всех пользователей (GET-запрос)
app.get('/users', (req, res) => {
  const request = new sql.Request();
  request.query('SELECT * FROM Users', (err, result) => {
    if (err) {
      console.error('Ошибка при получении пользователей из базы данных:', err);
      res.status(500).send('Ошибка при получении пользователей из базы данных.');
    } else {
      res.json(result.recordset);
    }
  });
});

// Маршрут для создания нового пользователя (POST-запрос)
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Полученные данные:', req.body); // Логирование данных формы

  const request = new sql.Request();
  request.input('name', sql.VarChar, name);
  request.input('email', sql.VarChar, email);
  request.input('password', sql.VarChar, password);

  request.query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)', (err, result) => {
    if (err) {
      console.error('Ошибка при создании нового пользователя:', err); // Логирование ошибки
      res.status(500).send(`Ошибка при создании нового пользователя: ${err.message}`);
    } else {
      res.status(201).send('Пользователь успешно создан.');
    }
  });
});

const PORT = process.env.PORT || 3001; // Измените порт здесь
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
