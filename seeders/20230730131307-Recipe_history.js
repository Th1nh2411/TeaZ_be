'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Recipe_histories', [
            { date: '2023-05-15 08:30:22', idRecipe: 1, price: 20, discount: 80 },
            { date: '2023-05-15 08:30:22', idRecipe: 2, price: 20, discount: 80 },
            { date: '2023-05-15 08:30:22', idRecipe: 3, price: 20, discount: 84 },
            { date: '2023-05-15 08:30:22', idRecipe: 4, price: 25, discount: 85 },
            { date: '2023-05-15 08:30:22', idRecipe: 5, price: 20, discount: 100 },
            { date: '2023-05-15 08:30:22', idRecipe: 6, price: 20, discount: 100 },
            { date: '2023-05-15 08:30:22', idRecipe: 7, price: 20, discount: 100 },
            { date: '2023-05-15 08:30:22', idRecipe: 8, price: 30, discount: 100 },
            { date: '2023-05-15 08:30:22', idRecipe: 9, price: 32, discount: 100 },
            { date: '2023-05-15 08:30:22', idRecipe: 10, price: 15, discount: 100 },
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
