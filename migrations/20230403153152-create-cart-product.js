'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Cart_products', {
            idUser: {
                allowNull: false,
                primaryKey: true,
                references: { model: 'Users', key: 'idUser' },
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
        await queryInterface.dropTable('Cart_products');
    },
};
