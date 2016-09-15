-- Luodaan tietokanta ja otetaan se käyttöön
CREATE DATABASE UserDatabase;
USE UserDatabase;

-- Luodaan käyttäjätunnustaulu
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int(12) NOT NULL AUTO_INCREMENT,
  `Username` varchar(20) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(20) NOT NULL,
  `Name` varchar (25) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Lisätään testihenkilöt
INSERT INTO users (Username, Email, Password, Name) VALUES ('Testaaja', 'testi@testaus.fi', '4321', 'Testimies');

INSERT INTO users (Username, Email, Password, Name) VALUES ('Admini', 'admini@testaus.fi', 'abcd', 'Adminmies');



