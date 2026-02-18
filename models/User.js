const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;
