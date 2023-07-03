'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Import extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Import.belongsTo(models.Ingredient, {
        foreignKey: "idIngredient",
      })
      Import.belongsTo(models.Shop, {
        foreignKey: "idShop",
      })
      
    }
  }
  Import.init({
    idImport: {
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
      primaryKey: true,
    },
    price:{
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Import',
    timestamps: false,
  });
  return Import;
};