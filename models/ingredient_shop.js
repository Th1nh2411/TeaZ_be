'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient_shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Ingredient_shop.belongsTo(models.Ingredient, {
        foreignKey: "idIngredient",
      })
      Ingredient_shop.belongsTo(models.Shop, {
        foreignKey: "idShop",
      })
      
    }
  }
  Ingredient_shop.init({
    idIngredient: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Ingredient", key: "idIngredient" },
      type: DataTypes.INTEGER,
    },
    idShop: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Shop", key: "idShop" },
      type: DataTypes.INTEGER
    },
    
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0, // Giá trị mặc định là 1
    }
  }, {
    sequelize,
    modelName: 'Ingredient_shop',
    timestamps: false,
  });
  return Ingredient_shop;
};