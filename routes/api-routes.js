// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const Epub = require("epub-gen");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log(req.body.userName);
    db.User.create({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  app.post("/api/addnew", function (req, res) {
    db.userBook
      .create({
        userID: req.user.id,
        title: req.body.title,
        author: req.body.author,
        isRead: false
      })
      .then(function () {
        location.reload();
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  app.put("/api/changeread/:id", function (req, res) {
    db.userBook
      .update({ isRead: req.body.isRead }, { where: { id: req.params.id } })
      .then(function (data) {
        console.log(data);
        res.json("done");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        userName: req.user.userName
      });
    }
  });

  app.get("/api/user_books", function (req, res) {
    if (!req.user) {
      //! The user is not logged in, send back an empty object
      res.json({});
    } else {
      //! Otherwise send back the user's email and id
      //! Sending back a password, even a hashed password, isn't a good idea
      db.userBook
        .findAll({
          attributes: ["id", "title", "author", "isRead"],
          where: {
            userID: req.user.id
          }
        })
        .then(function (response) {
          res.json(response);
        });
    }
  });

  app.get("/api/published_works", function (req, res) {
    db.publishedWork
      .findAll({
        attributes: ["title", "author", "path"]
      })
      .then(function (response) {
        res.json(response);
      });
  });

  app.post("/api/publish", function (req, res) {
    let filePath =
      "../BookWorm/public/publishedWorks/" + req.body.title + ".epub";
    db.publishedWork
      .create({
        title: req.body.title,
        author: req.body.author,
        path: filePath
      })
      .then(function () {
        let option = {
          title: req.body.title, // *Required, title of the book.
          author: req.body.author, // *Required, name of the author.
          cover: "../BookWorm/public/stylesheets/images/library.jpg", // Url or File path, both ok, this is a test image.
          content: req.body.body
        };

        //eslint-disable-next-line prettier/prettier
        new Epub(option, filePath);
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  app.delete("/api/delete/:id", function (req, res) {
    db.userBook
      .destroy({ where: { id: req.params.id } })
      .then(function (data) {
        console.log(data);
        res.json("delete");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });
};
