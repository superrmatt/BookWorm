module.exports = function(sequelize, DataTypes) {
  var publishedWorks = sequelize.define("publishedWork", {
    userID: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    body: DataTypes.TEXT
  });
  return publishedWorks;
};
