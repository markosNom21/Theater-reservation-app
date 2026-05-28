-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 19 Μάη 2026 στις 16:46:22
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `theatre_reservation_db`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `total_price` decimal(8,2) NOT NULL,
  `status` enum('ACTIVE','CANCELLED') DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `user_id`, `showtime_id`, `total_price`, `status`, `created_at`) VALUES
(1, 2, 3, 24.00, 'CANCELLED', '2026-05-05 11:39:25'),
(2, 3, 1, 30.00, 'CANCELLED', '2026-05-05 11:47:31'),
(3, 2, 3, 12.00, 'CANCELLED', '2026-05-05 12:32:27'),
(4, 2, 5, 20.00, 'CANCELLED', '2026-05-05 12:38:45'),
(5, 3, 13, 28.00, 'CANCELLED', '2026-05-07 12:23:12'),
(6, 3, 16, 20.00, 'ACTIVE', '2026-05-07 12:24:44'),
(7, 2, 16, 20.00, 'ACTIVE', '2026-05-07 12:25:54'),
(8, 3, 3, 24.00, 'ACTIVE', '2026-05-07 12:28:30'),
(9, 2, 2, 15.00, 'ACTIVE', '2026-05-07 12:38:10'),
(10, 2, 5, 40.00, 'ACTIVE', '2026-05-07 12:38:39'),
(11, 2, 12, 28.00, 'ACTIVE', '2026-05-07 13:27:00'),
(12, 3, 5, 20.00, 'CANCELLED', '2026-05-07 13:28:02'),
(13, 3, 7, 18.00, 'CANCELLED', '2026-05-07 13:28:24'),
(14, 2, 14, 12.00, 'ACTIVE', '2026-05-07 13:36:18'),
(15, 2, 5, 20.00, 'CANCELLED', '2026-05-07 13:36:44'),
(16, 3, 7, 18.00, 'ACTIVE', '2026-05-07 13:44:54'),
(17, 1, 1, 15.00, 'ACTIVE', '2026-05-07 13:51:37'),
(18, 1, 1, 30.00, 'CANCELLED', '2026-05-07 14:43:46'),
(19, 2, 5, 20.00, 'ACTIVE', '2026-05-13 10:35:32'),
(20, 3, 2, 15.00, 'ACTIVE', '2026-05-13 10:53:30'),
(21, 2, 5, 40.00, 'CANCELLED', '2026-05-19 14:36:22'),
(22, 2, 1, 15.00, 'ACTIVE', '2026-05-19 14:38:40'),
(23, 3, 5, 20.00, 'ACTIVE', '2026-05-19 14:44:44');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `reservation_seats`
--

