const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const connectDB = require('./config/dbMongo');
const errorHandler = require('./app/middleware/error');

// load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// const client = redis.createClient(REDIS_PORT);

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Import routes
const auth = require('./app/routes/api/auth');
const users = require('./app/routes/api/users');
const comments = require('./app/routes/api/comments');
const reviews = require('./app/routes/api/reviews');
const store = require('./app/routes/api/store');
const shoppingCart = require('./app/routes/api/shoppingCarts');
const posts = require('./app/routes/api/posts');
const products = require('./app/routes/api/products');

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// File upload middleware
app.use(fileupload());

// app.get('/', (req, res) => {
//   res.render('index');
// });

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/comments', comments);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/store', store);
app.use('/api/v1/shoppingcart', shoppingCart);
app.use('/api/v1/posts', posts);
app.use('/api/v1/products', products);

// catch route clean up
app.get('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'The routes your are looking for do not exist...',
    data: {},
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
