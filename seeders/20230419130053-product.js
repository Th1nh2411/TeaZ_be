'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // return queryInterface.bulkInsert('Products', [
        //     {
        //         idProduct: '1',
        //         idRecipe: 1,
        //         isMain: 1,
        //     },
        // ]);
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
