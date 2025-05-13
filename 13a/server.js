const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const { readFileSync } = require('fs');
const { join } = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Reading the schema file
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

// In-memory database
const books = [
  { id: '1', title: 'The Great Gatsby', releaseYear: 1925, authorId: '1' },
  { id: '2', title: 'To Kill a Mockingbird', releaseYear: 1960, authorId: '2' },
  { id: '3', title: 'Go Set a Watchman', releaseYear: 2015, authorId: '2' },
];

const authors = [
  { id: '1', name: 'F. Scott Fitzgerald' },
  { id: '2', name: 'Harper Lee' },
];

// Resolvers
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(book => book.id === id),
    authors: () => authors,
    author: (_, { id }) => authors.find(author => author.id === id),
  },
  Mutation: {
    createBook: (_, { authorId, title, releaseYear }) => {
      const newBook = {
        id: String(books.length + 1),
        authorId,
        title,
        releaseYear,
      };
      books.push(newBook);
      return newBook;
    },
    updateBook: (_, { id, authorId, title, releaseYear }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return null;
      
      if (authorId) books[bookIndex].authorId = authorId;
      if (title) books[bookIndex].title = title;
      if (releaseYear !== undefined) books[bookIndex].releaseYear = releaseYear;
      
      return books[bookIndex];
    },
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return { message: 'Book not found' };
      
      books.splice(bookIndex, 1);
      return { message: 'Book deleted successfully' };
    },
  },
  Book: {
    author: (parent) => authors.find(author => author.id === parent.authorId),
  },
  Author: {
    books: (parent) => books.filter(book => book.authorId === parent.id),
  },
};

async function startApolloServer() {
  // Express app and HTTP server setup
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );

  // Return http server and app for easier testing or other uses
  return { server, app, httpServer };
}

// Start the server
startApolloServer()
  .then(({ httpServer }) => {
    const PORT = 4004;
    httpServer.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.error('Error starting server:', err);
  }); 