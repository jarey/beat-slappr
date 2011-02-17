/******************************************/
/***CREATE DATABASE IF IT DOES NOT EXIST***/
/******************************************/

create database if not exists patternsketch;
use patternsketch;


/*******************/
/***CREATE TABLES***/
/*******************/

/******************************************
    USERS TABLE
    STORES ALL USERS OF THE APPLICATION
******************************************/

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(32) NOT NULL,
  `active` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;


/******************************************
    SOUND_KITS TABLE
    STORES ALL SOUND KIT DEFIINITIONS
******************************************/

DROP TABLE IF EXISTS `sound_kits`;
CREATE TABLE IF NOT EXISTS `sound_kits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;


/**************************************************
    SOUND_KIT_CHANNELS TABLE
    STORES ALL SOUND KIT CHANNEL SOUND DEFIINITIONS
**************************************************/

DROP TABLE IF EXISTS `sound_kit_channels`;
CREATE TABLE IF NOT EXISTS `sound_kit_channels` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `channel` int(11) NOT NULL,
  `ogg` mediumtext NOT NULL,
  `mp3` mediumtext NOT NULL,
  UNIQUE KEY `id` (`id`,`channel`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


/**************************************************
    SHARED_PATTERNS TABLE
    STORES ALL SOUND KIT CHANNEL SOUND DEFIINITIONS
**************************************************/

DROP TABLE IF EXISTS `shared_patterns`;
CREATE TABLE IF NOT EXISTS `shared_patterns` (
  `hash` varchar(32) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `sequence` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `hash` (`hash`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


/**************************************************
    PATTERNS TABLE
    STORES ALL USER PATTERNS
**************************************************/

DROP TABLE IF EXISTS `patterns`;
CREATE TABLE IF NOT EXISTS `patterns` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pattern` text NOT NULL,
  UNIQUE KEY `user_id` (`user_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


/*****************************************************
    SOUNDCLOUD TRACKS TABLE
    STORES INFO ABOUT TRACKS UPLOADED TO SLOUNDCLOUD
*****************************************************/

DROP TABLE IF EXISTS `soundcloud_tracks`;
CREATE TABLE IF NOT EXISTS `soundcloud_tracks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `track_id` int(11) NOT NULL DEFAULT '0',
  `track_name` varchar(255) DEFAULT NULL,
  `track_permalink` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_permalink` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;


/*****************************************************
    SOUNDCLOUD BATTLE TABLE
    STORES INFO ABOUT SOUNDCLOUD BATTLE OUTCOME
*****************************************************/

DROP TABLE IF EXISTS `soundcloud_battle`;
CREATE TABLE `soundcloud_battle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `winning_id` int(11) DEFAULT NULL,
  `losing_id` int(11) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
