'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Imports', {
      idImport: {
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
      price:{
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Imports');
  }
};