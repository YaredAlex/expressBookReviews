const express = require("express");
let books = require("./booksdb.js");
const { default: axios } = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { userName, password } = req.body;
  if (userName && password) {
    if (!isValid(userName)) {
      users.push({ userName, password });
      return res.json({ message: "User register successfuly!" });
    } else return res.json({ message: "User already registered!" });
  }
  return res.status(300).json({ message: "invalid userName or password" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (isbn) {
    if (books[isbn]) return res.status(200).json(books[isbn]);
    else res.send("ISBN doesn't match");
  }
  return res.status(200).send("No isbn Provided!");
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const booklist = Object.values(books);
  if (author) {
    const result = booklist.filter(
      (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
    );
    if (result.length > 0) return res.status(200).json({ ...result });

    return res.status(200).send(`No book found for author ${author}`);
  }
  return res.status(200).send("No author provided!");
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  if (title) {
    const booklist = Object.values(books);
    const result = booklist.filter(
      (book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
    );
    if (result.length > 0) return res.status(200).json({ ...result });

    return res.status(200).send(`No book found for ${title} book`);
  }
  return res.status(200).send("No title provided");
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (isbn) {
    if (books[isbn]) return res.status(200).json(books[isbn]["reviews"]);
    return res.status(200).send(`No review for ISBN ${isbn}`);
  }
  return res.send("ISBN is not provided");
});
//GETTING BOOKS WITH axisos
async function getAllBooks() {
  const books = await axios.get("/");
  return books.data;
}
async function getBookISBN(isbn) {
  const book = await axios.get(`/isbn/${isbn}`);
  return book.data;
}
async function getBookAuthor(author) {
  const books = await axios.get(`/author/${author}`);
  return books.data;
}
async function getBookTitle(title) {
  const books = await axios.get(`title/${title}`);
  return books.data;
}
module.exports.general = public_users;
