'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Invoice.belongsTo(models.Shipping_company, {
                foreignKey: 'idShipping_company',
            });
            Invoice.belongsTo(models.User, {
                foreignKey: 'idUser',
            });
            Invoice.hasMany(models.Invoice_product, {
                foreignKey: 'idInvoice',
            });
        }
    }
    Invoice.init(
        {
            idInvoice: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            shippingFee: {
                allowNull: false,

                type: DataTypes.DOUBLE,
            },
            total: {
                allowNull: false,

                type: DataTypes.DOUBLE,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Invoice',
            timestamps: false,
        },
    );
    return Invoice;
};
