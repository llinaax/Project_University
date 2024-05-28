const sql = require('mssql');

// Конфигурация подключения к базе данных SQL Server
const config = {
  user: 'alina',          // Имя пользователя
  password: '12457800alina',           // Пароль (оставьте пустым, если его нет)
  server: 'localhost', // Имя сервера
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

module.exports = sql;