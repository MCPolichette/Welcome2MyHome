var $submitBtn = $("#submitContact");
var contactArray = []; 

// event listener for Contact submit button.
// on-click {
    var handleContactSubmit = function(event) {
        event.preventDefault();
        
        var emerContact = {
            contact_name: $("#emergency-contact-name"),
            contact_email: $("#emergency-contact0email"),
            contact_phone: $("#emergency-phone"),
            contact_description: $("#emergency-relationship")
        };
        console.log(emerContact);
        contactArray.push(emerContact);
    };
    
// on click form submit,
   // take array and for loop insert array of objects into contact form

   $submitBtn.on("click", handleContactSubmit);

// pull other form Functions from index.js to clean up code in the future