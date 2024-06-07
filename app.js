const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('mssql');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const config = {
  user: 'alina',
  password: '12457800alina',
  server: 'localhost',
  port: 1433,
  database: 'SkyCourier',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

sql.connect(config, err => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключено к базе данных SQL Server.');
});

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: '554834202170-e2g1o92aovsfkaulisajuko2hd6g58fm.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5500/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    // Здесь вы можете сохранить или найти пользователя в вашей базе данных
    return done(null, profile);
}));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const request = new sql.Request();
  request.input('email', sql.VarChar, email);
  request.input('password', sql.VarChar, password);

  request.query('SELECT * FROM Users WHERE email = @email AND password = @password', (err, result) => {
    if (err) {
      console.error('Ошибка при аутентификации пользователя:', err);
      res.status(500).json({ success: false, message: 'Ошибка при аутентификации пользователя.' });
    } else {
      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        res.status(200).json({ success: true, username: user.name });
      } else {
        res.status(401).json({ success: false, message: 'Неверный email или пароль.' });
      }
    }
  });
});

app.get('/api/cafe/:id', (req, res) => {
  const cafeId = req.params.id;
  const query = `SELECT * FROM cafes WHERE id = ${cafeId}`;

  sql.query(query, (err, result) => {
    if (err) {
      console.error('Ошибка при получении данных о кафе из базы данных:', err);
      res.status(500).send('Ошибка при получении данных о кафе из базы данных.');
    } else {
      if (result.recordset.length > 0) {
        const cafe = result.recordset[0];
        res.json(cafe);
      } else {
        res.status(404).send('Кафе не найдено');
      }
    }
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
