const express = require("express");
const mongoose = require("mongoose");

// Start Express and Routing
const app = express();
const bookRouter = express.Router();
const port = process.env.PORT || 3000;

// Connecting to the Data Base and Structuring the Schema

const db = mongoose.connect("mongodb://localhost/bookAPI");
const Book = require("./models/bookModel");

// Getting the Data from the Data base with an Example for filtering based on genre
bookRouter.route("/books").get((req, res) => {
  const query = {};
  if (req.query.genre) {
    query.genre = req.query.genre;
  }
  Book.find(query, (err, books) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(books);
    }
  });
});

//Getting a single Item of the Data Base
bookRouter.route("/books/:bookId").get((req, res) => {
  Book.findById(req.params.bookId, (err, books) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(books);
    }
  });
});

app.use("/api", bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.listen(port, () => {
  console.log(`Running on Port ${port}`);
});
