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
            User.hasOne(models.Cart, {
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
            mail: {
                type: DataTypes.STRING(255),
                allowNull: false,
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
