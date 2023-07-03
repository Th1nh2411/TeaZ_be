'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Export.belongsTo(models.Ingredient, {
        foreignKey: "idIngredient",
      })
      Export.belongsTo(models.Shop, {
        foreignKey: "idShop",
      })
    }
  }
  Export.init({
    idExport: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
     
      
      type: DataTypes.INTEGER
    },
    idIngredient: {
      allowNull: false,
      
      
      references: { model: "Ingredient", key: "idIngredient" },
      type: DataTypes.INTEGER,
    },
    idShop: {
      allowNull: false,
      
     
      references: { model: "Shop", key: "idShop" },
      type: DataTypes.INTEGER
    },
    date: {
      //YYYY-MM-DD
      type: DataTypes.DATE,
      
      allowNull: false,
     
    },
    info:{
      allowNull:false,
      type: DataTypes.STRING,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Export',
    timestamps: false,
  });
  return Export;
};