'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Invoice_products', {
            idInvoice: {
                allowNull: false,
                primaryKey: true,
                references: { model: 'Invoices', key: 'idInvoice' },
                type: Sequelize.INTEGER,
            },
            idProduct: {
                allowNull: false,
                primaryKey: true,

                references: { model: 'Products', key: 'idProduct' },

                type: Sequelize.STRING,
            },
            size: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Invoice_products');
    },
};
