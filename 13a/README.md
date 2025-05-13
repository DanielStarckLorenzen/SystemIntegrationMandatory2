# GraphQL Example Server

This is a simple GraphQL server example using Apollo Server with Express.

## Features

- GraphQL API with Apollo Server
- Express for handling HTTP requests
- In-memory data store for books and authors
- Query, Mutation, and resolver implementation

## Schema

The GraphQL schema includes the following types:
- Book
- Author
- ErrorMessage
- SuccessMessage

Along with Query, Mutation, and Subscription definitions.

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

To start the server in development mode with nodemon:

```bash
npm run dev
```

To start the server in production mode:

```bash
npm start
```

The server will be available at http://localhost:4004/graphql

## Example Queries

### Fetch all books
```graphql
query {
  books {
    id
    title
    releaseYear
    author {
      name
    }
  }
}
```

### Fetch a specific book
```graphql
query {
  book(id: "1") {
    title
    releaseYear
    author {
      name
    }
  }
}
```

### Create a new book
```graphql
mutation {
  createBook(
    authorId: "1"
    title: "This Side of Paradise"
    releaseYear: 1920
  ) {
    id
    title
    releaseYear
  }
}
``` 