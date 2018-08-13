var db = require("../models");

module.exports = function(app) {
  app.get;
  // Load index page
  app.get("/index", function(req, res) {
    db.House.findAll({}).then(function(dbHouses) {
      // console.log(dbHouses);
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

  // APIs for Guest_view and Edit View Below:
  // Load house page and pass in an example by id
  app.get("/guest_view/:id/", function(req, res) {
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // I would prefer it to be /guest_view/:id/:placename, but for development, this linkage is easier to navigate
    // please change the linkage on the guest_view.handlebars and elsewhere before publishing (Mark)
    db.House.findOne({ where: { id: req.params.id } }).then(function(dbHouse) {
      var herokuHost = "https://infinite-lowlands-27810.herokuapp.com";
      var host = req.hostname;
      var protocol = req.protocol;
      // the below protocol and host should be more dynamic like the coment below.
      // var houseUrl = protocol + "://" + host + "/guest_view/" + req.params.id;
      var houseUrl = herokuHost + "/guest_view/" + req.params.id;
      var qrUrl =
        "http://api.qrserver.com/v1/create-qr-code/?data=" +
        houseUrl +
        "&size=200x200";

      res.render("guest_view", {
        house: dbHouse,
        qrUrl: qrUrl
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
  app.get("/", function(req, res) {
    res.render("about");
  });

  app.get("/form", function(req, res) {
    res.render("house_form");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
