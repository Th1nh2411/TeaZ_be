'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipe_types', {
      idRecipe: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Recipes", key: "idRecipe" },
        type: Sequelize.INTEGER
      },
      idType: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Types", key: "idType" },
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    
  }
};