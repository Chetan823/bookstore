const { Op } = require('sequelize');

const db = require('../models');


// Import model definitions
const Joi = require('joi');


/**
 * @swagger
 * /books/createBook:
 *  post:
 *      summary: Create a new book
 *      tags: [Book]
 *      description: Create a new book with the provided details
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                author:
 *                  type: string
 *                genre:
 *                  type: string
 *                publication_date:
 *                  type: string
 *                  format: date
 *                price:
 *                  type: number
 *      responses:
 *          201:
 *              description: New book created successfully
 *          400:
 *              description: Bad request. Invalid input data
 *          500:
 *              description: Internal server error
 */
const createBook = async (req, res) => {
  
  try {
    // Define a Joi schema for book validation
    const schema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      genre: Joi.string().optional(),
      publication_date: Joi.date().optional(),
      price: Joi.number().required().positive(),
    });

    // Validate incoming request body against the schema
    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    // Access validated data from req.body
    const { title, author, genre, publication_date, price } = req.body;

    // Create a new book instance using the model
    const newBook = await db.models.Book.create({
      title,
      author,
      genre,
      publication_date,
      price,
    });

    res.status(201).json(newBook);

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};





// Controller function for searching books with optional case-sensitive search

/**
 * @swagger
 * /books:
 *  get:
 *      summary: Search books
 *      tags: [Book]
 *      description: Search books based on title, author, or genre
 *      parameters:
 *        - in: query
 *          name: title
 *          description: Title of the book to search for
 *          schema:
 *            type: string
 *        - in: query
 *          name: author
 *          description: Author of the book to search for
 *          schema:
 *            type: string
 *        - in: query
 *          name: genre
 *          description: Genre of the book to search for
 *          schema:
 *            type: string
 *        - in: query
 *          name: caseSensitive
 *          description: Flag to specify whether the search should be case-sensitive or not
 *          schema:
 *            type: boolean
 *      responses:
 *          200:
 *              description: A list of books matching the search criteria
 *          500:
 *              description: Internal server error
 */

const searchBooks = async (req, res) => {
  try {
    const { title, author, genre, caseSensitive = false } = req.query;

    // Basic validation for search criteria (optional)
    if (!title && !author && !genre) {
      return res.status(400).json({ message: 'Please provide at least one search criterion' });
    }

    const searchCriteria = {};

    // Build search criteria with validation (example)
    if (title) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Invalid title search parameter (must be a string)' });
      }
      searchCriteria.title = {
        [Op.like]: `%${title.trim()}%`
      };
    }

    if (author) {
      if (typeof author !== 'string' || author.trim() === '') {
        return res.status(400).json({ message: 'Invalid author search parameter (must be a string)' });
      }
      searchCriteria.author = {
        [Op.like]: `%${author.trim()}%`
      };
    }

    if (genre) {
      if (typeof genre !== 'string' || genre.trim() === '') {
        return res.status(400).json({ message: 'Invalid genre search parameter (must be a string)' });
      }
      searchCriteria.genre = {
        [Op.like]: `%${genre.trim()}%`
      };
    }

    const searchOptions = {
      where: searchCriteria
    };
    
    console.log('Search Options:', searchOptions)
    const searchedBooks = await db.models.Book.findAll(searchOptions);

    if (searchedBooks.length === 0) {
      return res.status(404).json({ message: 'No books found matching your criteria' });
    }

    const formattedBooks = searchedBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      publicationDate: book.publication_date, // Assuming publication_date exists
      price: book.price,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    })); // Customize response data as needed

    res.json({ message: 'Books found successfully!', books: formattedBooks });
  } catch (error) {
    console.error('Error searching for books:', error);
    res.status(500).json({ message: 'Error searching for books' });
  }
};

module.exports = {
  searchBooks
};




/**
 * @swagger
 * /books/getAll:
 *  get:
 *      summary: Retrieve all books
 *      tags: [Book]
 *      description: Retrieve a list of all books from the database
 *      responses:
 *          200:
 *              description: A list of books retrieved successfully
 *          500:
 *              description: An error occurred while fetching all books
 */

const getAllBooks = async (req, res) => {
    console.log('Inside getAllBooks function');
    try {
        const books = await db.models.Book.findAll();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching all books');
    }
    };


/**
 * @swagger
 * /books/{id}:
 *  get:
 *      summary: Retrieve a book by ID
 *      tags: [Book]
 *      description: Retrieve a book from the database by its ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the book to retrieve
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Book retrieved successfully
 *          404:
 *              description: Book not found
 *          500:
 *              description: An error occurred while fetching the book
 */

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await db.models.Book.findByPk(id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching book');
  }
};



/**
 * @swagger
 * /books/{id}:
 *  put:
 *      summary: Update a book by ID
 *      tags: [Book]
 *      description: Update a book in the database by its ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the book to update
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                author:
 *                  type: string
 *                genre:
 *                  type: string
 *                publication_date:
 *                  type: string
 *                  format: date
 *                price:
 *                  type: number
 *              example:
 *                title: New Title
 *                author: New Author
 *                genre: New Genre
 *                publication_date: 2024-04-15
 *                price: 19.99
 *      responses:
 *          200:
 *              description: Book updated successfully
 *          404:
 *              description: Book not found
 *          500:
 *              description: An error occurred while updating the book
 */
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCount = await db.models.Book.update(req.body, {
      where: { id },
    });

    // Check if any rows were updated
    if (updatedCount[0] === 0) {
      return res.status(404).send('Book not found');
    }

    // Fetch the updated book
    const updatedBook = await db.models.Book.findByPk(id);

    res.json(updatedBook); // Send the updated book as response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating book');
  }
};






/**
 * @swagger
 * /books/{id}:
 *  delete:
 *      summary: Delete a book by ID
 *      tags: [Book]
 *      description: Delete a book from the database by its ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the book to delete
 *          schema:
 *            type: integer
 *      responses:
 *          204:
 *              description: Book deleted successfully
 *          404:
 *              description: Book not found
 *          500:
 *              description: An error occurred while deleting the book
 */

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await db.models.Book.destroy({
      where: { id },
    
    });

    if (!deletedCount) {
      return res.status(404).send('Book not found');
    }

    res.status(204).send("Successfully Deleted!!"); // No content to return on successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting book');
  }
};



module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks
};
