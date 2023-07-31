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
            },
            {
                name: 'Trà sữa trân châu đường đen',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Trà sữa panda',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Trà sữa matcha',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Trà sữa Berry Berry',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Latte',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Hồng trà sữa',
                info: '',
                idType: 1,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Trân châu đen',
                info: '',
                idType: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },
            {
                name: 'Trân châu trắng',
                info: '',
                idType: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
            },

            {
                name: 'Sương sáo',
                info: '',
                idType: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
                isActive: 1,
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
