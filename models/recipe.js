'use strict';
const { Model } = require('sequelize');
const recipe_ingredient = require('./recipe_ingredient');
module.exports = (sequelize, DataTypes) => {
    class Recipe extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Recipe.hasMany(models.Recipe_type, {
                foreignKey: 'idRecipe',
            });
            Recipe.hasMany(models.Recipe_ingredient, {
                foreignKey: 'idRecipe',
            });
            Recipe.hasMany(models.Product, {
                foreignKey: 'idRecipe',
            });

            Recipe.belongsTo(models.Type, {
                foreignKey: 'idType',
            });
            // define association here
        }
    }
    Recipe.init(
        {
            idRecipe: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            info: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            image: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            isDel: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 0, // Giá trị mặc định là 1
            },
            isActive: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            discount: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            quantity: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Recipe',
            timestamps: false,
        },
    );
    return Recipe;
};
