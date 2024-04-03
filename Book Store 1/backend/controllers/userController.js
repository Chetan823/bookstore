// controllers/userController.js
const db = require('../models'); 
// Assuming model definitions are in `models/index.js`
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const bcrypt = require('bcrypt');





/**
 * @swagger
 * /users/register:
 *  post:
 *      summary: Register a new user
 *      description: Register a new user with the provided details
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              required:
 *                - username
 *                - email
 *                - password
 *      responses:
 *          200:
 *              description: User registered successfully
 *          500:
 *              description: Internal server error
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate user input (e.g., check for existing email, password strength, etc.)

    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const user = await db.models.User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle specific errors (e.g., validation errors, unique constraint violations)
    // and provide more informative error messages to the user if possible.
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });  // Consider a more informative message
  }
};




/**
 * @swagger
 * /users/login:
 *  post:
 *      summary: Login user
 *      description: Authenticate user and generate JWT token
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              required:
 *                - email
 *                - password
 *      responses:
 *          200:
 *              description: User logged in successfully
 *          401:
 *              description: Invalid email or password
 *          500:
 *              description: Internal server error
 */

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req body:", req.body);

    // Validate user credentials (against your User model)
    const user = await db.models.User.findOne({ where: { email } });
    console.log('user found:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT payload with user ID
    const payload = { userId: user.id };
    console.log('payload:', payload);

    // Sign the JWT token using the secret key from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the JWT token back in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'An error occurred during login' }); // Generic error message for security
  }
};

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     description: Retrieve the profile of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user's ID.
 *             username:
 *               type: string
 *               description: The user's username.
 *             email:
 *               type: string
 *               format: email
 *               description: The user's email address.
 *             role:
 *               type: string
 *               description: The role of the user.
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: The date and time when the user was created.
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: The date and time when the user was last updated.
 *       500:
 *         description: Internal server error. Failed to fetch user profile.
 */

exports.getUserProfile = async (req, res) => {
  try {
    // Implement user profile retrieval logic using db.models.User
    const user = await db.models.User.findByPk(req.user.userId); // Assuming you have a 'req.user' object
    console.log('user info:', user)
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user profile');
  }
};





exports.updateUserProfile = async (req, res) => {
  try {
    // Implement user profile update logic using db.models.User
    console.log('req body:', req);

    const updatedUser = await db.models.User.update(req.body, {
      where: { id: req.user.userId }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user profile');
  }
};



/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Failed to delete user.
 */

exports.deleteUser = async (req, res) => {
  try {
    // Implement user deletion logic using db.models.User
    await db.models.User.destroy({
      where: { id: req.params.id }
    });
    res.status(204).send('User deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
};

