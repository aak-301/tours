const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many reuqest from this IP, please try again in an hour',
});

app.use('/api', limitter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});
// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// UNHANDLED ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
