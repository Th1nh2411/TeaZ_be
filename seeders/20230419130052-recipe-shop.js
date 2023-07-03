'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Recipe_shops", [
      {
        idShop:2,
        idRecipe:1,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:2,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:3,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:4,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:5,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:6,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:7,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:8,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:9,
        isActive:1,
        discount:100,
      },
      {
        idShop:2,
        idRecipe:10,
        isActive:1,
        discount:100,
      },{
        idShop:2,
        idRecipe:11,
        isActive:1,
        discount:100,
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
