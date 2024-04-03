const dbConfig = require('../config/db');
const Sequelize = require('sequelize');

const sequelize = new Sequelize (dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
host: dbConfig.HOST,
dialect: dbConfig.DIALECT
});

const db = {};
db.sequelize = sequelize;
db.models = {};

db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Book = require('./book')(sequelize, Sequelize.DataTypes);
db.models.Order = require('./order')(sequelize, Sequelize.DataTypes);
db.models.ShoppingCart = require('./shoppingcart')(sequelize, Sequelize.DataTypes);

module.exports = db;

// const db = require('./models');

(async () => {
    await db.sequelize.sync();
})();