// import express, path, db, and routes
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// import apollo server, express middleware, and authMiddleWare
const { ApolloServer } = require('@apollo/server');
const { expressMiddleWare } = require('@apollo/server/express4');
const { authMiddleWare} = require('./utils/auth');

//import type defs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an apollo server with the graphQL schema
const startApolloServer = async () => {
  await server.start();


  app.use('/graphql', expressMiddleWare(server, {
    context: authMiddleWare
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.MODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      
    app.use(routes);

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 Now listening at http://localhost:${PORT}`);
        console.log(`Check out graphQL at: http://localhost:${PORT}/graphql`)
      }); 
    });

    });
  }
};

// Call the async function to start the server
startApolloServer();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }



