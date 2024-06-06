const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//TASK 7 - Login
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({ data: {username: username, password: password}}, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// TASK 8 - Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  /*const bookISBN = req.params.isbn;
  const userReview = req.query.review;
  const currentUser = req.body.username;
  let bookReviews = books[bookISBN].reviews;

  let reviewExists = false;
  for (const username in bookReviews) {
    if (username === currentUser) {
      bookReviews[currentUser] = userReview;
      reviewExists = true;
      break;
    }
  }
  if (!reviewExists) {
    bookReviews[currentUser] = userReview;
  }
  
  res.send("review added successfully.");
  //return res.status(300).json({message: "Yet to be implemented"}); */
  let book = books[req.params.isbn];
  let username = req.user.data.username;
  if(!book)
        return res.status(300).json({message: "ISBN invalid"});

   if(!req.query.review)
        return res.status(300).json({message: "Review not provided"});

    book.reviews[username] = req.query.review; 
   
   res.send("The review on book " + (' ')+ (req.params.isbn) + " has been added!")   
});

//TASK 9 - Delete review

regd_users.delete("/auth/review/:isbn", (req, res) => {   
    let book = books[req.params.isbn];
    let username = req.user.data.username;
    if(!book)
        return res.status(300).json({message: "ISBN invalid"});
    
    delete book.reviews[username]; 

    return res.status(200).json({message: "Delete successful"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
