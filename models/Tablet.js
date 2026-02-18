const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Tablet = sequelize.define("Tablet", {
  tabletName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purposes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});


module.exports = Tablet;
