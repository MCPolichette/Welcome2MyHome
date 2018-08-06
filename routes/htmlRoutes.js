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

  // Load a guest viewing page and pass in an example by id
  app.get("/guest_view/:id", function(req, res) {
    db.House.findOne({ where: { id: req.params.id } }).then(function(dbHouse) {
      res.render("guest_view", {
        house: dbHouse
      });
    });
  });

  // Load editable viewing page and pass in an example by id
  app.get("/edit_view/:id", function(req, res) {
    db.House.findOne({ where: { id: req.params.id } }).then(function(dbHouse) {
      res.render("edit_view", {
        house: dbHouse
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
