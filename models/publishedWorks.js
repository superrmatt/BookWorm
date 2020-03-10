module.exports = function(sequelize, DataTypes) {
  var publishedWork = sequelize.define("publishedWork", {
    userID: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    body: DataTypes.TEXT
  });
  return publishedWork;
};
