'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipe_type.belongsTo(models.Recipe,{
        foreignKey: "idRecipe",
        
      });
      Recipe_type.belongsTo(models.Type, {
        foreignKey: "idType",
      })
      
    }
  }
  Recipe_type.init({
    idRecipe: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Recipe", key: "idRecipe" },
      type: DataTypes.INTEGER
    },
    idType: {
      allowNull: false,
      
      primaryKey: true,
      references: { model: "Type", key: "idType" },
      type: DataTypes.INTEGER
    },
   
    
  }, {
    sequelize,
    modelName: 'Recipe_type',
    timestamps: false,
  });
  return Recipe_type;
};