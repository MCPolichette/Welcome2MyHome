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

  app.post("/api/contactInfo", function (req, res) {
    console.log("API ROUTE" + req);

    db.House.create(req.body.houseInfo).then(function name(houseData) {
      console.log(houseData);
      var houseId = houseData.dataValues.id;
      console.log(houseId);
      var eContactInfo = req.body.eContact;
      eContactInfo.HouseId = houseId;

      db.EmergencyContact.create(eContactInfo).then(function(emergenInfo){

        console.log(emergenInfo);
        res.send("route hit and all data works");
      });

    });

  });

  app.get("/api/contactInfo", function (req, res) {
    db.House.findOne({
      where:{
        id: 2,
      },
      include: [db.EmergencyContact]
    }).then(function(houseData){
      console.log(houseData);
      res.json(houseData)
    })
  });

  // Delete an house by id
  app.delete("/api/houses/:id", function(req, res) {
    db.House.destroy({ where: { id: req.params.id } }).then(function(dbHouse) {
      res.json(dbHouse);
    });
  });
};