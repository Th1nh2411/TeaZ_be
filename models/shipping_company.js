'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping_company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Shipping_company.hasMany(models.Invoice, {
        foreignKey: "idShipping_company",
      });
    }
  }
  Shipping_company.init({
    idShipping_company: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    costPerKm: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Shipping_company',
    timestamps: false,
  });
  return Shipping_company;
};