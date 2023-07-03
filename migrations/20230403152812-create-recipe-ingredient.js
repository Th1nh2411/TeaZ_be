'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipe_ingredients', {
      idRecipe: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Recipes", key: "idRecipe" },
        type: Sequelize.INTEGER
      },
      idIngredient: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Ingredients", key: "idIngredient" },
        type: Sequelize.INTEGER
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Recipe_ingredients');
  }
};