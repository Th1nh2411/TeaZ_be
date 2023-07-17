'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Ingredients', {
            idIngredient: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(45),
                unique: true,
                allowNull: false,
            },
            unitName: {
                allowNull: false,
                type: Sequelize.STRING(10),
            },
            image: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            isActive: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Ingredients');
    },
};
