'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                name: 'TranNhatQuan',
                idAcc: 1,
            },
            {
                name: 'NhanvienQuen',
                idAcc: 2,
            },
            {
                name: 'Admin',
                idAcc: 3,
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
