'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Account, {
                foreignKey: 'idAcc',
            });
            User.hasMany(models.Cart_product, {
                foreignKey: 'idUser',
            });
            User.hasMany(models.Invoice, {
                foreignKey: 'idUser',
            });
        }
    }
    User.init(
        {
            idUser: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(255),
            },
        },
        {
            sequelize,
            modelName: 'User',
            timestamps: false,
        },
    );
    return User;
};