CREATE TABLE `reservation_seats` (
  `reservation_id` int(11) NOT NULL,
  `seat_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `reservation_seats`
--

INSERT INTO `reservation_seats` (`reservation_id`, `seat_id`) VALUES
(1, 8),
(1, 13),
(2, 1),
(2, 6),
(3, 3),
(4, 15),
(5, 130),
(5, 131),
(6, 146),
(7, 145),
(8, 39),
(8, 44),
(9, 12),
(10, 10),
(10, 15),
(11, 125),
(11, 126),
(12, 20),
(13, 101),
(14, 136),
(15, 25),
(16, 101),
(17, 1),
(18, 11),
(18, 16),
(19, 20),
(20, 7),
(21, 82),
(21, 87),
(22, 11),
(23, 5);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `seats`
--

CREATE TABLE `seats` (
  `seat_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `seat_row` varchar(5) NOT NULL,
  `seat_number` int(11) NOT NULL,
  `category` varchar(50) DEFAULT 'Standard',
  `is_reserved` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `seats`
--

INSERT INTO `seats` (`seat_id`, `showtime_id`, `seat_row`, `seat_number`, `category`, `is_reserved`) VALUES
(1, 1, 'A', 1, 'Standard', 1),
(2, 2, 'A', 1, 'Standard', 0),
(3, 3, 'A', 1, 'Standard', 0),
(4, 4, 'A', 1, 'Standard', 0),
(5, 5, 'A', 1, 'Standard', 1),
(6, 1, 'A', 2, 'Standard', 0),
(7, 2, 'A', 2, 'Standard', 1),
(8, 3, 'A', 2, 'Standard', 0),
(9, 4, 'A', 2, 'Standard', 0),
(10, 5, 'A', 2, 'Standard', 1),
(11, 1, 'A', 3, 'Standard', 1),
(12, 2, 'A', 3, 'Standard', 1),
(13, 3, 'A', 3, 'Standard', 0),
(14, 4, 'A', 3, 'Standard', 0),
(15, 5, 'A', 3, 'Standard', 1),
(16, 1, 'A', 4, 'Standard', 0),
(17, 2, 'A', 4, 'Standard', 0),
(18, 3, 'A', 4, 'Standard', 0),
(19, 4, 'A', 4, 'Standard', 0),
(20, 5, 'A', 4, 'Standard', 1),
(21, 1, 'A', 5, 'Standard', 0),
(22, 2, 'A', 5, 'Standard', 0),
(23, 3, 'A', 5, 'Standard', 0),
(24, 4, 'A', 5, 'Standard', 0),
(25, 5, 'A', 5, 'Standard', 0),
(32, 1, 'B', 1, 'Standard', 0),
(33, 2, 'B', 1, 'Standard', 0),
(34, 3, 'B', 1, 'Standard', 0),
(35, 4, 'B', 1, 'Standard', 0),
(36, 5, 'B', 1, 'Standard', 0),
(37, 1, 'B', 2, 'Standard', 0),
(38, 2, 'B', 2, 'Standard', 0),
(39, 3, 'B', 2, 'Standard', 1),
(40, 4, 'B', 2, 'Standard', 0),
(41, 5, 'B', 2, 'Standard', 0),
(42, 1, 'B', 3, 'Standard', 0),
(43, 2, 'B', 3, 'Standard', 0),
(44, 3, 'B', 3, 'Standard', 1),
(45, 4, 'B', 3, 'Standard', 0),
(46, 5, 'B', 3, 'Standard', 0),
(47, 1, 'B', 4, 'Standard', 0),
(48, 2, 'B', 4, 'Standard', 0),
(49, 3, 'B', 4, 'Standard', 0),
(50, 4, 'B', 4, 'Standard', 0),
(51, 5, 'B', 4, 'Standard', 0),
(52, 1, 'B', 5, 'Standard', 0),
(53, 2, 'B', 5, 'Standard', 0),
(54, 3, 'B', 5, 'Standard', 0),
(55, 4, 'B', 5, 'Standard', 0),
(56, 5, 'B', 5, 'Standard', 0),
(63, 1, 'C', 1, 'Standard', 0),
(64, 2, 'C', 1, 'Standard', 0),
(65, 3, 'C', 1, 'Standard', 0),
(66, 4, 'C', 1, 'Standard', 0),
(67, 5, 'C', 1, 'Standard', 0),
(68, 1, 'C', 2, 'Standard', 0),
(69, 2, 'C', 2, 'Standard', 0),
(70, 3, 'C', 2, 'Standard', 0),
(71, 4, 'C', 2, 'Standard', 0),
(72, 5, 'C', 2, 'Standard', 0),
(73, 1, 'C', 3, 'Standard', 0),
(74, 2, 'C', 3, 'Standard', 0),
(75, 3, 'C', 3, 'Standard', 0),
(76, 4, 'C', 3, 'Standard', 0),
(77, 5, 'C', 3, 'Standard', 0),
(78, 1, 'C', 4, 'Standard', 0),
(79, 2, 'C', 4, 'Standard', 0),
(80, 3, 'C', 4, 'Standard', 0),
(81, 4, 'C', 4, 'Standard', 0),
(82, 5, 'C', 4, 'Standard', 0),
(83, 1, 'C', 5, 'Standard', 0),
(84, 2, 'C', 5, 'Standard', 0),
(85, 3, 'C', 5, 'Standard', 0),
(86, 4, 'C', 5, 'Standard', 0),
(87, 5, 'C', 5, 'Standard', 0),
(94, 6, 'A', 1, 'Standard', 0),
(95, 6, 'A', 2, 'Standard', 0),
(96, 6, 'A', 3, 'Standard', 0),
(97, 6, 'A', 4, 'Standard', 0),
(98, 6, 'A', 5, 'Standard', 0),
(99, 7, 'A', 1, 'Standard', 0),
(100, 7, 'A', 2, 'Standard', 0),
(101, 7, 'A', 3, 'Standard', 1),
(102, 7, 'A', 4, 'Standard', 0),
(103, 7, 'A', 5, 'Standard', 0),
(104, 8, 'A', 1, 'Standard', 0),
(105, 8, 'A', 2, 'Standard', 0),
(106, 8, 'A', 3, 'Standard', 0),
(107, 8, 'A', 4, 'Standard', 0),
(108, 8, 'A', 5, 'Standard', 0),
(109, 9, 'A', 1, 'Standard', 0),
(110, 9, 'A', 2, 'Standard', 0),
(111, 9, 'A', 3, 'Standard', 0),
(112, 9, 'A', 4, 'Standard', 0),
(113, 9, 'A', 5, 'Standard', 0),
(114, 10, 'A', 1, 'Standard', 0),
(115, 10, 'A', 2, 'Standard', 0),
(116, 10, 'A', 3, 'Standard', 0),
(117, 10, 'A', 4, 'Standard', 0),
(118, 10, 'A', 5, 'Standard', 0),
(119, 11, 'A', 1, 'Standard', 0),
(120, 11, 'A', 2, 'Standard', 0),
(121, 11, 'A', 3, 'Standard', 0),
(122, 11, 'A', 4, 'Standard', 0),
(123, 11, 'A', 5, 'Standard', 0),
(124, 12, 'A', 1, 'Standard', 0),
(125, 12, 'A', 2, 'Standard', 1),
(126, 12, 'A', 3, 'Standard', 1),
(127, 12, 'A', 4, 'Standard', 0),
(128, 12, 'A', 5, 'Standard', 0),
(129, 13, 'A', 1, 'Standard', 0),
(130, 13, 'A', 2, 'Standard', 0),
(131, 13, 'A', 3, 'Standard', 0),
(132, 13, 'A', 4, 'Standard', 0),
(133, 13, 'A', 5, 'Standard', 0),
(134, 14, 'A', 1, 'Standard', 0),
(135, 14, 'A', 2, 'Standard', 0),
(136, 14, 'A', 3, 'Standard', 1),
(137, 14, 'A', 4, 'Standard', 0),
(138, 14, 'A', 5, 'Standard', 0),
(139, 15, 'A', 1, 'Standard', 0),
(140, 15, 'A', 2, 'Standard', 0),
(141, 15, 'A', 3, 'Standard', 0),
(142, 15, 'A', 4, 'Standard', 0),
(143, 15, 'A', 5, 'Standard', 0),
(144, 16, 'A', 1, 'Standard', 0),
(145, 16, 'A', 2, 'Standard', 1),
(146, 16, 'A', 3, 'Standard', 1),
(147, 16, 'A', 4, 'Standard', 0),
(148, 16, 'A', 5, 'Standard', 0),
(157, 6, 'B', 1, 'Standard', 0),
(158, 6, 'B', 2, 'Standard', 0),
(159, 6, 'B', 3, 'Standard', 0),
(160, 6, 'B', 4, 'Standard', 0),
(161, 6, 'B', 5, 'Standard', 0),
(162, 7, 'B', 1, 'Standard', 0),
(163, 7, 'B', 2, 'Standard', 0),
(164, 7, 'B', 3, 'Standard', 0),
(165, 7, 'B', 4, 'Standard', 0),
(166, 7, 'B', 5, 'Standard', 0),
(167, 8, 'B', 1, 'Standard', 0),
(168, 8, 'B', 2, 'Standard', 0),
(169, 8, 'B', 3, 'Standard', 0),
(170, 8, 'B', 4, 'Standard', 0),
(171, 8, 'B', 5, 'Standard', 0),
(172, 9, 'B', 1, 'Standard', 0),
(173, 9, 'B', 2, 'Standard', 0),
(174, 9, 'B', 3, 'Standard', 0),
(175, 9, 'B', 4, 'Standard', 0),
(176, 9, 'B', 5, 'Standard', 0),
(177, 10, 'B', 1, 'Standard', 0),
(178, 10, 'B', 2, 'Standard', 0),
(179, 10, 'B', 3, 'Standard', 0),
(180, 10, 'B', 4, 'Standard', 0),
(181, 10, 'B', 5, 'Standard', 0),
(182, 11, 'B', 1, 'Standard', 0),
(183, 11, 'B', 2, 'Standard', 0),
(184, 11, 'B', 3, 'Standard', 0),
(185, 11, 'B', 4, 'Standard', 0),
(186, 11, 'B', 5, 'Standard', 0),
(187, 12, 'B', 1, 'Standard', 0),
(188, 12, 'B', 2, 'Standard', 0),
(189, 12, 'B', 3, 'Standard', 0),
(190, 12, 'B', 4, 'Standard', 0),
(191, 12, 'B', 5, 'Standard', 0),
(192, 13, 'B', 1, 'Standard', 0),
(193, 13, 'B', 2, 'Standard', 0),
(194, 13, 'B', 3, 'Standard', 0),
(195, 13, 'B', 4, 'Standard', 0),
(196, 13, 'B', 5, 'Standard', 0),
(197, 14, 'B', 1, 'Standard', 0),
(198, 14, 'B', 2, 'Standard', 0),
(199, 14, 'B', 3, 'Standard', 0),
(200, 14, 'B', 4, 'Standard', 0),
(201, 14, 'B', 5, 'Standard', 0),
(202, 15, 'B', 1, 'Standard', 0),
(203, 15, 'B', 2, 'Standard', 0),
(204, 15, 'B', 3, 'Standard', 0),
(205, 15, 'B', 4, 'Standard', 0),
(206, 15, 'B', 5, 'Standard', 0),
(207, 16, 'B', 1, 'Standard', 0),
(208, 16, 'B', 2, 'Standard', 0),
(209, 16, 'B', 3, 'Standard', 0),
(210, 16, 'B', 4, 'Standard', 0),
(211, 16, 'B', 5, 'Standard', 0),
(220, 6, 'C', 1, 'Standard', 0),
(221, 6, 'C', 2, 'Standard', 0),
(222, 6, 'C', 3, 'Standard', 0),
(223, 6, 'C', 4, 'Standard', 0),
(224, 6, 'C', 5, 'Standard', 0),
(225, 7, 'C', 1, 'Standard', 0),
(226, 7, 'C', 2, 'Standard', 0),
(227, 7, 'C', 3, 'Standard', 0),
(228, 7, 'C', 4, 'Standard', 0),
(229, 7, 'C', 5, 'Standard', 0),
(230, 8, 'C', 1, 'Standard', 0),
(231, 8, 'C', 2, 'Standard', 0),
(232, 8, 'C', 3, 'Standard', 0),
(233, 8, 'C', 4, 'Standard', 0),
(234, 8, 'C', 5, 'Standard', 0),
(235, 9, 'C', 1, 'Standard', 0),
(236, 9, 'C', 2, 'Standard', 0),
(237, 9, 'C', 3, 'Standard', 0),
(238, 9, 'C', 4, 'Standard', 0),
(239, 9, 'C', 5, 'Standard', 0),
(240, 10, 'C', 1, 'Standard', 0),
(241, 10, 'C', 2, 'Standard', 0),
(242, 10, 'C', 3, 'Standard', 0),
(243, 10, 'C', 4, 'Standard', 0),
(244, 10, 'C', 5, 'Standard', 0),
(245, 11, 'C', 1, 'Standard', 0),
(246, 11, 'C', 2, 'Standard', 0),
(247, 11, 'C', 3, 'Standard', 0),
(248, 11, 'C', 4, 'Standard', 0),
(249, 11, 'C', 5, 'Standard', 0),
(250, 12, 'C', 1, 'Standard', 0),
(251, 12, 'C', 2, 'Standard', 0),
(252, 12, 'C', 3, 'Standard', 0),
(253, 12, 'C', 4, 'Standard', 0),
(254, 12, 'C', 5, 'Standard', 0),
(255, 13, 'C', 1, 'Standard', 0),
(256, 13, 'C', 2, 'Standard', 0),
(257, 13, 'C', 3, 'Standard', 0),
(258, 13, 'C', 4, 'Standard', 0),
(259, 13, 'C', 5, 'Standard', 0),
(260, 14, 'C', 1, 'Standard', 0),
(261, 14, 'C', 2, 'Standard', 0),
(262, 14, 'C', 3, 'Standard', 0),
(263, 14, 'C', 4, 'Standard', 0),
(264, 14, 'C', 5, 'Standard', 0),
(265, 15, 'C', 1, 'Standard', 0),
(266, 15, 'C', 2, 'Standard', 0),
(267, 15, 'C', 3, 'Standard', 0),
(268, 15, 'C', 4, 'Standard', 0),
(269, 15, 'C', 5, 'Standard', 0),
(270, 16, 'C', 1, 'Standard', 0),
(271, 16, 'C', 2, 'Standard', 0),
(272, 16, 'C', 3, 'Standard', 0),
(273, 16, 'C', 4, 'Standard', 0),
(274, 16, 'C', 5, 'Standard', 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `shows`
--

CREATE TABLE `shows` (
  `show_id` int(11) NOT NULL,
  `theatre_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `age_rating` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `shows`
--

INSERT INTO `shows` (`show_id`, `theatre_id`, `title`, `description`, `duration`, `age_rating`, `created_at`, `image_name`) VALUES
(1, 1, 'Hamlet', 'A classic tragedy by William Shakespeare.', 120, '12+', '2026-05-03 11:50:00', 'Hamlet.jpg'),
(2, 1, 'Romeo and Juliet', 'A romantic tragedy about two young lovers.', 110, '12+', '2026-05-03 11:50:00', 'RomeoAndJuliet.jpg'),
(3, 2, 'Antigone', 'Ancient Greek tragedy by Sophocles.', 100, '10+', '2026-05-03 11:50:00', 'Antigone.jpg'),
(4, 3, 'The Phantom of the Opera', 'Musical drama with mystery and romance.', 150, '12+', '2026-05-03 11:50:00', 'Phantom.jpg'),
(5, 4, 'Macbeth', 'A dark tragedy about ambition and power.', 125, '15+', '2026-05-03 11:58:02', 'Macbeth.avif'),
(6, 4, 'Medea', 'Ancient Greek tragedy about revenge and betrayal.', 105, '15+', '2026-05-03 11:58:02', 'Medea.jpg'),
(7, 5, 'Oedipus Rex', 'Classic tragedy by Sophocles.', 100, '12+', '2026-05-03 11:58:02', 'OedipusRex.jpg'),
(8, 6, 'The Glass Menagerie', 'Emotional family drama by Tennessee Williams.', 115, '12+', '2026-05-03 11:58:02', 'TheGlassMenagerie.jpg'),
(9, 6, 'Waiting for Godot', 'Absurdist play by Samuel Beckett.', 110, '12+', '2026-05-03 11:58:02', 'WaitingForGodot.jpg'),
(10, 7, 'Lysistrata', 'Ancient Greek comedy by Aristophanes.', 95, '12+', '2026-05-03 11:58:02', 'Lyistrata.jpg'),
(11, 8, 'Les Misérables', 'Musical drama based on Victor Hugo’s novel.', 160, '12+', '2026-05-03 11:58:02', 'Les-Miserables.jpg'),
(12, 8, 'Cats', 'Famous musical with music and dance.', 140, '8+', '2026-05-03 11:58:02', 'Cats.jpg');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `showtimes`
--

CREATE TABLE `showtimes` (
  `showtime_id` int(11) NOT NULL,
  `show_id` int(11) NOT NULL,
  `show_date` date NOT NULL,
  `show_time` time NOT NULL,
  `hall` varchar(50) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `showtimes`
--

INSERT INTO `showtimes` (`showtime_id`, `show_id`, `show_date`, `show_time`, `hall`, `price`, `created_at`) VALUES
(1, 1, '2026-08-08', '20:00:00', 'Hall A', 15.00, '2026-05-03 11:50:00'),
(2, 1, '2026-08-09', '21:00:00', 'Hall A', 15.00, '2026-05-03 11:50:00'),
(3, 2, '2026-08-10', '19:30:00', 'Hall B', 12.00, '2026-05-03 11:50:00'),
(4, 3, '2026-08-11', '20:30:00', 'Main Hall', 10.00, '2026-05-03 11:50:00'),
(5, 4, '2026-08-12', '21:00:00', 'Apollo Main Hall', 20.00, '2026-05-03 11:50:00'),
(6, 5, '2026-08-13', '20:00:00', 'Main Hall', 18.00, '2026-05-03 11:58:02'),
(7, 5, '2026-08-14', '21:00:00', 'Main Hall', 18.00, '2026-05-03 11:58:02'),
(8, 6, '2026-08-15', '20:30:00', 'Hall A', 16.00, '2026-05-03 11:58:02'),
(9, 6, '2026-08-16', '21:00:00', 'Hall A', 16.00, '2026-05-03 11:58:02'),
(10, 7, '2026-08-17', '20:00:00', 'Ancient Stage', 22.00, '2026-05-03 11:58:02'),
(11, 7, '2026-08-18', '20:00:00', 'Ancient Stage', 22.00, '2026-05-03 11:58:02'),
(12, 8, '2026-08-19', '19:30:00', 'Drama Hall', 14.00, '2026-05-03 11:58:02'),
(13, 9, '2026-08-20', '20:30:00', 'Drama Hall', 14.00, '2026-05-03 11:58:02'),
(14, 10, '2026-08-21', '21:00:00', 'Open Stage', 12.00, '2026-05-03 11:58:02'),
(15, 11, '2026-08-22', '20:00:00', 'Musical Hall', 25.00, '2026-05-03 11:58:02'),
(16, 12, '2026-08-23', '18:30:00', 'Musical Hall', 20.00, '2026-05-03 11:58:02');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `theatres`
--

CREATE TABLE `theatres` (
  `theatre_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `theatres`
--

INSERT INTO `theatres` (`theatre_id`, `name`, `location`, `description`, `created_at`) VALUES
(1, 'National Theatre', 'Athens', 'Large historic theatre in the center of Athens.', '2026-05-03 11:50:00'),
(2, 'City Theatre', 'Thessaloniki', 'Modern theatre for drama and musical performances.', '2026-05-03 11:50:00'),
(3, 'Apollo Theatre', 'Patras', 'Classic theatre with cultural performances.', '2026-05-03 11:50:00'),
(4, 'Megaron Theatre', 'Athens', 'Premium venue for theatre and music performances.', '2026-05-03 11:58:02'),
(5, 'Royal Theatre', 'Thessaloniki', 'Historic theatre with classic and modern productions.', '2026-05-03 11:58:02'),
(6, 'Municipal Theatre', 'Piraeus', 'Elegant theatre near the port of Piraeus.', '2026-05-03 11:58:02'),
(7, 'Ancient Theatre of Epidaurus', 'Epidaurus', 'Open-air ancient theatre for Greek drama.', '2026-05-03 11:58:02'),
(8, 'Rialto Theatre', 'Limassol', 'Cultural theatre hosting international performances.', '2026-05-03 11:58:02');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Test User', 'test@test.com', '$2b$10$bnYRmzssXygVlEToBF5vy.exYs7cfU6nP5btABYpU7lUkGj.Mghx.', '2026-04-30 12:35:40'),
(2, 'Nikolas', 'nikolas@gmail.com', '$2b$10$uY6zMzwXYakrZtbc0GWiu.IMmCga174d37ln6nXgNlZcnonFm0hmi', '2026-04-30 12:41:28'),
(3, 'Χρήστος', 'chris@gmail.com', '$2b$10$nYxndd87stxYleGNjt9W/OaVoRYWy9IHvBhL7SAO56BZD2HvJvkXK', '2026-04-30 12:47:08'),
(4, 'Βαγγέλης ', 'vaggelis@gmail.con', '$2b$10$i4x9W95NjgPqRumlFzG6fuU9qUS5bjuDH5dgSoaMeHJ.Nn6kUzp6m', '2026-04-30 13:03:33');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `showtime_id` (`showtime_id`);

--
-- Ευρετήρια για πίνακα `reservation_seats`
--
ALTER TABLE `reservation_seats`
  ADD PRIMARY KEY (`reservation_id`,`seat_id`),
  ADD KEY `seat_id` (`seat_id`);

--
-- Ευρετήρια για πίνακα `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`seat_id`),
  ADD UNIQUE KEY `showtime_id` (`showtime_id`,`seat_row`,`seat_number`);

--
-- Ευρετήρια για πίνακα `shows`
--
ALTER TABLE `shows`
  ADD PRIMARY KEY (`show_id`),
  ADD KEY `theatre_id` (`theatre_id`);

--
-- Ευρετήρια για πίνακα `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`showtime_id`),
  ADD KEY `show_id` (`show_id`);

--
-- Ευρετήρια για πίνακα `theatres`
--
ALTER TABLE `theatres`
  ADD PRIMARY KEY (`theatre_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT για πίνακα `seats`
--
ALTER TABLE `seats`
  MODIFY `seat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=275;

--
-- AUTO_INCREMENT για πίνακα `shows`
--
ALTER TABLE `shows`
  MODIFY `show_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT για πίνακα `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `showtime_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT για πίνακα `theatres`
--
ALTER TABLE `theatres`
  MODIFY `theatre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`showtime_id`);

--
-- Περιορισμοί για πίνακα `reservation_seats`
--
ALTER TABLE `reservation_seats`
  ADD CONSTRAINT `reservation_seats_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`),
  ADD CONSTRAINT `reservation_seats_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`seat_id`);

--
-- Περιορισμοί για πίνακα `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`showtime_id`);

--
-- Περιορισμοί για πίνακα `shows`
--
ALTER TABLE `shows`
  ADD CONSTRAINT `shows_ibfk_1` FOREIGN KEY (`theatre_id`) REFERENCES `theatres` (`theatre_id`);

--
-- Περιορισμοί για πίνακα `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
