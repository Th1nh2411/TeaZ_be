'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe_shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recipe_shop.belongsTo(models.Shop, {
        foreignKey: "idShop",
      });
      Recipe_shop.belongsTo(models.Recipe, {
        foreignKey: "idRecipe",
      })
    }
  }
  Recipe_shop.init({
    idShop: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Shop", key: "idShop" },
      type: DataTypes.INTEGER
    },
    idRecipe: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Recipe", key: "idRecipe" },
      type: DataTypes.INTEGER
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
  }, {
    sequelize,
    modelName: 'Recipe_shop',
    timestamps: false,
  });
  return Recipe_shop;
};