'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Shop extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Shop.init(
        {
            address: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            latitude: {
                //vĩ độ
                allowNull: false,
                type: DataTypes.DOUBLE,
            },
            longitude: {
                //kinh độ
                allowNull: false,
                type: DataTypes.DOUBLE,
            },
            isActive: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
            },
            image: {
                allowNull: false,
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'Shop',
            timestamps: false,
        },
    );
    Shop.removeAttribute('id');
    return Shop;
};
