-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mar. 09 oct. 2018 à 07:37
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `hilive`
--

-- --------------------------------------------------------

--
-- Structure de la table `t_sales`
--

DROP TABLE IF EXISTS `t_sales`;
CREATE TABLE IF NOT EXISTS `t_sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_shop` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `baseprice` varchar(12) NOT NULL,
  `finalprice` varchar(12) NOT NULL,
  `discount` varchar(12) NOT NULL,
  `category` varchar(50) NOT NULL,
  `image` text,
  PRIMARY KEY (`id`),
  KEY `fk_to_shop_id` (`id_shop`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


--
-- Structure de la table `t_shops`
--

DROP TABLE IF EXISTS `t_shops`;
CREATE TABLE IF NOT EXISTS `t_shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(12,10) NOT NULL,
  `longitude` decimal(12,10) NOT NULL,
  `image` text,
  `email` varchar(100) NOT NULL,
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Structure de la table `t_users`
--

DROP TABLE IF EXISTS `t_users`;
CREATE TABLE IF NOT EXISTS `t_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
