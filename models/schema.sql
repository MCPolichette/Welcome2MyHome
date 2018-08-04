DROP DATABASE IF EXISTS host_db;
CREATE DATABASE host_db;

USE host_db;

CREATE TABLE House
(
	id int NOT NULL AUTO_INCREMENT,
	host_name varchar(255) NOT NULL,
    place_name varchar(20) NULL,
    place_photo varchar(200) NULL,	
	host_address varchar(255) NOT NULL,
    host_phone INTEGER(11) NOT NULL,
    host_email varchar(100) NOT NULL,
    wifi_network varchar(200) NOT NULL,
    wifi_password varchar(200)  NOT NULL,
    house_alarm_pw varchar(200) NOT NULL, 
	createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
);

INSERT INTO House (host_name, place_name, place_photo, host_address, host_phone, host_email, wifi_network, wifi_password, house_alarm_pw, createdAt, updatedAt) 
VALUES ('Will Swensen', 'Shenandoa', '../public/images/test1.jpeg', '123 Sesame Street SLC, UT 84106', '8015554343', 'willy@yahoo.com', 'SWENSEN', 'TESTING', '1234', ' ', ' ');

INSERT INTO House (host_name, place_name, place_photo, host_address, host_phone, host_email, wifi_network, wifi_password, house_alarm_pw, createdAt, updatedAt) 
VALUES ('Clark Kent', 'Fortress of Solitude', '../public/images/test1.jpeg', '657 E. Maverick Ave SLC, UT 84106', '8015453432', 'clark_kent@yahoo.com', 'Kent Network', 'Cryptonite', '1111', ' ', ' ');

CREATE TABLE Emergency_Contact
(
	id int NOT NULL AUTO_INCREMENT,
	house_id INT(200) Null,
    contact_name varchar(255) NOT NULL,
	contact_email varchar(255) NOT NULL,
    contact_phone INTEGER(11) NOT NULL,
    contact_description varchar(144) NOT NULL,
    createdAt: TIMESTAMP NULL,
    updatedAT: TIMESTAMP NULL,
	PRIMARY KEY (id)
);

INSERT INTO Emergency_Contact (house_id, contact_name, contact_email, contact_phone, contact_description, createdAt, updatedAT) 
VALUES ('1', 'Henry Ellis', 'henry@hotmail.com', '2086753432', 'This is my good friend and neighbor he can help with just about anything', ' ', ' ');