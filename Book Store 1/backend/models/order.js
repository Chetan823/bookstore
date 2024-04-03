

module.exports = (sequelize, DataTypes) => {

    const Order = sequelize.define('Order', 
    {
        status: {
          type: DataTypes.ENUM('pending', 'completed'),
          defaultValue: 'pending'
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true // Consider allowing null if orders can exist without a user
        },
        // Add more fields as needed (e.g., address, payment_status)
        
      });

      return Order;
    };