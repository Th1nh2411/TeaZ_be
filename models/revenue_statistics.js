'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Revenue_statistics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Revenue_statistics.belongsTo(models.Shop, {
        foreignKey: "idShop",
      })
      
    }
  }
  Revenue_statistics.init({
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
      allowNull: false,
    },
    idShop: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Shop", key: "idShop" },
      type: DataTypes.INTEGER
    },
    
    input:{
      type: DataTypes.DOUBLE,
      allowNull:false
    },


  }, {
    sequelize,
    modelName: 'Revenue_statistics',
    timestamps: false,
  });
  return Revenue_statistics;
};