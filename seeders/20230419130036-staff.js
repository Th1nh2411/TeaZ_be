'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Staffs', [
            {
                name: 'TranNhatQuan',
                idAcc: 2,
            },
            {
                name: 'Tran Nhat Quan',
                idAcc: 3,
            },
            {
                name: 'Admin',
                idAcc: 4,
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
