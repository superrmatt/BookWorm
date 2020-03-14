// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const Epub = require("epub-gen");

module.exports = function (app) {
  /** 
   * Using the passport.authenticate middleware with our local strategy.
   * If the user has valid login credentials, send them to the members page.  
   * Otherwise the user will be sent an error.
   */
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  /** 
   *  Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
   *  How we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
   *  Otherwise, send back an error.
   */
  app.post("/api/signup", function (req, res) {
    db.User.create({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    }).then(function () {
        res.redirect(307, "/api/login");
      }).catch(function (err) {
        res.status(401).json(err);
      });
  });

  /**
   * Route to add a new book to a user's booklist.
   * Creates entry in DB, reloads and sends error if failed.
   */
  app.post("/api/addnew", function (req, res) {
    db.userBook.create({
        userID: req.user.id,
        title: req.body.title,
        author: req.body.author,
        isRead: false
      }).then(function () {
        location.reload();
      }).catch(function (err) {
        res.status(401).json(err);
      });
  });

  /**
   * Route to change the 'read' or 'unread' (boolean) value of the isRead column in publishedWorks table.
   * takes param :id as the id of the book to be changed.
   */
  app.put("/api/changeread/:id", function (req, res) {
    db.userBook.update({ 
        isRead: req.body.isRead 
      }, 
      {  
        where: 
          { 
            id: req.params.id 
          } 
    }).then(function (data) {
      res.json("done");
    }).catch(function (err) {
      res.status(401).json(err);
    });
  });

  /**
   * Route for logging user out.
   */ 
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  /**
   * Route for getting user data to be used client side.
   */ 
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

  /**
   * Route to get list of users books.
   */
  app.get("/api/user_books", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      db.userBook.findAll({
          attributes: ["id", "title", "author", "isRead"],
          where: {
            userID: req.user.id
          }
        }).then(function (response) {
          res.json(response);
        });
    }
  });

  /**
   * Route to get all publsihed works from the DB.
   */
  app.get("/api/published_works", function (req, res) {
    db.publishedWork.findAll({
        attributes: ["title", "author", "path"]
      }).then(function (response) {
        res.json(response);
      });
  });

  /**
   * Route to publish a new book.
   * When called, creates entry in DB and then creates the epub file.
   * Parses the link so as to avoid bugs.
   * BUG: since DB entry created first, if EPUB fails we now have a reference to a publsihed book that does not exist on server filesystem.
   */
  app.post("/api/publish", function (req, res) {
   // let parsedTitle = parseEpubPath(req.body.title),
     let   filePath = "../BookWorm/public/publishedWorks/" + req.body.title + ".epub";
    db.publishedWork.create({
        title: req.body.title,
        author: req.body.author,
        path: filePath

      }).then(function () {
        let option = {
          title: req.body.title, // *Required, title of the book.
          author: req.body.author, // *Required, name of the author.
          content: req.body.body
        };
        new Epub(option, filePath);

      }).catch(function (err) {
        res.status(401).json(err);
      });
  });

  /**
   * Route to delete a book from the user's list of books.
   */
  app.delete("/api/delete/:id", function (req, res) {
    db.userBook.destroy({ 
      where: { 
        id: req.params.id 
      } 
    }).then(function (data) {
      res.json("delete");
    }).catch(function (err) {
      res.status(401).json(err);
    });
  });

  /**
   * Parses the title of each epub book to allow for filesystem browsing.
   * @param path The title of the book as string.
   * @return The title parsed to allow for viewing the ebook.
   */
  function parseEpubPath(path){
    path = path.replace(/ /g,"_");
    path = path.replace(/'/g, "&single"); 
    path = path.replace(/"/g, "&double");
    path = path.replace(/`/g, "&backtick");
    path = path.replace(/[/]/g, "&forwardSlash"); 
    path = path.replace(/\\/g, "&backslash");
    path = path.replace(/[|]/g, "&pipe");
    path = path.replace(/[?]/g, "&question");
    path = path.replace(/[*]/g, "&asterisk");
    return path;
  }
};
