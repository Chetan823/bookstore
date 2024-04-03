const db = require('../models');

/**
 * @swagger
 * /shoppingCart/add-to-cart:
 *  post:
 *      summary: Add item to cart
 *      description: Add an item to the shopping cart
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                bookId:
 *                  type: integer
 *                quantity:
 *                  type: integer
 *      responses:
 *          200:
 *              description: Item added to cart
 *          500:
 *              description: Internal server error
 */
const addToCart = async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;

    const existingItem = await db.models.ShoppingCart.findOne({ where: { userId, bookId } });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await db.models.ShoppingCart.create({ userId, bookId, quantity });
    }

    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding item to cart' });
  }
};



/**
 * @swagger
 * /shoppingCart/get-cart:
 *   get:
 *     summary: Get user's shopping cart
 *     description: Retrieve the items in the user's shopping cart
 *     security:
 *       - bearerAuth: [] # Security definition for JWT authentication
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/CartItem'
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Failed to fetch cart items.
 */

const getCart = async (req, res) => {
  try {
    // Assuming 'verifyToken' middleware attaches user info to req.user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const userId = req.user.userId;
    
    const cartItems = await db.models.ShoppingCart.findAll({
      where: { userId },
      include: [{ model: db.models.Book }], // Include the Book model as db.models.Book
    });

    res.json(cartItems.map(item => ({
      id: item.id,
      userId: item.userId,
      bookId: item.bookId,
      quantity: item.quantity,
      book: { // Include relevant Book data
        id: item.Book.id,
        title: item.Book.title,
        author: item.Book.author,
        // Include other desired book properties
      }
    }))); // Include quantity in response
    
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'An error occurred while fetching cart items' });
  }
};

module.exports = {
  getCart
};




/**
 * @swagger
 * /shoppingCart/update-cart:
 *   post:
 *     summary: Update cart item
 *     description: Update the quantity of a cart item or remove it from the cart
 *     security:
 *       - bearerAuth: [] # Security definition for JWT authentication
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Item ID and quantity for updating the cart
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             itemId:
 *               type: integer
 *               description: The ID of the item to update
 *             quantity:
 *               type: integer
 *               description: The new quantity of the item
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Confirmation message
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       403:
 *         description: Forbidden. Cannot update another user's cart.
 *       404:
 *         description: Cart item not found.
 *       500:
 *         description: Internal server error. Failed to update cart item.
 */
const updateCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    // Assuming 'verifyToken' middleware attaches user info to req.user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const item = await db.models.ShoppingCart.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Check if the item belongs to the authenticated user
    if (item.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: Cannot update another user\'s cart' });
    }

    if (quantity > 0) {
      item.quantity = quantity;
      await item.save();
    } else {
      await item.destroy();
    }

    res.status(200).json({ message: 'Cart item updated' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'An error occurred while updating cart item' });
  }
};


/**
 * @swagger
 * /shoppingCart/clear-cart:
 *   delete:
 *     summary: Clear user's cart
 *     description: Clear all items from the user's cart
 *     security:
 *       - bearerAuth: [] # Security definition for JWT authentication
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Confirmation message
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Failed to clear cart.
 */

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('userId:', userId)
    await db.models.ShoppingCart.destroy({ where: { userId } });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'An error occurred while clearing cart' });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  clearCart
};
