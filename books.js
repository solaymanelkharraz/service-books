const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. Connect to MongoDB Atlas (Use your working URI!)
const uri = process.env.MONGO_URI;
// Notice: No deprecated options here either!
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB !!!"))
    .catch(err => console.log("Database connection error: ", err));

// 2. Load the Model
require("./Book");
const Book = mongoose.model("Book");

// --- ROUTES ---

// Route 1: Home
app.get("/", (req, res) => {
    res.send("Welcome to books service !!!"); // [cite: 905]
});

// Route 2: Add a book
app.post("/book", (req, res) => {
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    };
    
    const book = new Book(newBook);
    book.save()
        .then(() => res.json({ message: "A new book added !!!" }))
        .catch(err => res.status(500).json(err));
});

// Route 3: List all books
app.get("/books", (req, res) => {
    Book.find()
        .then(books => res.json({ books: books }))
        .catch(err => res.status(500).json(err));
});

// Route 4: Get Book by ID
app.get("/books/:id", (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if (book) res.json({ book: book });
            else res.status(404).json({ message: "Book not found" });
        })
        .catch(err => res.status(500).json(err));
});

// Route 5: Delete a book
app.delete("/books/:id", (req, res) => {
    Book.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Book deleted successfully" }))
        .catch(err => res.status(500).json(err));
});

// 3. Start the server on port 4545
app.listen(4545, () => {
    console.log("Up and running! This is our books service"); // [cite: 932]
});
module.exports = app;