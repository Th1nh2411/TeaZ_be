'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart_product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Cart_product.belongsTo(models.Cart, {
                foreignKey: 'idCart',
            });
            Cart_product.belongsTo(models.Product, {
                foreignKey: 'idProduct',
            });
        }
    }
    Cart_product.init(
        {
            idCart: {
                allowNull: false,
                references: { model: 'Cart', key: 'idCart' },
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            idProduct: {
                allowNull: false,
                primaryKey: true,

                references: { model: 'Product', key: 'idProduct' },

                type: DataTypes.STRING,
            },
            size: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            quantity: {
                allowNull: false,

                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Cart_product',
            timestamps: false,
        },
    );
    return Cart_product;
};
