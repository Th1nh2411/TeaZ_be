'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Recipes', [
            {
                name: 'Trà sữa truyền thống',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 20,
                discount: 90,
            },
            {
                name: 'Trà sữa trân châu đường đen',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 25,
                discount: 100,
            },
            {
                name: 'Trà sữa panda',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 22,
                discount: 85,
            },
            {
                name: 'Trà sữa matcha',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 20,
                discount: 100,
            },
            {
                name: 'Trà sữa Berry Berry',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 30,
                discount: 90,
            },
            {
                name: 'Latte',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 32,
                discount: 90,
            },
            {
                name: 'Hồng trà sữa',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 15,
                discount: 80,
            },
            {
                name: 'Trân châu đen',
                info: '',
                idType: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 5,
                discount: 100,
            },
            {
                name: 'Trân châu trắng',
                info: '',
                idType: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 5,
                discount: 100,
            },

            {
                name: 'Sương sáo',
                info: '',
                idType: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
                price: 10,
                discount: 100,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
