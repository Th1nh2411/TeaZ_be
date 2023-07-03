'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Staffs", [
      {
        name: 'TranNhatQuan',
        idAcc: 2,
        idShop:2,
        isShare: 1,
       
      },
      {
        name: 'Tran Nhat Quan',
        idShop:2,
        idAcc: 3,
        isShare: 1,
      },
      {
        name: 'Admin',
        idShop:1,
        idAcc: 4,
        isShare: 1,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
