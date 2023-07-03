'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Product.belongsTo(models.Recipe, {
        foreignKey: "idRecipe",
      })
      Product.hasMany(models.Cart_product, {
        foreignKey: "idProduct"
      })
    }
  }
  Product.init({
    idProduct: {
      allowNull: false,
      
      primaryKey: true,
      type: DataTypes.STRING
    },
    idRecipe: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Recipe", key: "idRecipe" },
      type: DataTypes.INTEGER
    },
    isMain: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: false,
  });
  return Product;
};