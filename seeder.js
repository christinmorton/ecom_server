const fs = require('fs');
const mongoose = require('mongoose');
const faker = require('faker');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load Models
const Post = require('./app/models/Posts');
const Product = require('./app/models/Product');
const Comment = require('./app/models/Comment');
const User = require('./app/models/User');
const Review = require('./app/models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read the JSON files
const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/posts.json`, 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
);

const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/comments.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import into db
const importData = async () => {
  try {
    await Post.create(posts);
    await Comment.create(comments);
    await User.create(users);
    await Product.create(products);
    await Review.create(reviews);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete Data
const deletetData = async () => {
  try {
    await Post.deleteMany();
    await Comment.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deletetData();
}
