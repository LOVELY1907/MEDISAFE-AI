const User = require("./User");
const Tablet = require("./Tablet");

// RELATION
User.hasMany(Tablet);
Tablet.belongsTo(User);

module.exports = { User, Tablet };
