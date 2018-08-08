// Get references to page elements
var $houseText = $("#house-text");
var $houseDescription = $("#house-description");
var $submitBtn = $("#submit");
var $houseList = $("#house-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveHouse: function(house) {
    console.log("SAVE HOUSE" + house);
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/houses",
      data: house
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
    console.log("refreshHouses" + data);
    var $houses = data.map(function(house) {
      var $a = $("<a>")
        .text(house.text)
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

    $houseList.empty();
    $houseList.append($houses);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var house = {
    place_name: $("#house-text").val().trim(),
    house_info: $("#house-description").val().trim(),
    host_name: $("#house-owner").val().trim(),
    place_photo: $("#house-photo").val().trim(),
    host_address: $("#house-address").val().trim(),
    host_phone: $("#house-phone").val().trim(),
    host_email: $("#house-email").val().trim(),
    wifi_network: $("#house-wifi-network").val().trim(),
    wifi_password: $("#house-wifi-password").val().trim(),
    house_alarm_pw: $("#house-alarm-key").val().trim()
  };

  console.log("object build " + house);
  var houseString = JSON.stringify(house);
  // if (!(house.place_name && house.house_info)) {
  //   alert("You must enter house text and description!");
  //   return;
  // }

  API.saveHouse(houseString).then(function() {
    console.log("first house  " + houseString);
    refreshHouses();
  });
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
