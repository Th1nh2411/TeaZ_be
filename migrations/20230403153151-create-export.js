'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Exports', {
      idExport: {
        allowNull: false,
        
        primaryKey: true,
        autoIncrement: true,
        
        type: Sequelize.INTEGER
      },
      idIngredient: {
        allowNull: false,
        
        
        references: { model: "Ingredients", key: "idIngredient" },
        
        type: Sequelize.INTEGER
      },
      idShop: {
        allowNull: false,
        
        
        references: { model: "Shops", key: "idShop" },
        
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE,
        
        allowNull: false,
      },
      info:{
        allowNull:false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Exports');
  }
};