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
-- Table structure for table `builds`
--

DROP TABLE IF EXISTS `builds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `builds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  `quantity_md` int DEFAULT NULL,
  `quantity_gr` int DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `ingredients_list` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `maximo` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_menu_builds` (`menu_id`),
  KEY `fk_ingredient_builds` (`ingredient_id`),
  CONSTRAINT `fk_ingredient_builds` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_menu_builds` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `builds`
--

LOCK TABLES `builds` WRITE;
/*!40000 ALTER TABLE `builds` DISABLE KEYS */;
INSERT INTO `builds` VALUES (1,73,1,0,0,'Fruta o verdura','Espinaca - Lechuga - Aceituna Negra - Zanahoria - Betabel - Jícama - Elote - Jitomate - Piña - Pepino - Germen de Alfalfa - Cebolla Morada','4','2025-10-31 16:29:37','2025-10-31 16:38:33'),(2,73,1,0,0,'Proteína','Pechuga a la plancha - Huevo Hervido - Queso Panela - Queso Manchego - Jamon de Pavo - Quesillo - Atun','1','2025-10-31 16:38:33','2025-10-31 16:38:33'),(3,73,1,0,0,'Aderezo','Mayonesa - Ranch - Mil islas - Blue Cheese - Aceite de Olivo - Cesar','1','2025-10-31 16:38:33','2025-10-31 16:38:33'),(8,78,1,0,0,'Base','Espinaca - Lechuga - Espinaca y lechuga','1','2025-11-21 18:44:26','2026-01-05 05:27:30'),(9,78,1,0,0,'Fruta o verdura','Pasta - Zanahoria - Betabel - Jícama - Elote - Jitomate - Calabaza - Aceituna negra - Germen de Alfalfa - Cebolla Morada - Brócoli - Champiñón - Verduras mixtas - Piña - Fresa - Pepino - Papaya - Melón - Manzana - Naranja - Frambuesa - Uva - Mora - Kiwi - Mango','4','2025-10-31 16:48:24','2025-10-31 16:48:24'),(10,78,1,0,0,'Cereal','Ajonjoli - Ajonjoli acaramelado - Amaranto - Pasas - Arándano - Cacahuate enchilado - Cacahuate tostado - Granola - Nuez - Avena - Semilla de girasol - Almendra - Semilla de calabaza','2','2025-10-31 16:48:24','2025-11-22 00:47:20'),(11,78,1,0,0,'Proteina','Jamón de pavo - Pechuga a la plancha - Queso panela - Queso manchego - Huevo hervido - Atún','1','2025-10-31 16:48:24','2025-10-31 16:48:24'),(12,78,1,0,0,'Aderezo','Ranch - Mil Islas - Mostaza miel - Blue Cheese - Aceite de olivo - Miel y limón - Hierbas finas - César - Italiana - Ranch cilantro','1','2025-10-31 16:48:24','2025-10-31 16:48:24'),(13,78,1,0,0,'Crunch','Tostaditos de maíz - Tiritas de maíz - Crutones naturales - Crutones hierbas finos','1','2025-10-31 16:48:24','2025-10-31 16:48:24'),(21,77,1,0,0,'Base','Espinaca - Lechuga - Espinaca y lechuga','1','2025-11-21 18:43:20','2026-01-05 05:26:39'),(22,77,1,0,0,'Fruta o verdura','Pasta - Zanahoria - Betabel - Jícama - Elote - Jitomate - Calabaza - Aceituna negra - Germen de Alfalfa - Cebolla Morada - Brócoli - Champiñón - Verduras mixtas - Piña - Fresa - Pepino - Papaya - Melón - Manzana - Naranja - Frambuesa - Uva - Mora - Kiwi - Mango','3','2025-10-31 16:48:23','2026-01-05 05:26:41'),(23,77,1,0,0,'Cereal','Ajonjoli - Ajonjoli acaramelado - Amaranto - Pasas - Arandano - Cacahuate enchilado - Cacahuate tostado - Granola - Nuez - Avena - Semilla de girasol - Almendra - Semilla de calabaza','2','2025-10-31 16:48:23','2026-01-05 05:28:49'),(24,77,1,0,0,'Proteina','Jamón de pavo - Pechuga a la plancha - Queso panela - Queso manchego - Huevo hervido - Atún','1','2025-10-31 16:48:23','2026-01-05 05:26:43'),(25,77,1,0,0,'Aderezo','Ranch - Mil Islas - Mostaza miel - Blue Cheese - Aceite de olivo - Miel y limón - Hierbas finas - César - Italiana - Ranch cilantro','1','2025-10-31 16:48:23','2026-01-05 05:26:44'),(26,77,1,0,0,'Crunch','Tostaditos de maíz - Tiritas de maíz - Crutones naturales - Crutones hierbas finas','1','2025-10-31 16:48:24','2026-01-05 05:26:45'),(37,73,NULL,NULL,NULL,'Picantes','Chipotle - Rajas - Sin picante','1','2026-03-18 23:58:06','2026-03-18 23:58:06');
/*!40000 ALTER TABLE `builds` ENABLE KEYS */;
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

-- Dump completed on 2026-04-24 13:14:07
