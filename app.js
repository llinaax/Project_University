const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('mssql');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Конфигурация подключения к базе данных SQL Server
const config = {
  user: 'alina',          // Имя пользователя
  password: '12457800alina',           // Пароль
  server: 'localhost',    // Имя сервера или IP-адрес
  port: 1433,             // Порт сервера
  database: 'SkyCourier', // Имя базы данных
  options: {
    encrypt: true,        // Используйте шифрование
    trustServerCertificate: true // Доверие самоподписанному сертификату
  }
};

// Подключение к базе данных
sql.connect(config, err => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключено к базе данных SQL Server.');
});

// Обслуживание статических файлов из директории "public"
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для получения всех пользователей (GET-запрос)
app.get('/api/users', (req, res) => {
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
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Полученные данные:', req.body);

  const request = new sql.Request();
  request.input('name', sql.VarChar, name);
  request.input('email', sql.VarChar, email);
  request.input('password', sql.VarChar, password);

  request.query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)', (err, result) => {
    if (err) {
      console.error('Ошибка при создании нового пользователя:', err);
      res.status(500).send(`Ошибка при создании нового пользователя: ${err.message}`);
    } else {
      res.status(201).send('Пользователь успешно создан.');
    }
  });
});

// Маршрут для аутентификации пользователя (POST-запрос)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const request = new sql.Request();
  request.input('email', sql.VarChar, email);
  request.input('password', sql.VarChar, password);

  request.query('SELECT * FROM Users WHERE email = @email AND password = @password', (err, result) => {
    if (err) {
      console.error('Ошибка при аутентификации пользователя:', err);
      res.status(500).json({ message: 'Ошибка при аутентификации пользователя.' });
    } else {
      if (result.recordset.length > 0) {
        res.status(200).json({ message: 'Аутентификация прошла успешно.' });
      } else {
        res.status(401).json({ message: 'Неверный email или пароль.' });
      }
    }
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});

