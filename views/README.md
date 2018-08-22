![guestkey logo](/images/guestKey_logoBLK.png)

# Guest Key App

## **Overview:**
"Guest Key" is a full stack, MVC (Model-View-Controller) application that provides home owners a simplified approach in preparing their home for scheduled visitors, sitters, or drop-in guests.  The app is useful and simple, utilizing a familiar technology known as the Quick Response code (QR), giving each home owner their own unique "Guest Key" bar code.  The "Guest Key" is scanned to receive quick access information about their home, and is given to their guests and sitters, while they prepare their trip, and/or away on vacation. 

The responsive mobile app design allows images to be loaded automatically and adjusted for optimal viewing from any smart phone.  The home owner completes the forms embedded in the app ahead of time, entering their leave schedule, emergency contact information, and the specific details about the care of their home.  The need to remember wifi logins, home security codes, phone numbers, etc., is eliminated since information is stored in a secure, cloud-base data bank. 

The Guest Key bar code is  uniquely generated once the forms are completed by the home owner.  The Guest Key is then given to house guests and home sitters, at the discretion of the home owner.  The guests and home sitters then scans the "Guest Key" by the use of their smart phone,providing access to information about the home they are visiting or taking care of, in a convenient, personal, and stress-free manner.   

## **Contributors:**
Mark Polichette (Lead Backend/Frontend):  https://github.com/MCPolichette/Welcome2MyHome
Will Swensen (Backend/db/Cloudinary):* https://github.com/Ponker25
Connie Elbon (Frontend/writer): https://github.com/elkaleemom11

### **Technologies/Languages Used:**
1. Trello
1. MySQL
1. Node.js
1. Express
1. Handlebars
1. Sequelize
1. Javascript
1. HTML5/CSS3
1. API libraries-jQuery
1. Bootstrap Modals
1. Cloudinary
1. Heroku
1. Travis CI
1. QR Code
1. Smart phone

Trello provided a collaboration platform to guide our group's efforts by creating lists of tasks created and assigned to each web developer.  Categories of each task was provided within this application to label and to add content descriptors. Work flow was easily communicated and updated by moving task bars from "to do" to "done". Icebox contains those items that were left on "hold" for further development.

MySQL and Node are used to query and route data in the application. Express is used in the backend, providing the web development framework, while Handlebars provides the templates for HTML files.  Sequelize is an ORM (Object Relational Mapper), that assists in database management queries. HTML5/CSS3 are used to design and build the frontend, applying javascript (js) and js libraries (jQuery) to add dynamics and tie the backend to the frontend.  

Travis-CI was installed to protect the master branch during merging. Bootstrap modals is created for mobile applications, and provides a dialog box/popup window to be is displayed and accessible during client navigation and usage. 

Cloudinary is a new, cloud-based image upload and management system we used to provide data storage and CDN (Content Delivery Network).  Heroku is used to deploy and operate our application in the cloud.  The QR code and smart phone allows the bar code to be read and accessible to specified users, displaying all pertinent information about the home owner's house. 

**MVC Starter Template:**  The structure of the project was provided by the use of   boilerplate with the following files:


├── config
│   ├── config.json
│   
│ 
├── models
│   └── example.js
|    |__idex.js
│    |__schema.sql
|
├── node modules 
│   
│
├── public
│   └── js
|       |__index.js
|   |__ styles
|       |__styles.css
│ 
├── routes
│   |__apiRoutes.js
|
|   |__apiHTML.js
|      |__canary.test.js
|
├── views
|   |__layouts
|      |__main.handlebars
|      |__404.handlebars
|      |__example.handlebars
|      |__index.handlebars
│
├──.eslintignore
│  .eslintrc.json
|  .gitignore
|  .travis.yml
|   package-lock.json
|   package.json
|    
├── JS
|  |___server.js


### **Description and Function of Files used in App:**
1. The folder "config" contains contains the config.json file which contains the code to connect Node to JAWSDB MySQL.

![guestkey logo](/images/)

