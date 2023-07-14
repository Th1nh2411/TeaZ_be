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
        isDel: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        quantity: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ingredients');
  }
};