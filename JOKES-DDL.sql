CREATE SCHEMA IF NOT EXISTS `jokes` DEFAULT CHARACTER SET utf8 ;
USE `jokes` ;

DROP TABLE IF EXISTS `jokes`.`jokes` ;

CREATE TABLE IF NOT EXISTS `jokes`.`jokes` (
  `idjoke` INT NOT NULL AUTO_INCREMENT,
  `language` VARCHAR(2) NOT NULL,
  `type` VARCHAR(7) NOT NULL,
  `category` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`idjoke`)
  );


DROP TABLE IF EXISTS `jokes`.`flags` ;

CREATE TABLE IF NOT EXISTS `jokes`.`flags` (
  `flag` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`flag`)
  );


DROP TABLE IF EXISTS `jokes`.`jokes_has_flags` ;

CREATE TABLE IF NOT EXISTS `jokes`.`jokes_has_flags` (
  `idjoke` INT NOT NULL,
  `flag` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`idjoke`, `flag`),
  INDEX `fk_jokes_has_flags_flags1_idx` (`flag` ASC) VISIBLE,
  INDEX `fk_jokes_has_flags_jokes_idx` (`idjoke` ASC) VISIBLE,
  CONSTRAINT `fk_jokes_has_flags_jokes`
    FOREIGN KEY (`idjoke`)
    REFERENCES `jokes`.`jokes` (`idjoke`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_jokes_has_flags_flags1`
    FOREIGN KEY (`flag`)
    REFERENCES `jokes`.`flags` (`flag`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    );

INSERT INTO flags VALUES ("nsfw"), ("religious"), ("political"), ("racist"), ("sexist"), ("explicit");

INSERT INTO jokes (idjoke, language, type, category) VALUES (