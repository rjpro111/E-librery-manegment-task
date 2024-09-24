const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
  const { title, author, genre } = req.body;
  try {
    const newBook = new Book({ title, author, genre });
    await newBook.save();
    res.status(201).json({ message: 'Book added', book: newBook });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a book
// Update a book
exports.updateBook = async (req, res) => {
  console.log(req.body);

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated', book });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Server error', error: err.message }); // Include the error message
  }
};


// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.userId;
  

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.availability) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Update the book's availability and borrowedBy fields
    book.availability = false;
    book.borrowedBy = userId;

    await book.save();
    res.status(200).json({ message: 'Book borrowed successfully', book });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.userId; // Assuming you're storing user info in req.user

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.borrowedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not allowed to return this book' });
    }

    // Update the book's availability and borrowedBy fields
    book.availability = true;
    book.borrowedBy = null;

    await book.save();
    res.status(200).json({ message: 'Book returned successfully', book });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
