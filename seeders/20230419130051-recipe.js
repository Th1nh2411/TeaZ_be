'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Recipes", [
      {
        name: 'Trà sữa truyền thống',
        info: '',
        price: 20,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Trà sữa trân châu đường đen',
        info: '',
        price: 30,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Trà sữa panda',
        info: '',
        price: 30,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Trà sữa matcha',
        info: '',
        price: 20,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Trà sữa Berry Berry',
        info: '',
        price: 20,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Latte',
        info: '',
        price: 20,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Hồng trà sữa',
        info: '',
        price: 20,
        idType: 1,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Trân châu đen',
        info: '',
        price: 5,
        idType: 2,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Trân châu trắng',
        info: '',
        price: 20,
        idType: 2,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Đá',
        info: '',
        price: 0,
        idType: 4,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Ngọt',
        info: '',
        price: 0,
        idType: 4,
        image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
      },
      {
        name: 'Sương sáo',
        info: '',
        price: 5,
        idType: 2,
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
