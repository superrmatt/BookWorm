module.exports = function(sequelize, DataTypes) {
  let userBook = sequelize.define("userBook", {
    userID: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  });
  return userBook;
};
