'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Shipping_companies', [
            {
                name: 'grab',
                costPerKm: 5,
                image: 'https://cdn.tgdd.vn/2020/08/CookRecipe/Avatar/uc-ga-chien-gion-thumbnail.jpg',
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
