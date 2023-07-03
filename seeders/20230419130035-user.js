'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        name: 'TranNhatQuan',
        idAcc: 1,
        isShare: 1,
       
      },
      {
        name: 'Tran Nhat Quan',
       
        idAcc: 5,
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
