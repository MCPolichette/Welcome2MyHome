var db = require("../models");

module.exports = function(app) {
  // Get all houses
  app.get("/api/houses", function(req, res) {
    db.House.findAll({}).then(function(dbHouses) {
      res.json(dbHouses);
    });
  });

  // Create a new house
  app.post("/api/houses", function(req, res) {
    console.log("API ROUTE" + req);
    db.House.create(req.body).then(function(dbHouse) {
      res.json(dbHouse);
    });
  });

  // Delete an house by id
  app.delete("/api/houses/:id", function(req, res) {
    db.House.destroy({ where: { id: req.params.id } }).then(function(dbHouse) {
      res.json(dbHouse);
    });
  });
};
