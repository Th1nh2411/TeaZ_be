'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      idInvoice: {
        allowNull: false,
        
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      idCart: {
        allowNull: false,
        
        unique:true,
        references: { model: "Carts", key: "idCart" },
        type: Sequelize.INTEGER
      },
      idShop: {
        allowNull: false,
        references: { model: "Shops", key: "idShop" },
        type: Sequelize.INTEGER
      },
      idShipping_company: {
        allowNull: false,
        references: { model: "Shipping_companies", key: "idShipping_company" },
        type: Sequelize.INTEGER,
      },
      shippingFee: {
        allowNull: false,
        
        type: Sequelize.DOUBLE,
      },
      total: {
        allowNull: false,
        
        type: Sequelize.DOUBLE,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  }
};