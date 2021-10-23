import 'dotenv/config.js';
import express from 'express';
import {ApolloServer, gql} from "apollo-server-express";
import cors from 'cors';

const app = express();
app.use(cors());

let users = {
  1: {id: '1', username: 'Amit Bar'},
  2: {id: '2', username: 'David Guetta'},
}

const me = users[1];

const schema = gql`
    type Query {
      me: User
      user(id: ID!): User
      users: [User!]
    }
    
    type User {
      id: ID!
      username: String!
    }
`;

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),
  },
  User: {
    username: (parent) => parent.username
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  }
});

await server.start();

server.applyMiddleware({app, path: '/graphql'});

app.listen({port: 8000}, () => {
  console.log('Apollo server is on http://localhost:8000/graphql');
});

// const userCredentials = { firstname: 'Robin' };
// const userDetails = { nationality: 'German' };
//
// const user = {
//   ...userCredentials,
//   ...userDetails,
// };
//
// console.log(user);
//
// console.log(process.env.SOME_ENV_VARIABLE);
