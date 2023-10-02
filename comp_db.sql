-- -------------------------------------------------------------
-- TablePlus 5.3.8(500)
--
-- https://tableplus.com/
--
-- Database: compressor_db
-- Generation Time: 2023-10-02 17:30:30.5260
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `t_transmit`;
CREATE TABLE `t_transmit` (
  `dev_name` varchar(100) NOT NULL,
  `reg_name` varchar(100) NOT NULL,
  `reg_value` varchar(50) NOT NULL,
  `ttl` smallint NOT NULL,
  `tr_time` timestamp NOT NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_companies`;
CREATE TABLE `tb_m_companies` (
  `company_id` int NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `company_nm` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `created_by` varchar(100) NOT NULL DEFAULT (_utf8mb4'SYSTEM'),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_lines`;
CREATE TABLE `tb_m_lines` (
  `line_id` int NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `line_nm` varchar(100) NOT NULL,
  `line_snm` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `created_by` varchar(100) NOT NULL DEFAULT (_utf8mb4'SYSTEM'),
  `plant_id` int NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`line_id`),
  KEY `fk_tb_m_lines_tb_m_lines` (`plant_id`),
  CONSTRAINT `fk_tb_m_lines_tb_m_lines` FOREIGN KEY (`plant_id`) REFERENCES `tb_m_plants` (`plant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_machines`;
CREATE TABLE `tb_m_machines` (
  `machine_id` int NOT NULL,
  `line_id` int NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `machine_nm` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `created_by` varchar(100) NOT NULL DEFAULT (_utf8mb4'SYSTEM'),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  `x_axis` int NOT NULL DEFAULT (0),
  `y_axis` int NOT NULL DEFAULT (0),
  PRIMARY KEY (`machine_id`),
  KEY `fk_tb_m_machines_tb_m_lines` (`line_id`),
  CONSTRAINT `fk_tb_m_machines_tb_m_lines` FOREIGN KEY (`line_id`) REFERENCES `tb_m_lines` (`line_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_mc_parameters`;
CREATE TABLE `tb_m_mc_parameters` (
  `mc_param_id` int NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `machine_id` int NOT NULL,
  `param_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `created_by` varchar(100) NOT NULL DEFAULT (_utf8mb4'SYSTEM'),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`mc_param_id`),
  KEY `fk_tb_m_mc_iot_tb_m_iot` (`param_id`),
  KEY `fk_tb_m_mc_iot_tb_m_machines` (`machine_id`),
  CONSTRAINT `fk_tb_m_mc_iot_tb_m_iot` FOREIGN KEY (`param_id`) REFERENCES `tb_m_parameters` (`client_hdl`),
  CONSTRAINT `fk_tb_m_mc_iot_tb_m_machines` FOREIGN KEY (`machine_id`) REFERENCES `tb_m_machines` (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_parameters`;
CREATE TABLE `tb_m_parameters` (
  `client_hdl` int NOT NULL,
  `dev_name` varchar(30) NOT NULL,
  `group_name` varchar(30) NOT NULL,
  `tag_name` varchar(50) NOT NULL,
  `reg_value` varchar(50) DEFAULT NULL,
  `tr_time` timestamp NULL DEFAULT NULL,
  `connect_stat` char(1) NOT NULL DEFAULT (1),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  `is_main` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`client_hdl`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_plants`;
CREATE TABLE `tb_m_plants` (
  `plant_id` int NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `plant_nm` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `created_by` varchar(100) NOT NULL DEFAULT (_utf8mb4'SYSTEM'),
  `company_id` int NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  `background` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`plant_id`),
  KEY `fk_tb_m_plants_tb_m_companies` (`company_id`),
  CONSTRAINT `fk_tb_m_plants_tb_m_companies` FOREIGN KEY (`company_id`) REFERENCES `tb_m_companies` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_user_locs`;
CREATE TABLE `tb_m_user_locs` (
  `user_locs_id` int NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `plant_id` int DEFAULT NULL,
  `line_id` int DEFAULT NULL,
  `machine_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `created_by` varchar(100) NOT NULL DEFAULT (_utf8mb4'SYSTEM'),
  PRIMARY KEY (`user_locs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tb_m_users`;
CREATE TABLE `tb_m_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `noreg` varchar(10) NOT NULL,
  `user_nm` varchar(255) NOT NULL,
  `phone_no` varchar(13) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_by` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_admin` tinyint(1) NOT NULL DEFAULT (0),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique_noreg` (`noreg`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP VIEW IF EXISTS `v_mc_params`;


INSERT INTO `t_transmit` (`dev_name`, `reg_name`, `reg_value`, `ttl`, `tr_time`) VALUES
('Device2.G2', 'tag2', '1', 1, '2023-09-27 08:19:55'),
('Device1.G1', 'tag', '1', 1, '2023-10-01 21:25:39'),
('Device1.G1', 'tag', '0', 1, '2023-10-01 21:25:47'),
('Device1.G1', 'tag', '0', 1, '2023-10-01 21:26:28'),
('Device1.G1', 'tag', '0', 1, '2023-10-01 21:26:52'),
('Device1.G1', 'tag', '1', 1, '2023-10-01 22:14:07');

INSERT INTO `tb_m_companies` (`company_id`, `uuid`, `company_nm`, `created_at`, `created_by`, `deleted_at`, `deleted_by`) VALUES
(0, '3377fee7-53c0-4e48-876e-6071ed1352bb', 'PT. Toyota Motor Manufacturing Indonesia', '2023-09-20 21:04:23', 'superadmin', NULL, NULL),
(1, '0d5b2229-91a3-4d34-b5f5-09f5edc5da75', 'test', '2023-09-20 21:04:37', 'superadmin', '2023-09-20 00:00:00', 'superadmin'),
(2, '3762bcd7-e486-4b3e-875f-18b39e3f4c87', 'PT. Toyota Motor Manufacturing Indonesia 1', '2023-09-21 22:55:18', 'superadmin', '2023-09-21 00:00:00', 'superadmin');

INSERT INTO `tb_m_lines` (`line_id`, `uuid`, `line_nm`, `line_snm`, `created_at`, `created_by`, `plant_id`, `deleted_at`, `deleted_by`) VALUES
(0, 'e5e6d388-9214-4e8a-aa12-cd5e4eeb94b6', 'Die Casting Line', 'DC', '2023-09-21 19:38:26', 'superadmin', 0, NULL, NULL),
(1, '8863dd5a-2d0a-47ef-9cba-aeb7d07a4cbd', 'Low Pressure Casting Line', 'LP', '2023-09-21 19:43:33', 'superadmin', 0, NULL, NULL),
(2, '3d50253e-052b-4c2d-9f0b-ec2b1f5c79e2', 'Cam Shaft Machining Line', 'CAM', '2023-09-21 19:44:15', 'superadmin', 0, NULL, NULL),
(3, '7896d538-98f4-4e3a-914e-ef53215d8385', 'Crank Shaft Machining Line', 'CR', '2023-09-21 19:44:53', 'superadmin', 0, NULL, NULL),
(4, '8e1f1485-cbb8-4d17-9617-bc07551a6e96', 'Cylinder Block Machining Line', 'CB', '2023-09-21 19:45:13', 'superadmin', 0, NULL, NULL),
(5, '2e167044-7e40-47d4-816b-c49484697c65', 'Cylinder Head Machining Line', 'CH', '2023-09-21 19:45:20', 'superadmin', 0, NULL, NULL),
(6, 'a2653008-50d8-42bb-af05-2958bd944260', 'Assembly Line', 'ASSY', '2023-09-21 19:45:34', 'superadmin', 0, NULL, NULL),
(7, '8e3cbe3f-51d8-4284-b3cc-45379b2fc1f2', 'TEST 1', 'TEST 1', '2023-09-21 20:15:55', 'superadmin', 0, '2023-09-21 00:00:00', 'superadmin'),
(8, 'a4dd7160-8965-4b60-9ec5-03e513154070', 'TEST 1', 'TEST1', '2023-09-21 22:53:49', 'superadmin', 2, '2023-09-21 00:00:00', 'superadmin'),
(9, '3eb4bba8-dbc7-4ea0-867f-249fd965ab8c', 'TEST 1', 'TEST1', '2023-09-27 20:52:08', 'superadmin', 2, '2023-09-21 00:00:00', 'superadmin');

INSERT INTO `tb_m_machines` (`machine_id`, `line_id`, `uuid`, `machine_nm`, `created_at`, `created_by`, `deleted_at`, `deleted_by`, `x_axis`, `y_axis`) VALUES
(0, 0, 'b3bc4ed9-3497-49b2-a6a1-d493e67da67f', 'Compressor 1 DC', '2023-09-21 19:51:00', 'superadmin', NULL, NULL, 0, 0),
(1, 0, '27ff1230-748e-405f-89de-d6a1c99d5bab', 'Compressor 2 DC', '2023-09-21 19:53:06', 'superadmin', NULL, NULL, 1, 1),
(2, 0, '589f8dbf-d103-4196-934e-17308db3d647', 'Compressor 3 DC', '2023-09-21 19:53:22', 'superadmin', NULL, NULL, 0, 0),
(3, 0, '1d3e613c-d761-4a56-b252-b68fa6932886', 'Compressor 4 DC', '2023-09-21 19:53:36', 'superadmin', NULL, NULL, 0, 0),
(4, 9, 'd9b20c40-574f-4143-9311-2b2744192890', 'Compressor TEST', '2023-09-27 20:52:41', 'superadmin', NULL, NULL, 1, 1),
(5, 0, 'b6222298-5efc-4aeb-baa9-403639bca9ef', 'Compressor TEST AJA', '2023-09-27 20:54:53', 'superadmin', NULL, NULL, 1, 1),
(6, 0, 'ac894a0d-deb3-4900-a152-c0be6adfea60', 'TESTING MC', '2023-09-30 06:45:07', 'superadmin', NULL, NULL, 300, 300),
(7, 0, '8c62ba35-9652-4fe4-9101-5278165cd231', 'TESTING MC', '2023-09-30 06:55:31', 'superadmin', NULL, NULL, 300, 300),
(8, 0, '1666d36a-f698-43b2-ad4b-8637934dea19', 'TESTING MC', '2023-09-30 06:56:10', 'superadmin', NULL, NULL, 140, 398),
(9, 0, '8d0611e2-f93b-4d21-917b-b26d091fcefe', 'TESTING MC', '2023-09-30 06:57:05', 'superadmin', NULL, NULL, 136, 325);

INSERT INTO `tb_m_mc_parameters` (`mc_param_id`, `uuid`, `machine_id`, `param_id`, `created_at`, `created_by`, `deleted_at`, `deleted_by`) VALUES
(0, 'e0cfbea4-83e5-4af6-abab-07afc3d42b43', 0, 0, '2023-09-21 21:06:46', 'superadmin', NULL, NULL),
(1, 'c7b44202-9a77-4476-b8d6-86736a1465a2', 0, 1, '2023-09-21 21:09:19', 'superadmin', '2023-09-21 00:00:00', 'superadmin'),
(2, '4ee62e0e-8f28-4f4d-9611-7ac299729712', 5, 0, '2023-09-27 20:56:25', 'superadmin', NULL, NULL),
(3, 'f94ca164-3100-40ef-887a-0b3656ec9efd', 5, 0, '2023-09-27 20:59:02', 'superadmin', NULL, NULL),
(4, '1666d36a-f698-43b2-ad4b-8637934dea19', 8, 1, '2023-09-30 06:56:10', 'SYSTEM', NULL, NULL),
(5, '1666d36a-f698-43b2-ad4b-8637934dea19', 8, 2, '2023-09-30 06:56:10', 'SYSTEM', NULL, NULL),
(6, '77df74ef-13c9-44ae-ae9b-0eef15f54eb4', 9, 1, '2023-09-30 06:57:05', 'SYSTEM', NULL, NULL),
(7, 'e4169fc5-6ba9-42c5-b731-45a0b64d1632', 9, 2, '2023-09-30 06:57:05', 'SYSTEM', NULL, NULL);

INSERT INTO `tb_m_parameters` (`client_hdl`, `dev_name`, `group_name`, `tag_name`, `reg_value`, `tr_time`, `connect_stat`, `deleted_at`, `deleted_by`, `is_main`) VALUES
(0, 'Device2', 'G2', 'tag2', NULL, NULL, '1', '2023-09-21 00:00:00', 'superadmin', NULL),
(1, 'Device1', 'G1', 'tag', NULL, NULL, '1', NULL, NULL, 1),
(2, 'Device12', 'G2', 'tag2', NULL, NULL, '1', NULL, NULL, NULL);

INSERT INTO `tb_m_plants` (`plant_id`, `uuid`, `plant_nm`, `created_at`, `created_by`, `company_id`, `deleted_at`, `deleted_by`, `background`) VALUES
(0, '14ebf699-ed95-4139-badd-480740feca60', 'Engine Plant Karawang 3', '2023-09-21 19:22:53', 'superadmin', 0, NULL, NULL, NULL),
(1, 'ad67094a-97d8-49be-a499-98764b2ff81f', 'Engine Plant Karawang 2', '2023-09-21 19:24:16', 'superadmin', 0, '2023-09-21 00:00:00', 'superadmin', NULL),
(2, 'ed65e9ea-47c8-4d13-9fe3-b23ebb851f2d', 'PLANT TEST 1', '2023-09-21 22:47:38', 'superadmin', 0, NULL, NULL, 'uploads/1695311258077--Screenshot 2023-09-21 at 20.24.22.png');

INSERT INTO `tb_m_users` (`user_id`, `uuid`, `noreg`, `user_nm`, `phone_no`, `password`, `created_by`, `created_at`, `is_admin`, `deleted_at`, `deleted_by`) VALUES
(1, '186be970-14f3-4ed8-ac46-ede3f6d25df2', 'superadmin', 'superadmin', '082211511213', '$2a$10$b1ljZf..ki9QD5tFNKhCseJafHNAil7g3O2qJBhAhVqxuIVT35TUu', 'SYSTEM', '2023-09-19 20:53:47', 1, NULL, NULL),
(9, 'efa46566-50e5-4573-889c-1708b2051312', '123456', 'test12', '082211511213', '$2a$10$iMf/yM4ofhFpKxYEV9/fu.yjB8Kf2BBwE.fvkjXznB6je/9zeUtWm', 'superadmin', '2023-09-28 19:35:22', 0, NULL, NULL),
(14, 'b9bebf39-abee-488c-b47c-af2b6c7d7325', '6544531', 'TSSS', '415627531', '$2a$10$HYNAHK0iodBlk2z3gBJsP.gCsW2s8KQmaAucseWRGd3OZB9Ux/UFi', 'superadmin', '2023-09-28 22:57:51', 0, NULL, NULL);

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_mc_params` AS select `tmmp`.`mc_param_id` AS `mc_param_id`,`tmmp`.`uuid` AS `uuid`,`tmmp`.`param_id` AS `param_id`,`tmm`.`uuid` AS `machine_id`,`tml`.`uuid` AS `line_id`,`tml`.`line_snm` AS `line_nm`,`tmm`.`machine_nm` AS `machine_nm`,`tmm`.`x_axis` AS `x_axis`,`tmm`.`y_axis` AS `y_axis`,`tmp`.`dev_name` AS `dev_name`,`tmp`.`group_name` AS `group_name`,`tmp`.`tag_name` AS `tag_name`,`tmp`.`reg_value` AS `reg_value`,`tmp`.`tr_time` AS `tr_time`,`tmp`.`connect_stat` AS `connect_stat`,`tmmp`.`deleted_at` AS `deleted_at` from (((`tb_m_mc_parameters` `tmmp` join `tb_m_machines` `tmm` on((`tmm`.`machine_id` = `tmmp`.`machine_id`))) join `tb_m_parameters` `tmp` on((`tmp`.`client_hdl` = `tmmp`.`param_id`))) join `tb_m_lines` `tml` on((`tml`.`line_id` = `tmm`.`line_id`))) where ((`tmm`.`deleted_at` is null) and (`tmmp`.`deleted_at` is null) and (`tmp`.`is_main` = 1));


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;