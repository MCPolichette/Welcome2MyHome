DROP DATABASE IF EXISTS host_db;
CREATE DATABASE host_db;

USE host_db;

CREATE TABLE House
(
	id int NOT NULL AUTO_INCREMENT,
	host_name VARCHAR(255) NOT NULL,
    place_name VARCHAR(20) NULL,
    place_photo VARCHAR(200) NULL,	
    host_city VARCHAR(50) NULL,
    host_state VARCHAR(50) NULL,
    host_zip INTEGER(10) NULL,
    house_directions VARCHAR(300) NULL,
	host_address VARCHAR(255) NOT NULL,
    host_phone INTEGER(11) NOT NULL,
    host_email VARCHAR(100) NULL,
    host_notes  VARCHAR(200) NULL,
    wifi_network VARCHAR(200) NULL,
    wifi_password VARCHAR(200) NULL,
    house_alarm_pw VARCHAR(200) NULL, 
    house_info VARCHAR(200) NOT NULL, 
    departure_date VARCHAR(20) NULL,
    return_date VARCHAR(20),
    trip_destination VARCHAR (20) NULL,
    trip_phone INTEGER(20) NULL,
    trip_address VARCHAR(100) NULL,
    trip_state VARCHAR(50) NULL,
    trip_country VARCHAR(50) NULL,
    trip_notes VARCHAR(300) NULL,
    tv_directions VARCHAR(300) NULL,
    house_maintenance VARCHAR(300) NULL,
    house_rules VARCHAR(300) NULL,
	createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
);

INSERT INTO House (host_name, place_name, place_photo, host_address, host_phone, host_email, wifi_network, wifi_password, house_alarm_pw, house_info, createdAt, updatedAt) 
VALUES ('Will Swensen', 'Shenandoa', '../public/images/test1.jpeg', '123 Sesame Street SLC, UT 84106', '8015554343', 'willy@yahoo.com', 'SWENSEN', 'TESTING', '1234', 'garbage day on thursday, the plants have been watered', ' ', ' ');

INSERT INTO House (host_name, place_name, place_photo, host_address, host_phone, host_email, wifi_network, wifi_password, house_alarm_pw, house_info, createdAt, updatedAt) 
VALUES ('Clark Kent', 'Fortress of Solitude', '../public/images/test1.jpeg', '657 E. Maverick Ave SLC, UT 84106', '8015453432', 'clark_kent@yahoo.com', 'Kent Network', 'Cryptonite', '1111', 'lex luther may be my father but we are on bad terms', ' ', ' ');

CREATE TABLE Emergency_Contact
(
	id int NOT NULL AUTO_INCREMENT,
	house_id INT(200) Null,
    contact_name VARCHAR(255) NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
    contact_phone INTEGER(13) NOT NULL,
    contact_description VARCHAR(144) NOT NULL,
    createdAt TIMESTAMP NULL,
    updatedAT TIMESTAMP NULL,
	PRIMARY KEY (id)
);

INSERT INTO Emergency_Contact (house_id, contact_name, contact_email, contact_phone, contact_description, createdAt, updatedAT) 
VALUES ('1', 'Henry Ellis', 'henry@hotmail.com', '2086753432', 'This is my good friend and neighbor he can help with just about anything', ' ', ' ');
