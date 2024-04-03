'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a comment explaining the purpose of this migration
    console.log('This migration script documents the introduction of password hashing logic in user.js');
  },

  down: async (queryInterface, Sequelize) => {
    // No need for a down migration here (since it's just a comment)
  },
};
