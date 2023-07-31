'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Recipe_histories', {
            date: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.DATE,
            },
            idRecipe: {
                allowNull: false,
                primaryKey: true,
                references: { model: 'Recipes', key: 'idRecipe' },
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('Recipe_histories');
    },
};
