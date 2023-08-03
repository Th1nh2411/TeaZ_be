'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Invoice_product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Invoice_product.belongsTo(models.Invoice, {
                foreignKey: 'idInvoice',
            });
            Invoice_product.belongsTo(models.Product, {
                foreignKey: 'idProduct',
            });
        }
    }
    Invoice_product.init(
        {
            idInvoice: {
                allowNull: false,
                references: { model: 'Invoice', key: 'idInvoice' },
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
            totalProduct: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Invoice_product',
            timestamps: false,
        },
    );
    return Invoice_product;
};
