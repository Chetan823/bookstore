'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'total_amount');
  },

  down: async (queryInterface, Sequelize) => {
    // If you ever need to revert this migration, you can recreate the column
    await queryInterface.addColumn('Orders', 'total_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
  }
};
