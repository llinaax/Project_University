const sql = require('mssql');

// Конфигурация подключения к базе данных SQL Server
const config = {
  user: 'alina',          // Имя пользователя
  password: '',           // Пароль (оставьте пустым, если его нет)
  server: 'ALINA_LAPTOP', // Имя сервера
  port: 5500,             // Порт сервера
  database: 'SkyCourier', // Имя базы данных
  options: {
    encrypt: true,        // Используйте шифрование, если требуется
    trustServerCertificate: true // Используйте это, если у вас самоподписанный сертификат
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