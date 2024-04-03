const express = require('express');
const path = require('path'); // For potential static file serving
const db = require('./models'); // Assuming your models are in a 'models' folder
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); // For handling cross-origin requests (if applicable)



const users = require('./routes/user');
const books = require('./routes/book');
const orders = require('./routes/order'); // Using plural for consistency
const orderItems = require('./routes/orderItem'); // Using plural for consistency
const shoppingCart = require('./routes/shoppingCart');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Store Project',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3000' // Or use an environment variable for flexibility
      }
    ]
  },
  // Adjust the path based on your controller file locations
  apis: ['./controllers/*.js'] // Include all .js files in the controllers directory
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




// Middleware
app.use(cors()); // Enable CORS if necessary for cross-origin requests
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data (optional)

// Mount Routers
app.use('/users', users); // Mount user routes under '/users'
app.use('/books', books); // Mount book routes under '/books'
app.use('/orders', orders); // Mount order routes under '/orders'
// app.use('/orderItems', orderItems); // Mount order item routes under '/orderItems'
app.use('/shoppingCart', shoppingCart); // Mount shopping cart routes under '/shoppingCart'

// Error Handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

// Serve static files (optional)
// app.use(express.static(path.join(__dirname, 'public')));  // Add if serving static content

async function startServer() {
  try {
    await db.sequelize.sync(); // Synchronize database models (optional)
    console.log('Database connection successful');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit with an error code
  }
}

startServer();

module.exports = app; // Optional for testing purposes
