let express = require('express');
let graphqlHTTP = require('express-graphql');
let { buildSchema } = require('graphql');

let users = [  // Dummy data
  {
    id: 1,
    name: 'Brian',
    age: '21',
    gender: 'M'
  },
  {
    id:2,
    name: 'Kim',
    age: '22',
    gender: 'M'
  },
  {
    id:3,
    name: 'Joseph',
    age: '23',
    gender: 'M'
  },
  {
    id:3,
    name: 'Faith',
    age: '23',
    gender: 'F'
  },
  {
    id:5,
    name: 'Joy',
    age: '25',
    gender: 'F'
  }
];

// Initialize a GraphQL schema
let schema = buildSchema(`
  type Query {
    user(id: Int!): Person
    users(gender: String): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    gender: String
  },
  type Mutation {
    updateUser(id: Int!, name: String!, age: String): Person
  }
`);

// return a single user based on id
let getUser = function(args) {
  let userID = args.id;
  return users.filter(user => {
    return user.id == userID;
  })[0];
}

// Return a list of users. Takes an optional gender parameter
let retrieveUser = function(args) {
  if (args.gender) {
    let gender = args.gender;
    return users.filter(user => user.gender === gender);
  } else {
    return users;
  }
}

// Update a user and return new user details
let updateUser = function({id, name, age}) {
  users.map(user => {
    if (user.id === id) {
      user.name = name;
      user.age = age;
      return user;
    }
  });
  return users.filter(user => user.id === id)[0];
}

// Root resolver
let root = { 
  user: getUser,
  users: retrieveUsers,
  updateUser: updateUser
};

// Create an express server and a GraphQL endpoint
let app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));