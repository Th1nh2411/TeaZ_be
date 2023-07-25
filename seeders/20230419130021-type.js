'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Types', [
            {
                name: 'MilkTea',
            },
            {
                name: 'Coffee',
            },
            {
                name: 'Tea',
            },
            {
                name: 'Bakery',
            },
            {
                name: 'Topping',
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
