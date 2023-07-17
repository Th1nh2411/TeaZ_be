'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            idProduct: {
                allowNull: false,

                primaryKey: true,

                type: Sequelize.STRING,
            },
            idRecipe: {
                allowNull: false,

                primaryKey: true,
                references: { model: 'Recipes', key: 'idRecipe' },
                type: Sequelize.INTEGER,
            },

            isMain: {
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
        await queryInterface.dropTable('Products');
    },
};
