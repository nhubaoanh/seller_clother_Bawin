-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothingshopdb
-- ------------------------------------------------------
-- Server version	8.0.41

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

--
-- Table structure for table `auditlogs`
--

DROP TABLE IF EXISTS `auditlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlogs` (
  `logId` varchar(50) NOT NULL,
  `tableName` varchar(100) DEFAULT NULL,
  `recordId` varchar(50) DEFAULT NULL,
  `actionType` int DEFAULT NULL,
  `description` text,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`logId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlogs`
--

LOCK TABLES `auditlogs` WRITE;
/*!40000 ALTER TABLE `auditlogs` DISABLE KEYS */;
INSERT INTO `auditlogs` VALUES ('LOG001','products','PROD001',0,'Tạo sản phẩm áo thun Uniqlo',1,'USR001','USR001','2026-03-05 18:37:14'),('LOG002','products','PROD002',0,'Tạo sản phẩm hoodie Nike',1,'USR001','USR001','2026-03-05 18:37:14'),('LOG003','orders','ORD001',1,'Nhân viên xác nhận đơn hàng',1,'USR002','USR002','2026-03-05 18:37:14'),('LOG004','orders','ORD002',1,'Cập nhật trạng thái giao hàng',1,'USR002','USR002','2026-03-05 18:37:14'),('LOG005','products','PROD003',2,'Ngừng bán sản phẩm Levi’s',1,'USR003','USR003','2026-03-05 18:37:14');
/*!40000 ALTER TABLE `auditlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `categoryId` varchar(50) NOT NULL,
  `categoryName` varchar(150) NOT NULL,
  `description` text,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('CAT001','Áo Thun','Áo thun thời trang nam nữ',1,'USR001','USR001','2026-03-05 18:35:06','2026-03-05 18:35:06'),('CAT002','Áo Khoác','Áo khoác mùa đông',1,'USR001','USR001','2026-03-05 18:35:06','2026-03-05 18:35:06'),('CAT003','Quần Jean','Quần jean nam nữ',1,'USR001','USR001','2026-03-05 18:35:06','2026-03-05 18:35:06'),('CAT004','Váy','Váy thời trang nữ',1,'USR001','USR001','2026-03-05 18:35:06','2026-03-05 18:35:06'),('CAT005','Áo Sơ Mi','Áo sơ mi công sở',1,'USR001','USR001','2026-03-05 18:35:06','2026-03-05 18:35:06');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventoryimports`
--

DROP TABLE IF EXISTS `inventoryimports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventoryimports` (
  `importId` varchar(50) NOT NULL,
  `variantId` varchar(50) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `purchasePrice` decimal(12,2) NOT NULL DEFAULT '0.00',
  `supplier` varchar(200) DEFAULT NULL,
  `notes` text,
  `activeFlag` int DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`importId`),
  KEY `variantId` (`variantId`),
  CONSTRAINT `inventoryimports_ibfk_1` FOREIGN KEY (`variantId`) REFERENCES `productvariants` (`variantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventoryimports`
--

LOCK TABLES `inventoryimports` WRITE;
/*!40000 ALTER TABLE `inventoryimports` DISABLE KEYS */;
INSERT INTO `inventoryimports` VALUES ('IMP1777633756202','VAR-PROD1777627347736',300,589998.00,'58oo58o958555774484844','djdjfejfejfe',1,'admin','admin','2026-05-01 18:09:16','2026-05-01 18:34:41');
/*!40000 ALTER TABLE `inventoryimports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `orderDetailId` varchar(50) NOT NULL,
  `orderId` varchar(50) DEFAULT NULL,
  `variantId` varchar(50) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`orderDetailId`),
  KEY `orderId` (`orderId`),
  KEY `variantId` (`variantId`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `productvariants` (`variantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES ('OD001','ORD001','VAR001',199000.00,1,1,'USR004','USR002','2026-03-05 18:36:27','2026-03-05 18:36:27'),('OD002','ORD002','VAR002',799000.00,1,1,'USR005','USR002','2026-03-05 18:36:27','2026-03-05 18:36:27'),('OD003','ORD003','VAR003',1299000.00,1,1,'USR004','USR003','2026-03-05 18:36:27','2026-03-05 18:36:27'),('OD004','ORD004','VAR004',599000.00,1,1,'USR005','USR002','2026-03-05 18:36:27','2026-03-05 18:36:27'),('OD005','ORD005','VAR005',399000.00,1,1,'USR004','USR003','2026-03-05 18:36:27','2026-03-05 18:36:27'),('OD1777629615237_kvtf5x','ORD1777629614923','VAR001',199000.00,1,1,'USR001','USR001','2026-05-01 17:00:15','2026-05-01 17:00:15'),('OD1777631087793_eij0wg','ORD1777631087726','VAR001',799000.00,5,1,'USR001','USR001','2026-05-01 17:24:47','2026-05-01 17:24:47');
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderId` varchar(50) NOT NULL,
  `userId` varchar(50) DEFAULT NULL,
  `totalPrice` decimal(12,2) DEFAULT NULL,
  `orderStatus` int DEFAULT '0',
  `shippingAddress` text,
  `phone` varchar(20) DEFAULT NULL,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`orderId`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('ORD001','USR004',199000.00,3,'Ha Noi','0912345678',1,'USR004','USR002','2026-03-05 18:36:08','2026-03-05 18:36:08'),('ORD002','USR005',799000.00,2,'Hai Duong','0913456789',1,'USR005','USR002','2026-03-05 18:36:08','2026-03-05 18:36:08'),('ORD003','USR004',1299000.00,1,'Ha Noi','0912345678',1,'USR004','USR003','2026-03-05 18:36:08','2026-03-05 18:36:08'),('ORD004','USR005',599000.00,0,'Hai Duong','0913456789',1,'USR005','USR002','2026-03-05 18:36:08','2026-03-05 18:36:08'),('ORD005','USR004',399000.00,3,'Ha Noi','0912345678',1,'USR004','USR003','2026-03-05 18:36:08','2026-03-05 18:36:08'),('ORD1777629614923','USR001',248900.00,1,'hà nội, quân 2, hà nội','09778685689',1,'USR001','USR001','2026-05-01 17:00:15','2026-05-01 17:00:15'),('ORD1777631087726','USR001',4394500.00,2,'hâh, hài linh, hà nội','0987789567',1,'USR001','admin_system','2026-05-01 17:24:47','2026-05-01 17:50:38');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymenthistory`
--

DROP TABLE IF EXISTS `paymenthistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymenthistory` (
  `historyId` varchar(50) NOT NULL,
  `paymentId` varchar(50) DEFAULT NULL,
  `oldStatus` int DEFAULT NULL,
  `newStatus` int DEFAULT NULL,
  `note` text,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`historyId`),
  KEY `paymentId` (`paymentId`),
  CONSTRAINT `paymenthistory_ibfk_1` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`paymentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymenthistory`
--

LOCK TABLES `paymenthistory` WRITE;
/*!40000 ALTER TABLE `paymenthistory` DISABLE KEYS */;
INSERT INTO `paymenthistory` VALUES ('PH001','PAY001',0,1,'Thanh toán COD thành công',1,'USR002','USR002','2026-03-05 18:36:55'),('PH002','PAY002',0,1,'Chuyển khoản ngân hàng thành công',1,'USR002','USR002','2026-03-05 18:36:55'),('PH003','PAY003',0,1,'Thanh toán MOMO thành công',1,'USR003','USR003','2026-03-05 18:36:55'),('PH004','PAY004',0,0,'Đơn hàng chưa thanh toán',1,'USR002','USR002','2026-03-05 18:36:55'),('PH005','PAY005',0,1,'Thanh toán ngân hàng thành công',1,'USR003','USR003','2026-03-05 18:36:55');
/*!40000 ALTER TABLE `paymenthistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `paymentId` varchar(50) NOT NULL,
  `orderId` varchar(50) DEFAULT NULL,
  `paymentMethod` int DEFAULT NULL,
  `paymentStatus` int DEFAULT '0',
  `amount` decimal(12,2) DEFAULT NULL,
  `transactionCode` varchar(100) DEFAULT NULL,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`paymentId`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('PAY001','ORD001',0,1,199000.00,'COD20240101',1,'USR004','USR002','2026-03-05 18:36:39','2026-03-05 18:36:39'),('PAY002','ORD002',1,1,799000.00,'BANK20240102',1,'USR005','USR002','2026-03-05 18:36:39','2026-03-05 18:36:39'),('PAY003','ORD003',2,1,1299000.00,'MOMO20240103',1,'USR004','USR003','2026-03-05 18:36:39','2026-03-05 18:36:39'),('PAY004','ORD004',0,0,599000.00,'COD20240104',1,'USR005','USR002','2026-03-05 18:36:39','2026-03-05 18:36:39'),('PAY005','ORD005',1,1,399000.00,'BANK20240105',1,'USR004','USR003','2026-03-05 18:36:39','2026-03-05 18:36:39'),('PAY1777629615320','ORD1777629614923',2,1,248900.00,NULL,1,'USR001','USR001','2026-05-01 17:00:15','2026-05-01 17:00:15'),('PAY1777631087803','ORD1777631087726',2,1,4394500.00,NULL,1,'USR001','USR001','2026-05-01 17:24:47','2026-05-01 17:24:47');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimages`
--

DROP TABLE IF EXISTS `productimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimages` (
  `imageId` varchar(50) NOT NULL,
  `productId` varchar(50) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`imageId`),
  KEY `productId` (`productId`),
  CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimages`
--

LOCK TABLES `productimages` WRITE;
/*!40000 ALTER TABLE `productimages` DISABLE KEYS */;
INSERT INTO `productimages` VALUES ('IMG001','PROD001','/uploads/products/2026/05/01/1777603211315_lhv9zh.png',0,'USR001','USR001','2026-03-05 18:35:52','2026-03-05 18:35:52'),('IMG002','PROD002','/uploads/products/2026/05/01/1777603299260_huhdwt.png',0,'USR001','USR001','2026-03-05 18:35:52','2026-03-05 18:35:52'),('IMG003','PROD003','/uploads/products/2026/05/01/1777603443850_uftln5.png',0,'USR001','USR001','2026-03-05 18:35:52','2026-03-05 18:35:52'),('IMG004','PROD004','/uploads/products/2026/05/01/1777604272193_r7vs82.jpg',0,'USR001','USR001','2026-03-05 18:35:52','2026-03-05 18:35:52'),('IMG005','PROD005','/uploads/products/2026/05/01/1777604590037_p3l14o.jpg',0,'USR001','USR001','2026-03-05 18:35:52','2026-03-05 18:35:52'),('IMG006','PROD001','/uploads/products/2026/05/01/1777603526457_jxrv83.png',0,'USR001','USR001','2026-05-01 11:24:08','2026-05-01 11:24:08'),('IMG007','PROD001','/uploads/products/2026/05/01/1777603774910_jxss7q.png',0,'USR001','USR001','2026-05-01 11:24:08','2026-05-01 11:24:08'),('IMG008','PROD002','/uploads/products/2026/05/01/1777604170670_qchfef.png',0,'USR001','USR001','2026-05-01 11:24:08','2026-05-01 11:24:08'),('IMG009','PROD002','/uploads/products/2026/05/01/1777604252841_yzgh1a.png',0,'USR001','USR001','2026-05-01 11:24:08','2026-05-01 11:24:08'),('IMG010','PROD003','/uploads/products/2026/05/01/1777604300908_gz16td.png',0,'USR001','USR001','2026-05-01 11:24:08','2026-05-01 11:24:08'),('IMG1777633361938gj7ydj','PROD001','/uploads/products/2026/05/01/1777627790593_lcvxv7.jpg',1,'admin','admin','2026-05-01 18:02:41','2026-05-01 18:02:41'),('IMG177763339246676hm8n','PROD002','/uploads/products/2026/05/01/1777627817698_zm5d9v.jpg',1,'admin','admin','2026-05-01 18:03:12','2026-05-01 18:03:12'),('IMG1777633403120uxyiwn','PROD003','/uploads/products/2026/05/01/1777627851733_93ur2e.jpg',1,'admin','admin','2026-05-01 18:03:23','2026-05-01 18:03:23'),('IMG177763341481225xi1s','PROD004','/uploads/products/2026/05/01/1777627883584_os7ylg.jpg',1,'admin','admin','2026-05-01 18:03:34','2026-05-01 18:03:34'),('IMG1777633422876ls6ui','PROD005','/uploads/products/2026/05/01/1777627911732_dovy6j.jpg',1,'admin','admin','2026-05-01 18:03:42','2026-05-01 18:03:42'),('IMG1777636261285dfiga','PROD1777636261103','/uploads/products/2026/05/01/1777636222705_zyrsrd.jpg',1,'admin','admin','2026-05-01 18:51:01','2026-05-01 18:51:01');
/*!40000 ALTER TABLE `productimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productId` varchar(50) NOT NULL,
  `productName` varchar(200) NOT NULL,
  `categoryId` varchar(50) DEFAULT NULL,
  `description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `basePrice` decimal(12,2) DEFAULT NULL,
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`productId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('PROD001','Áo Thun nữ basic','CAT001','Áo thun cotton mềm mại fbghghg','/uploads/products/2026/05/01/1777627790593_lcvxv7.jpg',199000.00,1,'USR001',NULL,'2026-03-05 18:35:17','2026-05-01 18:02:41'),('PROD002','Áo thun nam be nỉ','CAT001','Áo hoodie thể thao','/uploads/products/2026/05/01/1777627817698_zm5d9v.jpg',799000.00,1,'USR001',NULL,'2026-03-05 18:35:17','2026-05-01 18:03:12'),('PROD003','Áo nữ cute','CAT005','áo nữ chính hãng','/uploads/products/2026/05/01/1777627851733_93ur2e.jpg',1299000.00,1,'USR001',NULL,'2026-03-05 18:35:17','2026-05-01 18:03:23'),('PROD004','áo nữ điệu đà','CAT005','áo mùa hè Zara','/uploads/products/2026/05/01/1777627883584_os7ylg.jpg',599000.00,1,'USR001',NULL,'2026-03-05 18:35:17','2026-05-01 18:03:34'),('PROD005','Áo Sơ Mi nữ hoa hồng','CAT005','Áo sơ mi công sở','/uploads/products/2026/05/01/1777627911732_dovy6j.jpg',399000.00,1,'USR001',NULL,'2026-03-05 18:35:17','2026-05-01 18:03:42'),('PROD1777627347736','Áo thun nam siêu mát','CAT001','quá đẹp luôn','/uploads/products/2026/05/01/1777627753227_xuw8ve.jpg',300000.00,1,NULL,NULL,'2026-05-01 16:22:27','2026-05-01 16:29:31'),('PROD1777636261103','áo nữ colll ngầu','CAT001','cite quá đi nè','/uploads/products/2026/05/01/1777636222705_zyrsrd.jpg',200000.00,1,NULL,NULL,'2026-05-01 18:51:01','2026-05-01 18:51:01');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productvariants`
--

DROP TABLE IF EXISTS `productvariants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productvariants` (
  `variantId` varchar(50) NOT NULL,
  `productId` varchar(50) NOT NULL,
  `size` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`variantId`),
  KEY `productId` (`productId`),
  CONSTRAINT `productvariants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productvariants`
--

LOCK TABLES `productvariants` WRITE;
/*!40000 ALTER TABLE `productvariants` DISABLE KEYS */;
INSERT INTO `productvariants` VALUES ('VAR-101862860065341440','PROD1777636261103','Free','Default',200000.00,100,1,NULL,NULL,'2026-05-01 18:51:01','2026-05-01 18:51:01'),('VAR-PROD1777627347736','PROD1777627347736','Free','Default',799000.00,3100,1,NULL,'admin','2026-05-01 16:22:27','2026-05-01 18:09:16'),('VAR001','PROD001','M','White',199000.00,50,1,'USR001','USR001','2026-03-05 18:35:38','2026-03-05 18:35:38'),('VAR002','PROD002','L','Black',799000.00,30,1,'USR001','USR001','2026-03-05 18:35:38','2026-03-05 18:35:38'),('VAR003','PROD003','32','Blue',1299000.00,20,1,'USR001','USR001','2026-03-05 18:35:38','2026-03-05 18:35:38'),('VAR004','PROD004','S','Red',599000.00,15,1,'USR001','USR001','2026-03-05 18:35:38','2026-03-05 18:35:38'),('VAR005','PROD005','L','White',399000.00,40,1,'USR001','USR001','2026-03-05 18:35:38','2026-03-05 18:35:38');
/*!40000 ALTER TABLE `productvariants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `role` int DEFAULT '1',
  `activeFlag` tinyint DEFAULT '1',
  `userCreateId` varchar(50) DEFAULT NULL,
  `luUserId` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('USR001','admin','123456','nguyễn văn hùng','admin@fashion.com','09777786456','hải dương, thanh miện',1,1,'USR001','USR001','2026-03-05 18:34:47','2026-05-01 19:08:09'),('USR002','staff01','123456','Tran Thi Linh','linh@fashion.com','0902345678','Hai Phong',0,1,'USR001','USR002','2026-03-05 18:34:47','2026-03-05 18:34:47'),('USR003','staff02','123456','Le Minh Duc','duc@fashion.com','0903456789','Da Nang',0,1,'USR001','USR003','2026-03-05 18:34:47','2026-03-05 18:34:47'),('USR004','customer01','123456','Pham Thu Trang','trang@gmail.com','0912345678','Ha Noi',1,1,'USR001','USR004','2026-03-05 18:34:47','2026-03-05 18:34:47'),('USR005','customer02','123456','Nguyen Hoang Anh','hoanganh@gmail.com','0913456789','Hai Duong',1,1,'USR001','USR005','2026-03-05 18:34:47','2026-03-05 18:34:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'clothingshopdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `CreateProduct` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `CreateProduct`(
    IN p_productId VARCHAR(50),
    IN p_productName VARCHAR(200),
    IN p_categoryId VARCHAR(50),
    IN p_description TEXT,
    IN p_thumbnail VARCHAR(255),
    IN p_basePrice DECIMAL(12,2),
    IN p_userCreateId VARCHAR(50),
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
        ROLLBACK;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    START TRANSACTION;

    -- Kiểm tra sản phẩm đã tồn tại
    IF EXISTS (SELECT 1 FROM products WHERE productId = p_productId) THEN
        SET p_error_code = 1;
        SET p_error_message = 'Sản phẩm đã tồn tại';
        ROLLBACK;
    ELSE
        INSERT INTO products (
            productId,
            productName,
            categoryId,
            description,
            thumbnail,
            basePrice,
            activeFlag,
            userCreateId,
            luUserId,
            createdAt,
            updatedAt
        ) VALUES (
            p_productId,
            p_productName,
            p_categoryId,
            p_description,
            p_thumbnail,
            p_basePrice,
            1,
            p_userCreateId,
            p_userCreateId,
            NOW(),
            NOW()
        );

        COMMIT;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllProducts` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `GetAllProducts`(
    IN p_pageIndex INT,
    IN p_pageSize INT,
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE p_total_row INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    IF p_pageSize <> 0 THEN
        DROP TEMPORARY TABLE IF EXISTS ProductResults;
        
        CREATE TEMPORARY TABLE ProductResults AS
        SELECT 
            (@row_number := @row_number + 1) AS RowNumber,
            t.*
        FROM (
            SELECT 
                p.productId,
                p.productName,
                p.categoryId,
                c.categoryName,
                p.description,
                p.thumbnail,
                p.basePrice,
                p.activeFlag,
                p.createdAt,
                p.updatedAt,
                -- Thông tin variants
                COUNT(DISTINCT pv.variantId) as variantCount,
                COALESCE(SUM(pv.stock), 0) as totalStock,
                MIN(pv.price) as minPrice,
                MAX(pv.price) as maxPrice,
                -- Thông tin images
                GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
                -- Thông tin đánh giá (giả lập)
                ROUND(4.0 + (RAND() * 1.0), 1) as rating,
                FLOOR(10 + (RAND() * 200)) as ratingCount,
                FLOOR(RAND() * 100) as soldCount
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.categoryId
            LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
            LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
            WHERE p.activeFlag = 1
            GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
                     p.description, p.thumbnail, p.basePrice, p.activeFlag,
                     p.createdAt, p.updatedAt
            ORDER BY p.createdAt DESC
        ) t
        CROSS JOIN (SELECT @row_number := 0) r;

        SELECT COUNT(*) INTO p_total_row FROM ProductResults;

        SELECT *, p_total_row AS RecordCount
        FROM ProductResults
        WHERE RowNumber BETWEEN ((p_pageIndex - 1) * p_pageSize) + 1 AND (p_pageIndex * p_pageSize);

        DROP TEMPORARY TABLE ProductResults;
    ELSE
        SELECT 
            p.productId,
            p.productName,
            p.categoryId,
            c.categoryName,
            p.description,
            p.thumbnail,
            p.basePrice,
            p.activeFlag,
            p.createdAt,
            p.updatedAt,
            COUNT(DISTINCT pv.variantId) as variantCount,
            COALESCE(SUM(pv.stock), 0) as totalStock,
            MIN(pv.price) as minPrice,
            MAX(pv.price) as maxPrice,
            GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
            ROUND(4.0 + (RAND() * 1.0), 1) as rating,
            FLOOR(10 + (RAND() * 200)) as ratingCount,
            FLOOR(RAND() * 100) as soldCount,
            COUNT(*) OVER() AS RecordCount
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.categoryId
        LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
        LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
        WHERE p.activeFlag = 1
        GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
                 p.description, p.thumbnail, p.basePrice, p.activeFlag,
                 p.createdAt, p.updatedAt
        ORDER BY p.createdAt DESC;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetProductById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `GetProductById`(
    IN p_productId VARCHAR(50),
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    SELECT 
        p.productId,
        p.productName,
        p.categoryId,
        c.categoryName,
        p.description,
        p.thumbnail,
        p.basePrice,
        p.activeFlag,
        p.createdAt,
        p.updatedAt,
        -- Thông tin variants
        COUNT(DISTINCT pv.variantId) as variantCount,
        COALESCE(SUM(pv.stock), 0) as totalStock,
        MIN(pv.price) as minPrice,
        MAX(pv.price) as maxPrice,
        -- Thông tin images
        GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
        -- Thông tin đánh giá
        ROUND(4.0 + (RAND() * 1.0), 1) as rating,
        FLOOR(10 + (RAND() * 200)) as ratingCount,
        FLOOR(RAND() * 100) as soldCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
    LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
    WHERE p.productId = p_productId AND p.activeFlag = 1
    GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
             p.description, p.thumbnail, p.basePrice, p.activeFlag,
             p.createdAt, p.updatedAt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetProductsByCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `GetProductsByCategory`(
    IN p_categoryId VARCHAR(50),
    IN p_pageIndex INT,
    IN p_pageSize INT,
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE p_total_row INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    IF p_pageSize <> 0 THEN
        DROP TEMPORARY TABLE IF EXISTS CategoryResults;
        
        CREATE TEMPORARY TABLE CategoryResults AS
        SELECT 
            (@row_number := @row_number + 1) AS RowNumber,
            t.*
        FROM (
            SELECT 
                p.productId,
                p.productName,
                p.categoryId,
                c.categoryName,
                p.description,
                p.thumbnail,
                p.basePrice,
                p.activeFlag,
                p.createdAt,
                p.updatedAt,
                COUNT(DISTINCT pv.variantId) as variantCount,
                COALESCE(SUM(pv.stock), 0) as totalStock,
                MIN(pv.price) as minPrice,
                MAX(pv.price) as maxPrice,
                GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
                ROUND(4.0 + (RAND() * 1.0), 1) as rating,
                FLOOR(10 + (RAND() * 200)) as ratingCount,
                FLOOR(RAND() * 100) as soldCount
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.categoryId
            LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
            LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
            WHERE p.activeFlag = 1 AND p.categoryId = p_categoryId
            GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
                     p.description, p.thumbnail, p.basePrice, p.activeFlag,
                     p.createdAt, p.updatedAt
            ORDER BY p.createdAt DESC
        ) t
        CROSS JOIN (SELECT @row_number := 0) r;

        SELECT COUNT(*) INTO p_total_row FROM CategoryResults;

        SELECT *, p_total_row AS RecordCount
        FROM CategoryResults
        WHERE RowNumber BETWEEN ((p_pageIndex - 1) * p_pageSize) + 1 AND (p_pageIndex * p_pageSize);

        DROP TEMPORARY TABLE CategoryResults;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetProductVariants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `GetProductVariants`(
    IN p_productId VARCHAR(50),
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    SELECT 
        pv.variantId,
        pv.productId,
        pv.size,
        pv.color,
        pv.price,
        pv.stock,
        pv.activeFlag,
        pv.createdAt,
        pv.updatedAt,
        p.productName,
        p.thumbnail
    FROM productVariants pv
    LEFT JOIN products p ON pv.productId = p.productId
    WHERE pv.productId = p_productId 
    AND pv.activeFlag = 1 
    AND p.activeFlag = 1
    ORDER BY pv.size, pv.color;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_AddImportStock` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_AddImportStock`(
    IN p_importId VARCHAR(50),
    IN p_variantId VARCHAR(50),
    IN p_quantity INT,
    IN p_purchasePrice DECIMAL(12,2),
    IN p_supplier VARCHAR(200),
    IN p_notes TEXT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    -- Thêm bản ghi vào lịch sử nhập
    INSERT INTO inventoryImports (
        importId, variantId, quantity, purchasePrice, supplier, notes, 
        activeFlag, userCreateId, luUserId
    ) VALUES (
        p_importId, p_variantId, p_quantity, p_purchasePrice, p_supplier, p_notes, 
        1, p_adminId, p_adminId
    );
    
    -- Cập nhật số lượng tồn trong bảng biến thể sản phẩm
    UPDATE productVariants 
    SET stock = stock + p_quantity,
        luUserId = p_adminId,
        updatedAt = NOW()
    WHERE variantId = p_variantId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_DeleteCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_DeleteCategory`(
    IN p_categoryId VARCHAR(50),
    IN p_adminId VARCHAR(50)
)
BEGIN
    UPDATE categories SET activeFlag = 0, luUserId = p_adminId, updatedAt = NOW() WHERE categoryId = p_categoryId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_DeleteProduct` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_DeleteProduct`(
    IN p_productId VARCHAR(50),
    IN p_adminId VARCHAR(50)
)
BEGIN
    UPDATE products SET activeFlag = 0, luUserId = p_adminId, updatedAt = NOW() WHERE productId = p_productId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_GetAllOrders` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_GetAllOrders`()
BEGIN
    SELECT o.*, u.fullName, u.email, p.paymentMethod, p.paymentStatus
    FROM orders o
    JOIN users u ON o.userId = u.userId
    LEFT JOIN payments p ON o.orderId = p.orderId
    WHERE o.activeFlag = 1
    ORDER BY o.createdAt DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_GetDashboardStats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_GetDashboardStats`()
BEGIN
    -- Doanh thu, Chi phí, Lợi nhuận
    SELECT 
        (SELECT COALESCE(SUM(totalPrice), 0) FROM orders WHERE orderStatus IN (1, 2, 3) AND activeFlag = 1) as totalRevenue,
        (SELECT COALESCE(SUM(quantity * purchasePrice), 0) FROM inventoryImports WHERE activeFlag = 1) as totalImportCost,
        (SELECT COUNT(*) FROM orders WHERE activeFlag = 1) as totalOrders,
        (SELECT COUNT(*) FROM users WHERE activeFlag = 1) as totalCustomers;
        
    -- Trạng thái đơn hàng
    SELECT orderStatus, COUNT(*) as count 
    FROM orders 
    WHERE activeFlag = 1 
    GROUP BY orderStatus;
    
    -- Top 5 sản phẩm bán chạy
    SELECT p.productName, SUM(od.quantity) as totalSold, SUM(od.price * od.quantity) as revenue
    FROM orderDetails od
    JOIN productVariants pv ON od.variantId = pv.variantId
    JOIN products p ON pv.productId = p.productId
    JOIN orders o ON od.orderId = o.orderId
    WHERE o.orderStatus IN (1, 2, 3)
    GROUP BY p.productId, p.productName
    ORDER BY totalSold DESC
    LIMIT 5;

    -- Doanh thu 6 tháng gần nhất (để vẽ biểu đồ)
    SELECT 
        DATE_FORMAT(createdAt, '%m/%Y') as month_label,
        SUM(totalPrice) as revenue,
        DATE_FORMAT(createdAt, '%Y-%m') as month_key
    FROM orders
    WHERE orderStatus IN (1, 2, 3) AND activeFlag = 1
    AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY month_key, month_label
    ORDER BY month_key ASC;

    -- 5 đơn hàng mới nhất
    SELECT o.orderId, u.fullName as customer_name, o.totalPrice, o.orderStatus, o.createdAt
    FROM orders o
    LEFT JOIN users u ON o.userId = u.userId
    WHERE o.activeFlag = 1
    ORDER BY o.createdAt DESC
    LIMIT 5;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_GetImportHistory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_GetImportHistory`(
    IN p_search VARCHAR(150),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT i.*, p.productName, pv.size, pv.color,
           (SELECT COUNT(*) FROM inventoryImports i2 
            JOIN productVariants pv2 ON i2.variantId = pv2.variantId
            JOIN products p2 ON pv2.productId = p2.productId
            WHERE i2.activeFlag = 1 AND (p_search = '' OR p2.productName LIKE CONCAT('%', p_search, '%'))) as RecordCount
    FROM inventoryImports i
    JOIN productVariants pv ON i.variantId = pv.variantId
    JOIN products p ON pv.productId = p.productId
    WHERE i.activeFlag = 1
      AND (p_search = '' OR p.productName LIKE CONCAT('%', p_search, '%'))
    ORDER BY i.createdAt DESC
    LIMIT v_offset, p_pageSize;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_GetStockReport` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_GetStockReport`()
BEGIN
    SELECT 
        p.productId,
        p.productName,
        pv.variantId,
        pv.size,
        pv.color,
        -- Tổng đã nhập
        COALESCE((SELECT SUM(quantity) FROM inventoryImports WHERE variantId = pv.variantId AND activeFlag = 1), 0) as totalImported,
        -- Tổng đã bán (Chỉ tính các đơn đã hoàn thành hoặc đã thanh toán)
        COALESCE((SELECT SUM(od.quantity) 
                  FROM orderDetails od 
                  JOIN orders o ON od.orderId = o.orderId 
                  WHERE od.variantId = pv.variantId AND o.orderStatus IN (1, 2, 3)), 0) as totalSold,
        -- Tồn kho hiện tại
        pv.stock as currentStock
    FROM productVariants pv
    JOIN products p ON pv.productId = p.productId
    WHERE pv.activeFlag = 1
    ORDER BY p.productName ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_UpdateOrderStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_UpdateOrderStatus`(
    IN p_orderId VARCHAR(50),
    IN p_status INT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    UPDATE orders 
    SET orderStatus = p_status, 
        luUserId = p_adminId, 
        updatedAt = NOW() 
    WHERE orderId = p_orderId;
    
    -- Ghi log audit nếu cần
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_UpsertCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_UpsertCategory`(
    IN p_categoryId VARCHAR(50),
    IN p_categoryName VARCHAR(150),
    IN p_description TEXT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE categoryId = p_categoryId) THEN
        UPDATE categories 
        SET categoryName = p_categoryName,
            description = p_description,
            luUserId = p_adminId,
            updatedAt = NOW()
        WHERE categoryId = p_categoryId;
    ELSE
        INSERT INTO categories (categoryId, categoryName, description, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
        VALUES (p_categoryId, p_categoryName, p_description, 1, p_adminId, p_adminId, NOW(), NOW());
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_Admin_UpsertProduct` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_Admin_UpsertProduct`(
    IN p_productId VARCHAR(50),
    IN p_productName VARCHAR(200),
    IN p_categoryId VARCHAR(50),
    IN p_description TEXT,
    IN p_thumbnail VARCHAR(255),
    IN p_basePrice DECIMAL(12,2),
    IN p_stock INT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM products WHERE productId = p_productId) THEN
        UPDATE products 
        SET productName = p_productName,
            categoryId = p_categoryId,
            description = p_description,
            thumbnail = p_thumbnail,
            basePrice = p_basePrice,
            luUserId = p_adminId,
            updatedAt = NOW()
        WHERE productId = p_productId;
    ELSE
        INSERT INTO products (productId, productName, categoryId, description, thumbnail, basePrice, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
        VALUES (p_productId, p_productName, p_categoryId, p_description, p_thumbnail, p_basePrice, 1, p_adminId, p_adminId, NOW(), NOW());
        
        -- Tự động tạo một biến thể mặc định để có tồn kho ngay lập tức
        INSERT INTO productVariants (variantId, productId, size, color, price, stock, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
        VALUES (CONCAT('VAR-', UUID_SHORT()), p_productId, 'Free', 'Default', p_basePrice, p_stock, 1, p_adminId, p_adminId, NOW(), NOW());
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_CreateOrderDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_CreateOrderDetail`(
    IN p_orderDetailId VARCHAR(50),
    IN p_orderId VARCHAR(50),
    IN p_variantId VARCHAR(50),
    IN p_price DECIMAL(12,2),
    IN p_quantity INT,
    IN p_userId VARCHAR(50)
)
BEGIN
    INSERT INTO orderDetails (orderDetailId, orderId, variantId, price, quantity, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
    VALUES (p_orderDetailId, p_orderId, p_variantId, p_price, p_quantity, 1, p_userId, p_userId, NOW(), NOW());
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_CreateOrderHeader` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_CreateOrderHeader`(
    IN p_orderId VARCHAR(50),
    IN p_userId VARCHAR(50),
    IN p_totalPrice DECIMAL(12,2),
    IN p_shippingAddress TEXT,
    IN p_phone VARCHAR(20)
)
BEGIN
    INSERT INTO orders (orderId, userId, totalPrice, orderStatus, shippingAddress, phone, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
    VALUES (p_orderId, p_userId, p_totalPrice, 0, p_shippingAddress, p_phone, 1, p_userId, p_userId, NOW(), NOW());
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_CreatePayment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_CreatePayment`(
    IN p_paymentId VARCHAR(50),
    IN p_orderId VARCHAR(50),
    IN p_paymentMethod INT,
    IN p_amount DECIMAL(12,2),
    IN p_userId VARCHAR(50)
)
BEGIN
    INSERT INTO payments (paymentId, orderId, paymentMethod, paymentStatus, amount, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
    VALUES (p_paymentId, p_orderId, p_paymentMethod, 0, p_amount, 1, p_userId, p_userId, NOW(), NOW());
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_GetMyOrders` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_GetMyOrders`(
    IN p_userId VARCHAR(50)
)
BEGIN
    SELECT o.*, p.paymentMethod, p.paymentStatus, p.paymentId 
    FROM orders o 
    LEFT JOIN payments p ON o.orderId = p.orderId 
    WHERE o.userId = p_userId 
    ORDER BY o.createdAt DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_GetMyOrders_Single` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_GetMyOrders_Single`(
    IN p_orderId VARCHAR(50)
)
BEGIN
    SELECT o.*, p.paymentMethod, p.paymentStatus, p.paymentId 
    FROM orders o 
    LEFT JOIN payments p ON o.orderId = p.orderId 
    WHERE o.orderId = p_orderId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_GetOrderDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_GetOrderDetails`(
    IN p_orderId VARCHAR(50)
)
BEGIN
    SELECT od.*, pv.size, pv.color, p.productName, p.thumbnail
    FROM orderDetails od
    JOIN productVariants pv ON od.variantId = pv.variantId
    JOIN products p ON pv.productId = p.productId
    WHERE od.orderId = p_orderId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_GetProductById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_GetProductById`(
    IN p_productId VARCHAR(50)
)
BEGIN
    SELECT p.productId,
           p.productName,
           p.categoryId,
           c.categoryName,
           p.description,
           p.thumbnail,
           p.basePrice,
           p.activeFlag,
           p.createdAt,
           p.updatedAt,
           -- Variants info
           COALESCE(SUM(pv.stock), 0) as totalStock,
           COUNT(DISTINCT pv.variantId) as variantCount,
           MIN(pv.price) as minPrice,
           MAX(pv.price) as maxPrice,
           -- Images info
           (SELECT GROUP_CONCAT(imageUrl) FROM productImages WHERE productId = p.productId AND activeFlag = 1) as images,
           -- Dummy data
           4.5 as rating,
           120 as ratingCount,
           50 as soldCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
    WHERE p.productId = p_productId AND p.activeFlag = 1
    GROUP BY p.productId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_GetUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_GetUser`(
    IN p_userId VARCHAR(50)
)
BEGIN
    SELECT userId, username, fullName, email, phone, address, role 
    FROM users 
    WHERE userId = p_userId AND activeFlag = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_LoginUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_LoginUser`(
    IN p_email VARCHAR(150)
)
BEGIN
    SELECT * FROM users 
    WHERE (email = p_email OR username = p_email) 
    AND activeFlag = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_SearchCategories` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_SearchCategories`(
    IN p_search VARCHAR(150),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT *, 
           (SELECT COUNT(*) FROM categories WHERE activeFlag = 1 AND (categoryName LIKE CONCAT('%', p_search, '%') OR description LIKE CONCAT('%', p_search, '%'))) as RecordCount
    FROM categories
    WHERE activeFlag = 1
      AND (p_search = '' OR categoryName LIKE CONCAT('%', p_search, '%') OR description LIKE CONCAT('%', p_search, '%'))
    LIMIT v_offset, p_pageSize;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_SearchUsers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_SearchUsers`(
    IN p_search VARCHAR(150),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT userId as user_id, 
           username, 
           fullName as full_name, 
           email, 
           phone, 
           address, 
           role as role_code, 
           role as role_name,
           activeFlag as active_flag, 
           1 as online_flag,
           (SELECT COUNT(*) FROM users WHERE activeFlag = 1 AND (p_search = '' OR username LIKE CONCAT('%', p_search, '%') OR fullName LIKE CONCAT('%', p_search, '%'))) as RecordCount
    FROM users
    WHERE activeFlag = 1
      AND (p_search = '' OR username LIKE CONCAT('%', p_search, '%') OR fullName LIKE CONCAT('%', p_search, '%'))
    ORDER BY createdAt DESC
    LIMIT v_offset, p_pageSize;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Proc_UpdatePaymentStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `Proc_UpdatePaymentStatus`(
    IN p_orderId VARCHAR(50),
    IN p_status INT
)
BEGIN
    UPDATE payments SET paymentStatus = p_status WHERE orderId = p_orderId;
    
    IF p_status = 1 THEN
        UPDATE orders SET orderStatus = 1 WHERE orderId = p_orderId;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SearchProducts` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `SearchProducts`(
    IN p_search VARCHAR(200),
    IN p_categoryId VARCHAR(50),
    IN p_minPrice DECIMAL(12,2),
    IN p_maxPrice DECIMAL(12,2),
    IN p_sortBy VARCHAR(50),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT p.productId,
           p.productName,
           p.categoryId,
           c.categoryName,
           p.description,
           p.thumbnail,
           p.basePrice,
           p.activeFlag,
           p.createdAt,
           p.updatedAt,
           COALESCE(SUM(pv.stock), 0) as totalStock,
           COUNT(DISTINCT pv.variantId) as variantCount,
           MIN(pv.price) as minPrice,
           MAX(pv.price) as maxPrice,
           (SELECT GROUP_CONCAT(imageUrl) FROM productImages WHERE productId = p.productId AND activeFlag = 1) as images,
           4.5 as rating,
           120 as ratingCount,
           50 as soldCount,
           (SELECT COUNT(*) FROM products 
            WHERE activeFlag = 1 
              AND (p_search = '' OR productName LIKE CONCAT('%', p_search, '%')) 
              AND (p_categoryId IS NULL OR p_categoryId = '' OR categoryId = p_categoryId)
              AND (p_minPrice IS NULL OR basePrice >= p_minPrice)
              AND (p_maxPrice IS NULL OR basePrice <= p_maxPrice)
           ) as RecordCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
    WHERE p.activeFlag = 1
      AND (p_search = '' OR p.productName LIKE CONCAT('%', p_search, '%'))
      AND (p_categoryId IS NULL OR p_categoryId = '' OR p.categoryId = p_categoryId)
      AND (p_minPrice IS NULL OR p.basePrice >= p_minPrice)
      AND (p_maxPrice IS NULL OR p.basePrice <= p_maxPrice)
    GROUP BY p.productId
    ORDER BY 
        CASE WHEN p_sortBy = 'price-asc' THEN p.basePrice END ASC,
        CASE WHEN p_sortBy = 'price-desc' THEN p.basePrice END DESC,
        CASE WHEN p_sortBy = 'newest' OR p_sortBy = '' OR p_sortBy IS NULL THEN p.createdAt END DESC
    LIMIT v_offset, p_pageSize;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 19:32:17
