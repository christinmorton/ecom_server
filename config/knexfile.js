const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config.env' });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    migrations: {
      directory: '../db/migrations',
    },
  },
};
