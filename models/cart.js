'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Cart.belongsTo(models.User, {
        foreignKey: "idUser",
      })
     
      Cart.hasOne(models.Invoice,{
        foreignKey: "idInvoice",
       
      })
      Cart.hasMany(models.Cart_product,{
        foreignKey: "idCart",
       
      })
    }
  }
  Cart.init({
    idCart: {
      allowNull: false,
      autoIncrement:true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    isCurrent:{
      allowNull: false,
      type: DataTypes.INTEGER
    }
    
    
    
  }, {
    sequelize,
    modelName: 'Cart',
    timestamps: false,
  });
  return Cart;
};