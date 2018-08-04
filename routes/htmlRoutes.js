var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.House.findAll({}).then(function(dbHouses) {
      res.render("index", {
        msg: "Welcome!",
        houses: dbHouses
      });
    });
  });

  // Load house page and pass in an example by id
  app.get("/house/:id", function(req, res) {
    db.House.findOne({ where: { id: req.params.id } }).then(function(dbHouse) {
      res.render("house", {
        house: dbHouse
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
