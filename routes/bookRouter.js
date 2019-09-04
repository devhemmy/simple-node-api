const express = require("express");
const booksController = require("../controllers/booksController");
function routes(Book) {
  //initilizng the Router instance
  const bookRouter = express.Router();
  const controller = booksController(Book);
  bookRouter
    .route("/books") // Posting a new book into the Book Objectg
    .post(controller.post) // Getting the Data from the Data base with an Example for filtering based on genre
    .get(controller.get);

  /* A Middleware in the middle of the request to make some functions and even changes to the request it self before it gets to the server so we can do whatever and modifiy it as we want*/

  bookRouter.use("/books/:bookId", (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  bookRouter
    .route("/books/:bookId") //Getting a single Item of the Data Base
    .get((req, res) => {
      res.json(req.book);
    }) // Updating a specific book as a whole
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      req.book.save(err => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    }) // Making changes for just a specific field in the book it self as a whole
    .patch((req, res) => {
      const { book } = req;

      if (req.body._id) {
        delete req.body.body._id;
      }
      Object.entries(req.body).forEach(item => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      req.book.save(err => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    }) // Deleting a Book from the Data base
    .delete((req, res) => {
      req.book.remove(err => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
