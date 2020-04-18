const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./app/middleware/error');

// load env vars
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// const client = redis.createClient(REDIS_PORT);

const app = express();

// Import routes
const store = require('./app/routes/api/store');

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'public')));
}

// app.get('/', (req, res) => {
//   res.render('index');
// });

app.use('/api/v1/store', store);

// catch route clean up
app.get('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'The routes your are looking for do not exist...',
    data: { id: 1 },
  });
});

// Use custom error handler
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Globally handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
