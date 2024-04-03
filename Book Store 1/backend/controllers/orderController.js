// Import necessary models
const db = require('../models');


// Controller functions for order management
/**
 * @swagger
 * /orders:
 *  post:
 *      summary: Create a new order
 *      description: Create a new order with the provided details
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                  description: ID of the user placing the order
 *                bookId:
 *                  type: integer
 *                  description: ID of the book being ordered
 *                quantity:
 *                  type: integer
 *                  description: Quantity of the book being ordered
 *              required:
 *                - userId
 *                - bookId
 *                - quantity
 *      responses:
 *          200:
 *              description: The newly created order
 *          500:
 *              description: Internal server error
 */

const createOrder = async (req, res) => {
    try {
      // Implement order creation logic using db.models.Order
      const newOrder = await db.models.Order.create(req.body);
      res.json(newOrder);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating order');
    }
  };


  /**
   * @swagger
   * /orders:
   *  get:
   *      summary: Get all orders
   *      description: Retrieve a list of all orders
   *      responses:
   *          200:
   *              description: A list of all orders
   *          500:
   *              description: Internal server error
   */
  
const getAllOrders = async (req, res) => {
    try {
      // Implement retrieval of all orders using db.models.Order
      const orders = await db.models.Order.findAll();
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching orders');
    }
  };



  /**
 * @swagger
 * /orders/{id}:
 *  get:
 *      summary: Get order by ID
 *      description: Retrieve an order by its ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the order to retrieve
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: The order with the specified ID
 *          404:
 *              description: Order not found
 *          500:
 *              description: Internal server error
 */

const getOrderById = async (req, res) => {
    try {
      // Implement retrieval of an order by ID using db.models.Order
      const order = await db.models.Order.findByPk(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).send('Order not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching order');
    }
  };

/**
 * @swagger
 * /orders/{id}:
 *  put:
 *      summary: Update order status
 *      description: Update the status of an order by its ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the order to update
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *      responses:
 *          200:
 *              description: The updated order
 *          500:
 *              description: Internal server error
 */

const updateOrderStatus = async (req, res) => {
    try {
      // Implement order status update logic using db.models.Order
      const updatedOrder = await db.models.Order.update(
        req.body,
        { where: { id: req.params.id } }
      );
      res.json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating order status');
    }
  };
  
  /**
 * @swagger
 * /orders/{id}:
 *  delete:
 *      summary: Delete an order
 *      description: Delete an order by its ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the order to delete
 *          schema:
 *            type: integer
 *      responses:
 *          204:
 *              description: Order deleted
 *          500:
 *              description: Internal server error
 */

const deleteOrder = async (req, res) => {
    try {
      // Implement order deletion logic using db.models.Order
      await db.models.Order.destroy({ where: { id: req.params.id } });
      res.status(204).send('Order deleted');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting order');
    }
  };


const placeOrder = async (req, res) => {
  try {
    // Extract order data from request body
    const { userId, items } = req.body;

    // Create a new order
    const order = await Order.create({ userId });

    // Create order items
    const orderItems = await Promise.all(items.map(async (item) => {
      const { bookId, quantity } = item;
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error(`Book with ID ${bookId} not found`);
      }
      return OrderItem.create({
        orderId: order.id,
        bookId,
        quantity,
        unitPrice: book.price
      });
    }));

    // Calculate total amount for the order
    const totalAmount = orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);

    // Update total amount for the order
    await order.update({ totalAmount });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'An error occurred while placing the order' });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    // Retrieve order history for a user
    const userId = req.user.id; // Assuming user ID is available in request object
    const orders = await Order.findAll({ where: { userId } });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'An error occurred while fetching order history' });
  }
};

module.exports = {
  placeOrder,
  getOrderHistory,
  deleteOrder,
  updateOrderStatus,
  createOrder,
  getAllOrders,
  getOrderById,
};
