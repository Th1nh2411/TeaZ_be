'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.belongsTo(models.Account,{
        foreignKey: "idAcc",
       
      });
      Staff.belongsTo(models.Shop,{
        foreignKey: "idShop",
      });
     
    }
  }
  Staff.init({
    idStaff: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    
    
    isShare: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  },
  {
    sequelize,
    modelName: 'Staff',
    timestamps: false,
  });
  return Staff;
};