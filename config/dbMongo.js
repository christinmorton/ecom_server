const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  const connek = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `Mongodb Connected: ${connek.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
