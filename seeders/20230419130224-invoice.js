'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Invoices", [
      {
        idCart:1,
        idStaff:1,
        shippingCompany:1,
        shippingFee:15,
        total:40,
        date:"2023-05-15 08:30:22",
        status:1,
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
