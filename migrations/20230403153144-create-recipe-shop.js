'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipe_shops', {
      idShop: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Shops", key: "idShop" },
        type: Sequelize.INTEGER
      },
      idRecipe: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Recipes", key: "idRecipe" },
        type: Sequelize.INTEGER
      },
      
      isActive: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      discount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Recipe_shops');
  }
};