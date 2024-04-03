module.exports = (sequelize, DataTypes) => {

    const Book = sequelize.define('Book', 
    {
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false
        },
        genre: {
          type: DataTypes.STRING
        },
        publication_date: {
          type: DataTypes.DATE
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        }
      });

      return Book;
    };