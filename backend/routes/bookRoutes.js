const express = require('express');
const { createBook, getBooks, updateBook, deleteBook,borrowBook,returnBook } = require('../controllers/bookController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware, createBook);
router.get('/', getBooks);
router.put('/:id',authMiddleware, updateBook);
router.delete('/:id',authMiddleware, deleteBook);

router.post('/:id/borrow', authMiddleware, borrowBook);

// Return Book
router.post('/:id/return', authMiddleware, returnBook);
module.exports = router;
