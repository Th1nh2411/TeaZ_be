'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Recipe_ingredients", [
      {
        idRecipe: 1,
        idIngredient: 2,
        quantity: 10,
      },
      {
        idRecipe: 1,
        idIngredient: 3,
        quantity: 10,
      },
      {
        idRecipe: 1,
        idIngredient: 7,
        quantity: 10,
      },
      {
        idRecipe: 2,
        idIngredient: 5,
        quantity: 10,
      },
      {
        idRecipe: 2,
        idIngredient: 4,
        quantity: 10,
      },{
        idRecipe: 2,
        idIngredient: 3,
        quantity: 10,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
