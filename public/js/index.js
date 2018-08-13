var $submitBtn = $("#submit");
var $houseList = $("#house-list");
var CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/welcome2myhome/upload";
var CLOUDINARY_UPLOAD_PRESET = "j8seyt9p";
var imagePreview = document.getElementById("img-preview");
var fileUpload = document.getElementById("file-upload");
var tempUrl;
// $.cloudinary.config({ cloud_name: 'welcome2myhome', secure: true});

fileUpload.addEventListener("change", function(event) {
  var file = event.target.files[0];
  var formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  axios({
    url: CLOUDINARY_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: formData
  })
    .then(function(res) {
      console.log(res);
      imagePreview.src = res.data.secure_url;
      tempUrl = res.data.secure_url;
    })
    .catch(function(err) {
      console.log(err);
    });
});

// The API object contains methods for each kind of request we'll make
var API = {
  saveHouse: function(house) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/houses",
      data: JSON.stringify(house)
      // var house is being stringified before leading into saveHouse function
      // original data: JSON.stringify(house)
    });
  },
  getHouses: function() {
    return $.ajax({
      url: "api/houses",
      type: "GET"
    });
  },
  deleteHouse: function(id) {
    return $.ajax({
      url: "api/houses/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshHouses = function() {
  API.getHouses().then(function(data) {
    var $houses = data.map(function(house) {
      var $a = $("<a>")
        .text(house.place_name)
        .attr("href", "/house/" + house.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": house.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });
    $("#house-text").val("");
    $("#house-description").val("");
    $("#house-owner").val("");
    // $("place-photo").val("");
    $("host-address").val("");
    $("host-phone").val("");
    $("host-email").val("");
    $("host-network").val("");
    $("wifi-password").val("");
    $("house-alarm-key").val("");
    $houseList.empty();
    $houseList.append($houses);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  // photoUpload();

  var house = {
    place_name: $("#house-text")
      .val()
      .trim(),
    house_info: $("#house-description")
      .val()
      .trim(),
    host_name: $("#house-owner")
      .val()
      .trim(),
    place_photo: tempUrl,
    host_address: $("#house-address")
      .val()
      .trim(),
    host_phone: $("#house-phone")
      .val()
      .trim(),
    host_email: $("#house-email")
      .val()
      .trim(),
    wifi_password: $("#house-wifi-password")
      .val()
      .trim(),
    house_alarm_pw: $("#house-alarm-key")
      .val()
      .trim()
  };
  // console.log(house);
  // if (!(house.place_name && house.house_info)) {
  //   alert("You must enter house text and description!");
  //   return;
  // }
  API.saveHouse(house).then(function() {
    refreshHouses();
  });
  // take fields from inputs and put them into an object
  // insert that object into an array
  // display array of objects on screen
  module.exports = function(sequelize, DataTypes) {
    var EmergencyContact = sequelize.define(
      "EmergencyContact",
      {
        contact_name: DataTypes.TEXT,
        contact_email: DataTypes.TEXT,
        contact_phone: DataTypes.TEXT,
        contact_description: DataTypes.TEXT
      },
      {
        freezeTableName: true
      }
    );
    return EmergencyContact;
  };
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteHouse(idToDelete).then(function() {
    refreshHouses();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$houseList.on("click", ".delete", handleDeleteBtnClick);
