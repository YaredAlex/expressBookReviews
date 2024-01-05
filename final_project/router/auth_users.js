const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    userName: "Yared",
    password: "123",
  },
  {
    userName: "123",
    password: "123",
  },
];

const isValid = (username) => {
  const user = users.filter(
    (user) => user.userName.toLowerCase() === username.toLowerCase()
  );
  if (user.length > 0) return true;

  return false;
};

const authenticatedUser = (username, password) => {
  const userlist = users.filter(
    (user) =>
      user.userName.toLowerCase() === username.toLowerCase() &&
      user.password === password
  );
  if (userlist.length > 0) return true;

  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { userName, password } = req.body;
  if (userName && password && authenticatedUser(userName, password)) {
    const token = jwt.sign({ userName }, "secret", { expiresIn: 60 * 60 });
    req.session.auth = { token };
    req.session.user = userName;
    return res.json({ message: "Loged in successfuly!" });
  }
  return res.json({ message: "incorrect username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  if (books[isbn] && review) {
    books[isbn]["reviews"][req.session.user] = review;
    return res.json(books[isbn]["reviews"]);
  }
  //Write your code here
  return res.send("please provide Review for correct ISBN");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (books[isbn]) {
    if (books[isbn]["reviews"][req.session.user]) {
      delete books[isbn]["reviews"][req.session.user];
      return res.json({
        message: "review deleted",
        review: books[isbn]["reviews"],
      });
    } else
      return res.json({
        message: "No review found",
        review: books[isbn]["reviews"],
      });
  }
  return res.send(`No match found for ISBN ${isbn}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
