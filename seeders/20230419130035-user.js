'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                mail: 'n19dccn196@student.ptithcm.edu.vn',
                name: 'TranNhatQuan',
                idAcc: 1,
            },
            {
                mail: 'rinktvn2411@gmail.com',
                name: 'NhanvienQuen',
                idAcc: 2,
            },
            {
                mail: 'n19dccn053@student.ptithcm.edu.vn',
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
