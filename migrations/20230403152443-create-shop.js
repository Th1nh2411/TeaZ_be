'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Shops', {
            address: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            isActive: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            latitude: {
                //vĩ độ
                allowNull: false,
                type: Sequelize.DOUBLE,
            },
            longitude: {
                //kinh độ
                allowNull: false,
                type: Sequelize.DOUBLE,
            },
            image: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Shops');
    },
};
