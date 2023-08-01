'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Recipes', {
            idRecipe: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            info: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            idType: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Types', key: 'idType' },
            },

            image: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            isActive: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            discount: {
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Recipes');
    },
};
