const fs = require('fs');
const faker = require('faker');

let users = [];
let idArray = [];
let tempD;

// Create users data
for (i = 0; i < 25; i++) {
  let tempA = faker.name.findName();
  let tempB = faker.internet.email();
  let tempC = 'password;';
  idArray[i] = faker.random.uuid();

  if (i > 22) {
    tempD = {
      _id: idArray[i],
      name: tempA,
      email: tempB,
      password: tempC,
      role: 'publisher',
    };
  } else {
    tempD = {
      _id: idArray[i],
      name: tempA,
      email: tempB,
      password: tempC,
      role: 'user',
    };
  }

  users[i] = tempD;
}
tempD = [];
idArray = [];
let data = JSON.stringify(users);
fs.writeFileSync('_data/users.json', data);

// Create product data
let products = [];

for (i = 0; i < 25; i++) {
  let tempA = faker.commerce.productName();
  let tempB = faker.commerce.price();
  idArray[i] = faker.random.uuid();
  let tempC;

  if (i % 2 == 0) {
    if (i < 5) {
      tempC = idArray[4];
    }
    if (i > 5 && i < 10) {
      tempC = idArray[8];
    }
    if (i > 10 && i < 15) {
      tempC = idArray[18];
    }
    if (i > 15 && i < 20) {
      tempC = idArray[24];
    }
  } else {
    if (i < 5) {
      tempC = idArray[1];
    }
    if (i > 5 && i < 10) {
      tempC = idArray[7];
    }
    if (i > 10 && i < 15) {
      tempC = idArray[13];
    }
    if (i > 15 && i < 20) {
      tempC = idArray[21];
    }
  }

  tempD = {
    _id: idArray[i],
    title: tempA,
    price: tempB,
    user: tempC,
  };

  products[i] = tempD;
}
tempD = [];
data = JSON.stringify(products);
fs.writeFileSync('_data/products.json', data);

// Create post data
let posts = [];

for (i = 0; i < 25; i++) {
  let tempA = faker.lorem.sentence();
  let tempB = faker.lorem.paragraphs();
  let tempC = faker.lorem.paragraph();

  let tempE;

  if (i % 2 == 0) {
    if (i < 5) {
      tempE = idArray[4];
    }
    if (i > 5 && i < 10) {
      tempE = idArray[8];
    }
    if (i > 10 && i < 15) {
      tempE = idArray[18];
    }
    if (i > 15 && i < 20) {
      tempE = idArray[24];
    }
  } else {
    if (i < 5) {
      tempE = idArray[1];
    }
    if (i > 5 && i < 10) {
      tempE = idArray[7];
    }
    if (i > 10 && i < 15) {
      tempE = idArray[13];
    }
    if (i > 15 && i < 20) {
      tempE = idArray[21];
    }
  }

  tempD = {
    title: tempA,
    body: tempB,
    summary: tempC,
    user: tempE,
  };

  posts[i] = tempD;
}
tempD = [];
data = JSON.stringify(posts);
fs.writeFileSync('_data/posts.json', data);

// Create comment data
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

// Create review data
let reviews = [];

for (i = 0; i < 25; i++) {
  let tempA = faker.lorem.sentence();
  let tempB = faker.lorem.paragraph();
  let tempC;
  let tempE;

  if (i % 2 == 0) {
    tempC = 8;
  } else {
    tempC = 3;
  }

  if (i == 10 || i == 20) {
    tempC = 10;
  }

  if (i == 22 || i == 24) {
    tempC = 5;
  }

  if (i % 2 == 0) {
    if (i < 5) {
      tempE = idArray[4];
    }
    if (i > 5 && i < 10) {
      tempE = idArray[8];
    }
    if (i > 10 && i < 15) {
      tempE = idArray[18];
    }
    if (i > 15 && i < 20) {
      tempE = idArray[24];
    }
  } else {
    if (i < 5) {
      tempE = idArray[1];
    }
    if (i > 5 && i < 10) {
      tempE = idArray[7];
    }
    if (i > 10 && i < 15) {
      tempE = idArray[13];
    }
    if (i > 15 && i < 20) {
      tempE = idArray[21];
    }
  }

  tempD = {
    title: tempA,
    text: tempB,
    rating: tempC,
    // product: ,
    user: tempE,
  };

  reviews[i] = tempD;
}

data = JSON.stringify(reviews);
fs.writeFileSync('_data/reviews.json', data);
