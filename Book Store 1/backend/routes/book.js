// routes/book.js

const express = require('express');
const router = express.Router();
const booksController = require('../controllers/bookController');
console.log('booksController imported');


router.get('/getAll', booksController.getAllBooks);





router.get('/:id', booksController.getBookById);
router.post('/createBook', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);
router.get('/', booksController.searchBooks)

module.exports = router;
