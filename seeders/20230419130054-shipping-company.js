'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Shipping_companies', [
            {
                name: 'grab',
                costPerKm: 5,
                image: 'https://thicao.com/wp-content/uploads/2019/07/logo-moi-cua-grab.jpg',
            },
            {
                name: 'nowfood',
                costPerKm: 4,
                image: 'https://images.squarespace-cdn.com/content/v1/5f9bdbe0209d9a7ee6ea8797/1612706541953-M447AAUK2JK58U0K8B4N/now+food+logo.jpeg',
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
