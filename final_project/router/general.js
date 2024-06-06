const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //  return res.status(300).json({message: "Yet to be implemented"});
});




// TASK 1 - Get the book list available in the shop - without promise
// public_users.get('/',function (req, res) {
//  
//    res.send(JSON.stringify(books,null,4));
// });





// TASK 2 - Get book details based on ISBN - without promise
//  public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;
//     res.send(books[isbn])
//  });
  
// TASK 3 - Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const books_obj =  Object.values(books);
//   const filteredBook = books_obj.filter((book) => book.author === author);
//   if (filteredBook.length > 0) {
//   res.status(200).json(filteredBook);
//   } else {
//     return res.status(404).json({message: "Author not found"});
//   }
// });

// TASK 4 - Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const books_obj =  Object.values(books);
//   const filteredBook = books_obj.filter((book) => book.title === title);
//   if (filteredBook.length > 0) {
//     res.status(200).json(filteredBook);
// } else {
//     return res.status(404).json({message: "title not found"});
// }
// });

//  TASK 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    res.send(book.reviews)
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// TASK 10 - Get the book list available in the shop - with promise
public_users.get('/',function (req, res) {
    //start - with promise
    getBooks().then((booksList)=>res.send(JSON.stringify(booksList,null,4)),
                    (err) => res.send("error"));

});

function getBooks(){
    return new Promise((resolve,reject)=>{resolve(books);
    })
}

// TASK 11 - Get book details based on ISBN - with promise
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBooks().then((booksList)=>res.send(booksList[isbn]),
                  (err) => res.send("error"));
  });


// TASK 12 - Get book details based on author - with promise
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooks().then((booksList)=>{
            const books_obj =  Object.values(booksList);
            const filteredBook = books_obj.filter((book) => book.author === author);
            if (filteredBook.length > 0) {
            res.status(200).json(filteredBook);
            } else {
                return res.status(404).json({message: "Author not found"});
            }
            },
    (err) => res.send("error"));
});



// TASK 13 - Get all books based on title - with promise
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooks().then((booksList)=>{
    const books_obj =  Object.values(booksList);
    const filteredBook = books_obj.filter((book) => book.title === title);
    if (filteredBook.length > 0) {
        res.status(200).json(filteredBook);
    } else {
        return res.status(404).json({message: "title not found"});
    }},
    (err) => res.send("error"));
});

module.exports.general = public_users;
