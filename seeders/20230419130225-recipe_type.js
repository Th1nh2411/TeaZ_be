'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Recipe_types", [
      {
        
        idRecipe:8,
        idType:1
   
      },
      {
        
        idRecipe:9,
        idType:1
   
      },
      {
        
        idRecipe:10,
        idType:1
   
      },
      {
        
        idRecipe:11,
        idType:1
   
      },
      {
        idType:2,
        idRecipe:8
      }
      
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
