// this form is currently not linked,
// I copied Connies Emergency contact Modal JS to go here, We will include the GET/POST features here as well


 // Validation of Required Fields -->
 // using Microsoft's CDN again to get the library. What we want to do next is to call the 
 // validation library in the jQuery function above to "attach" it to the form

 // This attaches the validation library to the form with the ID of "frm". It tells the library to validate the form when the submit button is pressed. 
 // The next thing we need to do is tell the library what fields are required.
 $(document).ready(function () {
     $("#frm").validate({
         rules: {
             firstName: {
                 required: true,
                 maxlength: 25
             },
             lastName: {
                 required: true,
                 maxlength: 25
             },
             relationship: {
                 required: true,
                 maxlength: 50
                },
             emergencyPhone: {
                 required: true,
                 maxlength: 10,
                 digits: true,
             }
         }
     });
 });
 // To validate a phone number written as xxx xxx xxxx, xxx.xxx.xxxx, or xxx-xxx-xxxx -->
 function phonenumber(inputtxt) {
     var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
     if ((inputtxt.value.match(phoneno)){
         return true;
     }
     else {
         alert("message");
         return false;
     }
 }
