-- MySQL dump 10.13  Distrib 8.0.46, for macos15 (arm64)
--
-- Host: mydatabase.cj8qkoiwq43t.us-east-2.rds.amazonaws.com    Database: rugato
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `cat_category`
--

DROP TABLE IF EXISTS `cat_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_active` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `last_updated` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_category`
--

LOCK TABLES `cat_category` WRITE;
/*!40000 ALTER TABLE `cat_category` DISABLE KEYS */;
INSERT INTO `cat_category` VALUES (1,'Licuados combinados','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(2,'Licuados sencillos','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(3,'Esquimos','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(4,'Bebidas Calientes','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(5,'Bocadillos','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(6,'Cocteles','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(7,'Jugos Sencillos','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(8,'Jugos Combinados','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(9,'Baguete Especial','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(10,'Ensaladas','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(11,'Ensaladas al gusto','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(12,'Aguas sencillas','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(13,'Aguas combinadas','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(14,'Sandwiches especiales','1','2025-08-19 13:45:35','2025-08-19 13:45:35'),(15,'Al gusto','1','2025-08-19 13:45:35','2025-08-19 13:45:35');
/*!40000 ALTER TABLE `cat_category` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 13:14:02
