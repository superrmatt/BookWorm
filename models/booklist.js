// Creating the list for each user. Will be a seperate table in the DB.
module.exports = function(sequelize, DataTypes) {
  var userBook = sequelize.define("userBook", {
    userID: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  });
  return userBook;
};
