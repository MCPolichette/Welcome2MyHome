// Get references to page elements
var $houseText = $("#house-text");
var $houseDescription = $("#house-description");
var $submitBtn = $("#submit");
var $houseList = $("#house-list");

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
    text: $houseText.val().trim(),
    description: $houseDescription.val().trim()
  };

  if (!(house.text && house.description)) {
    alert("You must enter house text and description!");
    return;
  }

  API.saveHouse(house).then(function() {
    refreshHouses();
  });

  $houseText.val("");
  $houseDescription.val("");
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
