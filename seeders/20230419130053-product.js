'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Products', [
            {
                idProduct: '1,1;7,1;9,1;10,1',
                idRecipe: 1,
                isMain: 1,
            },
            {
                idProduct: '1,1;7,1;9,1;10,1',
                idRecipe: 7,
                isMain: 0,
            },
            {
                idProduct: '1,1;7,1;9,1;10,1',
                idRecipe: 9,
                isMain: 0,
            },
            {
                idProduct: '1,1;7,1;9,1;10,1',
                idRecipe: 10,
                isMain: 0,
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
