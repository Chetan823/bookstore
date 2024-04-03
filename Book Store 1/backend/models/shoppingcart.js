module.exports = (sequelize, DataTypes) => {

  const ShoppingCart = sequelize.define('ShoppingCart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Book',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.VIRTUAL,
      get() {
        // Retrieve book price using the relationship with Book model
        return this.getBook() // Assuming a relationship is defined
          .then(book => parseFloat((this.getDataValue('quantity') * book.price).toFixed(2)));
      }
    }
  });

  // Define the association between ShoppingCart and Book (assuming a one-to-many relationship)
  ShoppingCart.belongsTo(sequelize.models.Book, { foreignKey: 'bookId' });

  return ShoppingCart;
};
