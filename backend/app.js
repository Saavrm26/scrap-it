const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimiter = require('./middlewares/rateLimiter');

// middleware Configurations

const app = express();

app.use(helmet);

app.use('/api', rateLimiter);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cookieParser());

app.use(compression());

app.use(express.json({ limit: '50kb' }));

app.use(helmet.xssFilter());

app.use(mongoSanitize());

app.all('*', (req, res, next) => {
  next(new AppError('Url requested was not found', 404));
});

// Middleware but it is in controllers
app.use(globalErrorHandler);

module.exports = app;
