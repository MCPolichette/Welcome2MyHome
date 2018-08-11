// a function that takes an url input and returns a QR code image.
module.exports = function(qrUrl) {
  // URL recieved by input
  var queryURL =
    "http(s)://api.qrserver.com/v1/create-qr-code/?data=" +
    qrUrl +
    " &size=200x200";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
  return response;
};
