'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Shops", [
      {
        address: 'TranNhatQuan',
        isActive: 0,
        latitude:10.847019,
        longitude:106.787315,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        address: '97 Man Thiện, Thủ Đức',
        isActive: 1,
        latitude:10.847988,
        longitude:106.785888,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
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
