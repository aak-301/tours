const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// UNHANDLED ROUTE
app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `Can't find  ${req.originalUrl} on the server.`,
  });
  next();
});

module.exports = app;
