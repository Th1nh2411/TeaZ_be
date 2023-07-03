'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Revenue_statistics', {
      date: {
        type: Sequelize.DATEONLY,
        primaryKey: true,
        allowNull: false,
      },
      idShop: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Shops", key: "idShop" },
        type: Sequelize.INTEGER
      },
      input:{
        type: Sequelize.DOUBLE,
        allowNull:false
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Revenue_statistics');
  }
};