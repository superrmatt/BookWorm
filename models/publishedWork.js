module.exports = function(sequelize, DataTypes) {
  let publishedWork = sequelize.define("publishedWork", {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    path: DataTypes.STRING
  });
  return publishedWork;
};
