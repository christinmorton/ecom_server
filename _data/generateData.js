const fs = require('fs');
const faker = require('faker');

let users = [];
let tempD;

for (i = 0; i < 25; i++) {
  let tempA = faker.name.findName();
  let tempB = faker.internet.email();
  let tempC = 'password;';

  if (i > 22) {
    tempD = {
      name: tempA,
      email: tempB,
      password: tempC,
      role: 'publisher',
    };
  } else {
    tempD = {
      name: tempA,
      email: tempB,
      password: tempC,
      role: 'user',
    };
  }

  users[i] = tempD;
}
tempD = [];
let data = JSON.stringify(users);
fs.writeFileSync('_data/users.json', data);

let products = [];

for (i = 0; i < 25; i++) {
  let tempA = faker.commerce.productName();
  let tempB = faker.commerce.price();

  tempD = {
    title: tempA,
    price: tempB,
  };

  products[i] = tempD;
}
tempD = [];
data = JSON.stringify(products);
fs.writeFileSync('_data/products.json', data);

let posts = [];

for (i = 0; i < 25; i++) {
  let tempA = faker.lorem.sentence();
  let tempB = faker.lorem.paragraphs();
  let tempC = faker.lorem.paragraph();

  tempD = {
    title: tempA,
    body: tempB,
    summary: tempC,
  };

  posts[i] = tempD;
}
tempD = [];
data = JSON.stringify(posts);
fs.writeFileSync('_data/posts.json', data);

let comments = [];

for (i = 0; i < 25; i++) {
  let tempA = faker.lorem.paragraph();

  tempD = {
    message: tempA,
  };

  comments[i] = tempD;
}

data = JSON.stringify(comments);
fs.writeFileSync('_data/comments.json', data);
