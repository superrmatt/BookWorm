// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
let isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  /**
   * HTML Route for default homepage, redirects to /members if logged in or signup if not.
   * This is actualyl a relic of old functionality, considering the homepage is now index.html.
   * Kept for possible re-use via restructuring in the future.
   */
  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  /**
   * HTML route for logging in, redirects to /members if logged in.
   * Else: redirects to the login page. Again, kind of a relic from old functionality, replaced by new version.
   * Kept for possible re-use later.
   */
  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  /**
   *  HTML route to add our isAuthenticated middleware to this route.
   *  If a user who is not logged in tries to access this route they will be redirected to the signup page.
   */ 
  app.get("/members", isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  /**
   * HTML route to allow users to view a published work as .epub file.
   */
  app.get("/public/publishedworks/:name", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/publishedWorks/" + req.params.name));
  });

};


