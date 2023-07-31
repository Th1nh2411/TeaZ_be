'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Recipe_history extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Recipe_history.belongsTo(models.Recipe, {
                foreignKey: 'idRecipe',
            });
        }
    }
    Recipe_history.init(
        {
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                primaryKey: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            idRecipe: {
                allowNull: false,
                primaryKey: true,

                references: { model: 'Recipe', key: 'idRecipe' },

                type: DataTypes.INTEGER,
            },
            discount: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Recipe_history',
        },
    );
    return Recipe_history;
};
