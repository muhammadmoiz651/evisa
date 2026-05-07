-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2025 at 07:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-visa project`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `accommodation_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `price_weekly` int(11) NOT NULL,
  `price_monthly` int(11) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `available` tinyint(1) NOT NULL,
  `type` enum('apartment','dormitory','hostel','residence') NOT NULL,
  `city` varchar(100) NOT NULL,
  `image` text NOT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `longitude` decimal(10,6) NOT NULL,
  `details_url` varchar(255) DEFAULT NULL,
  `bookingUrl` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `accommodations`
--

INSERT INTO `accommodations` (`accommodation_id`, `name`, `location`, `price_weekly`, `price_monthly`, `rating`, `available`, `type`, `city`, `image`, `latitude`, `longitude`, `details_url`, `bookingUrl`) VALUES
(1, 'Residencia Universitaria San Juan Bosco', 'Central Barcelona', 401, 1622, 4.7, 1, 'apartment', 'barcelona', 'Assests/pictures/accomudation1.jfif', 41.385100, 2.173400, 'http://localhost:3000/accommodationdetails', 'https://www.vitastudent.com/en/city-barcelona/'),
(2, 'Cité Internationale Universitaire de Paris', 'Near Sorbonne University', 200, 800, 4.5, 1, 'dormitory', 'paris', 'Assests/pictures/accomudation2.avif', 48.856600, 2.352200, 'http://localhost:3000/accommodationdetails1', 'https://book.cohabs.com/paris/paris-student-housing-video?utm_source=google&utm_medium=cpc&utm_campaign=22411766385&utm_content=744543637620&utm_term=student%20housing%20paris&utm_adgroup=180152352160&utm_device=c&utm_matchtype=b&bldzrcampaign=paris_gener'),
(3, 'The 4 You Hostel Munich', 'Hirtenstraße 18, 80335 München, Germany', 150, 600, 4.3, 1, 'hostel', 'munich', 'Assests/pictures/accomudation3.jfif', 48.135100, 11.582000, 'http://localhost:3000/accommodationdetails2', 'https://the4you.de/hostel-hotel/'),
(4, 'Studélites Le Capitole', '10 Rue Fulton, 75013 Paris, France Near École Normale Supérieure', 239, 956, 4.5, 1, 'dormitory', 'paris', '/Assests/pictures/stuparis1.jpg', 48.819239, 2.338281, 'http://localhost:3000/accommodationdetails3', 'https://www.studapart.com/en/accommodation-Paris/Studelites-Le-Capitole/residence/1708'),
(5, 'StudentenWOHNHEIM Berlin', 'Central Berlin Near Humboldt University of Berlin', 200, 400, 4.4, 1, 'residence', 'berlin', 'Assests/pictures/accomudation5.avif', 52.520000, 13.405000, 'http://localhost:3000/accommodationdetails4', 'https://www.stw.berlin/en/housing/housing-portal.html'),
(6, 'Hostal Madrid Sol', 'Principe,18, 4ºizq, Madrid, Spain Near Universidad Politécnica de Madrid', 140, 560, 4.1, 1, 'hostel', 'madrid', 'Assests/pictures/accomudation6.jfif', 40.416800, -3.703800, 'http://localhost:3000/accommodationdetails5', 'https://hostalsol.madridhotels360.net/en/'),
(7, 'Studentenwerk München Dormitory', 'Leopoldstraße 15, 80802 München, Germany', 100, 400, 4.0, 1, 'dormitory', 'munich', 'Assests/pictures/sw1.jpg', 48.135100, 11.582000, 'http://localhost:3000/accommodationdetails6', 'https://www.studierendenwerk-muenchen-oberbayern.de/en/accommodation/application/online-application/#0:~:text=Start%20Online%20Application'),
(8, 'Hotel WunderLocke Munich', 'Gmunder Strasse 27, 81379 Munich, Germany', 595, 2550, 8.6, 1, 'dormitory', 'munich', '/Assests/pictures/wl.jpg', 48.101300, 11.521100, 'http://localhost:3000/accommodationdetails7', 'https://wunderlocke.getmunichhotels.com/en/?from=2025-05-14&to=2025-05-15&adults=2&children=0&_1747171337007&clirder=1https://wunderlocke.getmunichhotels.com/en/#rooms'),
(9, 'The FIZZ München', 'Landsberger Str. 139, 80339 München, Germany', 300, 1402, 4.3, 1, 'hostel', 'Munich', '/Assests/pictures/fizz.jpg', 48.139100, 11.537800, 'http://localhost:3000/accommodationdetails8', 'https://www.the-fizz.com/en/search/?searchcriteria=BUILDING:THE_FIZZ_MUENCHEN;AREA:MUENCHEN;');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `university_name` varchar(150) DEFAULT NULL,
  `program_type` varchar(50) DEFAULT NULL,
  `applied_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `name`, `email`, `university_name`, `program_type`, `applied_at`) VALUES
(13, 'M. Moiz', 'moizmister786@gmail.com', 'Paris-Saclay University', 'Undergraduate', '2025-04-26 19:32:12'),
(17, 'M. Moiz', 'moizmister786@gmail.com', 'Ludwig Maximilian University of Munich (LMU)', 'Master', '2025-04-26 19:57:32'),
(152, 'Nishat Fatima', 'fatimanishat407@gmail.com', 'Munich University of Applied Sciences (HM)', 'Full Degree Program', '2025-05-16 21:41:55');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` varchar(100) NOT NULL,
  `sender` varchar(10) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `timestamp` varchar(10) DEFAULT NULL,
  `userName` varchar(100) DEFAULT NULL,
  `advisorName` varchar(100) DEFAULT NULL,
  `advisorRegion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `sender`, `text`, `timestamp`, `userName`, `advisorName`, `advisorRegion`) VALUES
('r7qdvrg7ay9mar11cj5', 'advisor', 'gh beta', '21:42', NULL, 'Advisor France', 'France');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `country_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`country_id`, `name`) VALUES
(1, 'france'),
(3, 'germany'),
(2, 'spain');

-- --------------------------------------------------------

--
-- Table structure for table `cv_data`
--

CREATE TABLE `cv_data` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `experiences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`experiences`)),
  `education` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`education`)),
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `cv_data`
--

INSERT INTO `cv_data` (`id`, `full_name`, `title`, `email`, `phone`, `about`, `photo`, `experiences`, `education`, `skills`) VALUES
(7, 'Muhammad Moiz Rashad', 'Software Engineering', 'mmoizrashad@gmail.com', '03447562543', 'i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. ', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0sAAAD5CAIAAAB5zDnCAAAAKnRFWHRjb3B5bGVmdABHZW5lcmF0ZWQgYnkgaHR0cHM6Ly9wbGFudHVtbC5jb212zsofAAABe2lUWHRwbGFudHVtbAABAAAAeJxlkl1PwjAUhu/7K064gosRBoOQhRCUrwSZEibc13KYjV1r+oES43+3WwY47UXT9nnP6Zu+nRhLtXW5IAKPFqwCz', '[{\"company\":\"Ezitech compnay \",\"position\":\"Webb developer \",\"duration\":\"1 year \",\"description\":\"i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. \"}]', '[{\"institution\":\"University of Gujrat \",\"degree\":\"BS Software Engineering\",\"year\":\"2024\"}]', '[{\"name\":\"html,\",\"level\":\"100\"},{\"name\":\"CSS\",\"level\":\"75\"},{\"name\":\"Javascript\",\"level\":\"50\"},{\"name\":\"Backend Node.js\",\"level\":\"50\"},{\"name\":\"Database My sql\",\"level\":\"50\"}]'),
(8, 'Muhammad Moiz Rashad', 'Software Engineering', 'mmoizrashad@gmail.com', '03447562543', 'i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. ', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0sAAAD5CAIAAAB5zDnCAAAAKnRFWHRjb3B5bGVmdABHZW5lcmF0ZWQgYnkgaHR0cHM6Ly9wbGFudHVtbC5jb212zsofAAABe2lUWHRwbGFudHVtbAABAAAAeJxlkl1PwjAUhu/7K064gosRBoOQhRCUrwSZEibc13KYjV1r+oES43+3WwY47UXT9nnP6Zu+nRhLtXW5IAKPFqwCz', '[{\"company\":\"Ezitech compnay \",\"position\":\"Webb developer \",\"duration\":\"1 year \",\"description\":\"i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. \"}]', '[{\"institution\":\"University of Gujrat \",\"degree\":\"BS Software Engineering\",\"year\":\"2024\"}]', '[{\"name\":\"html,\",\"level\":\"100\"},{\"name\":\"CSS\",\"level\":\"75\"},{\"name\":\"Javascript\",\"level\":\"50\"},{\"name\":\"Backend Node.js\",\"level\":\"50\"},{\"name\":\"Database My sql\",\"level\":\"50\"}]'),
(9, 'Muhammad Moiz Rashad', 'Software Engineering', 'mmoizrashad@gmail.com', '03447562543', 'i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. ', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0sAAAD5CAIAAAB5zDnCAAAAKnRFWHRjb3B5bGVmdABHZW5lcmF0ZWQgYnkgaHR0cHM6Ly9wbGFudHVtbC5jb212zsofAAABe2lUWHRwbGFudHVtbAABAAAAeJxlkl1PwjAUhu/7K064gosRBoOQhRCUrwSZEibc13KYjV1r+oES43+3WwY47UXT9nnP6Zu+nRhLtXW5IAKPFqwCz', '[{\"company\":\"Ezitech compnay \",\"position\":\"Webb developer \",\"duration\":\"1 year \",\"description\":\"i am professional web developer. i am professional web developer. i am professional web developer. i am professional web developer. \"}]', '[{\"institution\":\"University of Gujrat \",\"degree\":\"BS Software Engineering\",\"year\":\"2024\"}]', '[{\"name\":\"html,\",\"level\":\"100\"},{\"name\":\"CSS\",\"level\":\"75\"},{\"name\":\"Javascript\",\"level\":\"50\"},{\"name\":\"Backend Node.js\",\"level\":\"50\"},{\"name\":\"Database My sql\",\"level\":\"50\"}]'),
(10, 'lkj', 'lkj', 'lkj', 'lkj', 'lkj', 'data:image/webp;base64,UklGRogXAQBXRUJQVlA4IHwXAQBQywOdASroAzsCPok0kkg1sS6vtn6aurARCWJuUACxJ8QdT8hcbKwX0f97sz9T8vTnn+O8Hf7Pw0eyfsBcEDSL5yc9v/xekfPm81v2Cqf8FEKvM8TyveW/HiOt/d7o/iv/H5tnu3gO/7Pq4/wHqC/3H0rf+f1ffvR6if3N/dX3sf/T+6fuu/0fqEf4z/r+t/+//ucf3X/3f///', '[{\"company\":\"lk\",\"position\":\"jlk\",\"duration\":\"jlk\",\"description\":\"jlk\"}]', '[{\"institution\":\"jkl\",\"degree\":\"jlk\",\"year\":\"j\"}]', '[{\"name\":\"klj\",\"level\":\"50\"}]'),
(11, 'lkj', 'lkj', 'lkj', 'lkj', 'lkj', 'data:image/webp;base64,UklGRogXAQBXRUJQVlA4IHwXAQBQywOdASroAzsCPok0kkg1sS6vtn6aurARCWJuUACxJ8QdT8hcbKwX0f97sz9T8vTnn+O8Hf7Pw0eyfsBcEDSL5yc9v/xekfPm81v2Cqf8FEKvM8TyveW/HiOt/d7o/iv/H5tnu3gO/7Pq4/wHqC/3H0rf+f1ffvR6if3N/dX3sf/T+6fuu/0fqEf4z/r+t/+//ucf3X/3f///', '[{\"company\":\"lk\",\"position\":\"jlk\",\"duration\":\"jlk\",\"description\":\"jlk\"}]', '[{\"institution\":\"jkl\",\"degree\":\"jlk\",\"year\":\"j\"}]', '[{\"name\":\"klj\",\"level\":\"50\"}]'),
(12, 'Muhammad Moiz Rashad', 'software enginerring', 'mmoizrashad@gmail.com', '0344 7562543', 'askdkjaslkdjlkasjdklasjkdl', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMQEhUTExMWFhUXGR4XGBgXGBogGRgYFxgXGBgaGRgYHSggGhslHRcYITIhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBEQACEQEDEQH/', '[{\"company\":\"lkasjdlk\",\"position\":\"laksjd\",\"duration\":\"laksjd\",\"description\":\"laskdj\"}]', '[{\"institution\":\"lkj\",\"degree\":\"lkj\",\"year\":\"lk\"}]', '[{\"name\":\"jlk\",\"level\":\"50\"}]'),
(13, 'lk', 'lk', 'jlk', 'jlk', 'j', 'http://localhost:3000/Assests/pictures/upload.png', '[{\"company\":\"lkj\",\"position\":\"lkj\",\"duration\":\"lkj\",\"description\":\"lk\"}]', '[{\"institution\":\"jlk\",\"degree\":\"jlk\",\"year\":\"jkl\"}]', '[{\"name\":\"jlk\",\"level\":\"50\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `scholarships`
--

CREATE TABLE `scholarships` (
  `scholarship_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `university_id` int(11) NOT NULL,
  `degrees` varchar(500) NOT NULL,
  `deadline` datetime NOT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `country_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `apply_link` varchar(255) DEFAULT '#',
  `deadlineSecond` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `scholarships`
--

INSERT INTO `scholarships` (`scholarship_id`, `title`, `university_id`, `degrees`, `deadline`, `amount`, `country_id`, `type`, `apply_link`, `deadlineSecond`) VALUES
(1, 'IDEX International Master’s Scholarship', 1, 'Master', '2025-05-05 00:00:00', '10000 EUR/year + 1000 EUR travel', 1, 'Merit-based', 'http://localhost:3000/idex', NULL),
(2, 'Eiffel Excellence Scholarship', 2, 'Master, PhD', '2025-01-10 00:00:00', 'Masters: 1181 EUR/month | PhD: 1700 EUR/month', 1, 'Government-funded', 'http://localhost:3000/eiffel', NULL),
(3, 'TUM Scholarship for International Students', 3, 'Master', '2025-06-15 00:00:00', '500-1500 EUR/month', 3, 'Need-based', 'http://localhost:3000/tum', '2025-11-15'),
(4, 'UB Mobility Grants', 4, 'Bachelor, Master', '2025-06-09 00:00:00', '400-1000 EUR/month', 2, 'Exchange program', 'http://localhost:3000/ub', '2025-11-15'),
(5, 'Spanish Arts Scholarship', 5, 'Bachelor\'s, Masters', '2025-07-01 00:00:00', '€8,000/year', 2, 'Merit-based', 'http://localhost:3000/arts', NULL),
(6, 'UPF Talent Scholarship', 6, 'Master', '2025-06-20 00:00:00', '30-100% tuition waiver', 2, 'Merit-based', 'http://localhost:3000/upf', NULL),
(7, 'International Selection Scholarship', 7, 'Master', '2024-12-12 00:00:00', '€1,000 per month for up to 3 years ', 1, 'Fully Funded', 'http://localhost:3000/iss', NULL),
(8, 'Graduate School@UGA Incoming Scholarship', 8, 'Master', '2025-05-31 00:00:00', '€9,000 for the first year of Master\'s (M1) and €5,500 for the second year of Master\'s (M2)', 1, 'Partial Funding', 'http://localhost:3000/uga', NULL),
(9, 'UAM Scholarships for International Students', 9, 'All Degrees', '2025-08-25 00:00:00', 'Covers tuition fees and provides financial assistance for living expenses', 2, 'Full Funding', 'http://localhost:3000/uam', NULL),
(10, 'Spanish Ministry Scholarships (MEFP Grants)', 10, 'All Degrees', '2025-05-14 00:00:00', 'Varies depending on family income and academic performance', 2, 'Partial/Full Funding', 'http://localhost:3000/upc', NULL),
(11, 'Deutschlandstipendium', 11, 'All Degrees', '2025-07-15 00:00:00', '€300 per month', 3, 'Partial Funding', 'http://localhost:3000/deut', NULL),
(12, 'Germany Scholarship (Deutschlandstipendium)', 12, 'All Degrees', '2025-08-31 00:00:00', '€300 per month', 3, 'Partial Funding', 'http://localhost:3000/schdeuts', NULL),
(13, 'Eiffel Excellence Scholarship Program', 13, 'Master\'s, PhD', '2025-11-11 21:37:58', '€1,181/month for Master\'s, €1,800/month for PhD ', 1, 'Government', 'http://localhost:3000/eiffels', NULL),
(14, 'Study Scholarships - Master Studies for All Academic Disciplines (DAAD)', 16, 'Master', '2025-08-31 00:00:00', 'Scholarship payments of 992 euros a month', 3, 'Merit-based, Fully-funded', 'http://localhost:3000/daad', '2025-01-01'),
(15, 'KAAD Scholarship for International Students', 17, 'Master & PhD', '2025-06-30 18:33:17', 'For Master’s students: 992 euros/month. For Doctoral/Ph.D. students: up to 1,300 euros/month', 3, 'Merit-based, Fully-funded', 'http://localhost:3000/kaad', '0000-00-00'),
(16, 'The MBS Education Fund Scholorship', 20, 'Bachelor, Master', '2025-12-01 02:33:21', 'Based on student\'s individual needs', 3, 'Need-Based Funding', 'http://localhost:3000/schmbs', '0000-00-00'),
(17, 'Excellence Scholarship (Merit-Based)', 21, 'Master', '2025-07-31 00:00:00', 'Covers between 10% and 50% of tuition fees', 3, 'Merit-Based', 'http://localhost:3000/muascholorship', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `study_guides`
--

CREATE TABLE `study_guides` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `pdf_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `study_guides`
--

INSERT INTO `study_guides` (`id`, `title`, `description`, `icon`, `pdf_file`) VALUES
(1, 'IELTS Listening Guide', 'Master IELTS listening with our comprehensive guide featuring practice exercises and expert tips', 'fas fa-headphones', 'https://bayanebartar.org/file-dl/library/IELTS1/IELTS-The-Complete-Guide-to-academic-Reading.pdf'),
(2, 'TOEFL Writing Guide', 'Learn effective writing strategies for TOEFL with sample essays and scoring guidelines', 'fas fa-pen-fancy', 'https://ztcprep.com/userfiles/4c215c11.pdf'),
(3, 'IELTS Reading Guide', 'Improve your reading comprehension skills with practice tests and time management tips', 'fas fa-book-reader', 'https://bayanebartar.org/file-dl/library/IELTS1/IELTS-The-Complete-Guide-to-academic-Reading.pdf'),
(4, 'Speaking Skills Guide', 'Enhance your speaking abilities with pronunciation exercises and conversation practice', 'fas fa-microphone', 'https://bayanebartar.org/file-dl/library/IELTS7/get-ielts-band-9-speaking/Get_IELTS_Band_9_Speaking.pdf'),
(5, 'Vocabulary Builder', 'Expand your vocabulary with interactive exercises and daily word challenges', 'fas fa-book', 'https://static.zollege.in/public/college_data/images/entrance/entrance_brochure/1681988176The%20Vocabulary%20Builder%20Workbook.pdf'),
(6, 'Mock Test', 'Prepare for exams with timed mock tests and detailed performance analysis', 'fas fa-clipboard-check', 'https://d19y2ugh44almm.cloudfront.net/IELTS+Practice+Test+(1).pdf');

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE `universities` (
  `university_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `country_id` int(11) NOT NULL,
  `degree` varchar(50) NOT NULL,
  `program` varchar(50) NOT NULL,
  `image` varchar(100) NOT NULL,
  `website` varchar(100) DEFAULT NULL,
  `programs` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`university_id`, `name`, `country_id`, `degree`, `program`, `image`, `website`, `programs`) VALUES
(1, 'École Normale Supérieure (ENS Paris)', 1, 'Undergraduate and Master and Engineering', 'STEM', '/Assests/pictures/Imperialuni.jpg', NULL, 'Bachelor of Science (Mathematics and Physics), Bachelor of Science (Mathematics and Computer Science), Bachelor of Science (Mathematics and Economics), MSc&T Data Science for Business, MSc&T Energy Environment: Science Technology and Management, MSc&T Internet of Things: Innovation and Management, MSc&T Artificial Intelligence and Advanced Visual Computing, MSc&T Cybersecurity: Threats and Defenses\r\nEngineering (Equivalent to Master), Ingénieur Polytechnicien Program (General Engineering with Specializations'),
(2, 'Paris 1 Pantheon-Sorbonne University', 1, 'Master', 'Arts and Social Sciences', '/Assests/pictures/technicaluni2.jpg', NULL, 'Economics & Management, Law & Political Science, History & Archaeology, Humanities & Social Sciences, International Relations, Arts & Cultural Management'),
(3, 'Technical University of Munich (TUM)', 3, 'Bachelor and Master', 'STEM', '/Assests/pictures/Cambridge.jpg', 'null', 'BSc in Aerospace,BSc in Chemical Engineering,BSc in Management and Technology,BSc in Sustainable Management and Technology,MSc in Finance and Information Management,MSc in Aerospace'),
(4, 'Ludwig Maximilian University of Munich (LMU)', 3, 'Bachelor and Master', 'STEM and Arts', '/Assests/pictures/sorbonneuni3.jpg', NULL, 'Master in American History, Culture and Society, Master in Ancient Oriental Studies, MSc in Astrophysics, MSc in Biochemistry, MSc in Economics, Master in English Studies, MSc in Environment and Society, MSc in Epidemiology, MSc in Evolution, Ecology and Systematics, MSc in Financial and Insurance Mathematics, MSc in Geobiology and Paleobiology, MSc in Geomaterials and Geochemistry, MSc in Geophysics, MSc in Human Biology — Principles of Health and Disease, Executive Master in Insurance, Master in International Health, MSc in Journalism, Media & Globalisation, MSc in Logic and Philosophy of Science, Master in Management - International Triple Degree, Master in Management and Digital Technologies, MSc in Meteorology'),
(5, 'University of Barcelona (UB)', 2, 'Bachelor and Master', 'STEM and Arts', '/Assests/pictures/ethuni.jfif', NULL, '\r\nMaster in Advanced Materials, \r\nMaster in Advanced Studies in Archaeology, \r\nMaster in Advanced Studies in Art History, \r\nMaster in Advanced Studies in Catalan Language and Literature, \r\nMaster in Advanced Studies in Design - Barcelona, \r\nMaster in Advanced Studies in Spanish and Latin American Literature, \r\nMaster in Analytic Philosophy, \r\nMaster in Ancient Cultures and Languages, \r\nMaster in Anthropology and Ethnography, \r\nMaster in Applied Linguistics and Language Acquisition in Multilingual Contexts, \r\nMaster in Biomedical Engineering, \r\nMaster in Citizenship and Human Rights: Ethics and Politics, \r\nMaster in Cleaning Methods for Cultural Assets, \r\nMaster in Cognitive Science and Language, \r\nMaster in Conflict Mediation, \r\nMaster in Construction and Representation of Cultural Identity, \r\nMaster in Contemporary History and Today\'s World, \r\nMaster in Contemporary Thought and Classical Tradition, \r\nMaster in Cultural Heritage Management and Museology, \r\nMaster in Digital Content Management'),
(6, 'Pompeu Fabra University (UPF)', 2, 'Master', 'Arts and Social Sciences', '/Assests/pictures/sciencespouni.jpg', NULL, '\r\nBachelor in Political and Social Sciences, \r\nBachelor in Communication, \r\nBachelor in Law, \r\nBachelor in Economic and Business, \r\nBachelor in Engineering, \r\nBachelor in Humanities, \r\nBachelor in Medicine and Life Sciences, \r\nBachelor in Translation and Language Sciences, \r\nBachelor in Double Degrees, \r\nBachelor in Simultaneous Bachelor\'s Degrees, \r\nBachelor in Affiliated Centres, \r\nBachelor in Bachelor\'s Degrees in Alphabetical Order,\r\nMaster in Medicine and Life Sciences, \r\nMaster in Economic and Business Sciences, \r\nMaster in Political and Social Sciences, \r\nMaster in Communication, \r\nMaster in Law, \r\nMaster in Humanities and History, \r\nMaster in Information and Communication Technologies, \r\nMaster in Translation and Language Sciences'),
(7, 'Paris-Saclay University', 1, 'Master', 'STEM', '/Assests/pictures/oxford.jpg', NULL, 'Bachelor in Life Sciences, Bachelor in Mathematics and Computer Science, Bachelor in Physics, Bachelor in Chemistry, Master in Artificial Intelligence, Master in Computer Science, Master in Data Science, Master in Physics, Master in Mathematics'),
(8, 'Université Grenoble Alpes', 1, 'Masters', 'Stem, Business and Management', '/Assests/pictures/heidelberguni.jpg', NULL, 'Bachelor\'s in Economics and Management, Bachelor\'s in International Business and Management, DUT in Civil Engineering and Sustainable Construction, BUT in Civil Engineering and Sustainable Construction, Professional Bachelor\'s in Computer Networks and Telecommunication, Master\'s in Biology, Master\'s in Chemistry, Master\'s in Civil Engineering, Master\'s in Computer Science, Master\'s in Corporate Management and Administration, ENSE3 - Energy, Water, and Environmental Sciences, Ensimag - Applied Mathematics and Computer Science, Phelma - Physics, Electronics, and Materials Science, ESISAR - Advanced Systems and Networks, Polytech Grenoble - Various Engineering Disciplines, Doctoral Programs in Physics, Doctoral Programs in Chemistry, Doctoral Programs in Mathematics, Doctoral Programs in Engineering, Doctoral Programs in Humanities and Social Sciences'),
(9, 'Autonomous University of Madrid (UAM)', 2, 'Undergraduate', 'Arts,STEM', '/Assests/pictures/ecoleuni.jfif', NULL, 'Bachelor\'s in English Studies, Bachelor\'s in International Studies, Bachelor\'s in Primary Education, Bachelor\'s in Psychology, Bachelor\'s in Business Administration, Master\'s in Bioinformatics and Computational Biology, Master\'s in Molecular Biomedicine, Master\'s in International Economics, Master\'s in International Relations, Master\'s in Theoretical Physics'),
(10, 'Polytechnic University of Catalonia (UPC)', 2, 'Undergraduate', 'STEM', '/Assests/pictures/oncampusuni.png', NULL, '\r\nBachelor in Aerospace Engineering, \r\nBachelor in Applied Sciences, \r\nBachelor in Architecture, Urbanism and Building Construction, \r\nBachelor in Biosystems and Agri-Food Engineering, \r\nBachelor in Business Management and Organisation, \r\nBachelor in Civil Engineering, \r\nBachelor in Design and Multimedia Technology, \r\nBachelor in Health Sciences and Technology, \r\nBachelor in Industrial Engineering, \r\nBachelor in Informatics Engineering, \r\nBachelor in Naval, Marine and Nautical Engineering, \r\nBachelor in Telecommunications Engineering, \r\nBachelor in Double Degrees,\r\nMaster in Aerospace Engineering, \r\nMaster in Applied Sciences, \r\nMaster in Architecture, Urbanism and Building Construction, \r\nMaster in Biosystems and Agri-Food Engineering, \r\nMaster in Business Management and Organisation, \r\nMaster in Civil Engineering, \r\nMaster in Design and Multimedia Technology, \r\nMaster in Health Sciences and Technology, \r\nMaster in Industrial Engineering, \r\nMaster in Informatics Engineering, \r\nMaster in Naval, Marine and Nautical Engineering, \r\nMaster in Telecommunications Engineering, \r\nMaster in Double Degrees'),
(11, 'Humboldt University of Berlin', 3, 'Undergraduate', 'Arts, STEM, Humanities', '/Assests/pictures/bordeaux.jpg', NULL, 'Bachelor in Agricultural and Horticultural Sciences , \r\nBachelor in Area Studies Asia/Africa  ,\r\nBachelor in Biology  ,\r\nBachelor in Biophysics  ,\r\nBachelor in Business Administration , \r\nBachelor in Chemistry  ,\r\nBachelor in Computer Science  ,\r\nBachelor in Computer Science, Mathematics and Physics  ,\r\nBachelor in Deaf Studies , \r\nBachelor in East and Central European Studies , \r\nBachelor in Economics  ,\r\nBachelor in Geography , \r\nBachelor in Islamic Theology , \r\nBachelor in Mathematics  ,\r\nBachelor in Physics  ,\r\nBachelor in Psychology  ,\r\nBachelor in Rehabilitation Pedagogy , \r\nBachelor in Scandinavian Studies , \r\nBachelor in Social Sciences , \r\nBachelor in Sport Science  ,\r\n, M.Sc. in Informatics, M.A. in Information Science, M.Sc. in Integrated Natural Resource Management, M.A. in International Relations'),
(12, 'University of Heidelberg', 3, 'Undergraduate', 'Arts, STEM', '/Assests/pictures/audenciauni.jpg', NULL, 'Bachelor\'s in American Studies, Bachelor\'s in Anthropology, Bachelor\'s in Art History and Museology, Bachelor\'s in Assyriology, Bachelor\'s in Biochemistry, Bachelor\'s in Biology, Bachelor\'s in Biomedical Engineering, Bachelor\'s in Chemistry, Bachelor\'s in Computer Science, Bachelor\'s in Criminology, Bachelor\'s in Data Analytics, Bachelor\'s in Education, Bachelor\'s in English, Bachelor\'s in Environmental and Watershed Science, Bachelor\'s in Environmental Science & Sustainability, Bachelor\'s in Exercise Science, Bachelor\'s in Finance, Master\'s in Biology, Master\'s in Biomedical Engineering, Master\'s in Chemistry, Master\'s in Computer Science, Master\'s in Criminology, Master\'s in Data Analytics, Master\'s in Education, Master\'s in English, Master\'s in Environmental Science, Master\'s in Finance, Master\'s in Gender Studies, Master\'s in History, Master\'s in International Relations, Master\'s in Law'),
(13, 'Université Paris Cité', 1, 'Undergraduate, Master\'s, Specialized', 'STEM, Arts, Social Sciences, Business, Health, Law', '/Assests/pictures/paris.jpg', 'https://www.u-paris.fr/en', 'Bachelor in Computer Science, Bachelor in Economics and Management, Bachelor in History, Bachelor in Life Sciences, Bachelor in Mathematics, Bachelor in Law, Master in Computer Science, Master in Data Science, Master in Finance, Master in Public Health, Master in Artificial Intelligence, Master in International Business, Master in Cybersecurity, Master in Digital Marketing, Master in Environmental Science, Master in Business Administration (MBA), Master in Biomedical Sciences, Master in Artificial Intelligence and Robotics'),
(14, 'University of Mannheim (Universität Mannheim)', 3, 'Undergraduate, Master\'s, Specialized', 'STEM, Social Sciences, Economics, Business, Politi', '/Assests/pictures/mannheim.jpg', 'https://www.uni-mannheim.de/en/', 'Bachelor in Business Administration, Bachelor in Economics, Bachelor in Social Sciences, Bachelor in Political Science, Bachelor in Business Informatics, Bachelor in Mathematics, Master in Business Administration, Master in Business Informatics, Master in Economics, Master in Political Science, Master in Sociology, Master in Data Science'),
(15, 'Universidad Politécnica de Madrid', 2, 'Undergraduate, Master\'s, Specialized', 'STEM, Engineering, Architecture, Design, Business,', '/Assests/pictures/PolytechnicMadrid.jpg', 'https://www.upm.es', '\r\nMaster in European Master in Software Engineering,\r\nMaster in Advanced Innovative Recycling (AMIR Master),\r\nMaster in Biomedical Engineering,\r\nMaster in Computational Biology,\r\nMaster in Data Science,\r\nMaster in Digital Innovation,\r\nMaster in the Internet of Things (IoT),\r\nMaster in Industrial Electronics,\r\nMaster in Internet of Things,\r\nMaster in Materials Engineering,\r\nMaster in Neurotechnology,\r\nMaster in Photovoltaic Solar Energy,\r\nMaster in Software and Systems,\r\nMaster in Signal Theory and Communications,\r\nMaster in Telecommunication Engineering,\r\nMaster in Wireless Communications, Bachelor in English'),
(16, 'Munich University of Applied Sciences (HM)', 3, 'Bachelor, Master', 'Engineering, Computer Science, Business, Industria', '/Assests/pictures/ham.jpg', 'https://www.hm.edu/en/index.en.html', 'Bachelor in Business Administration,\r\n\r\nBachelor in Business Administration and Management,\r\n\r\nBachelor in Electrical Engineering - Electromobility,\r\n\r\nBachelor in Electrical Engineering and Information Technology,\r\n\r\nBachelor in Automotive Technology and Mobility,\r\n\r\nBachelor in Aerospace Engineering,\r\n\r\nBachelor in Mechanical Engineering,\r\n\r\nBachelor in Renewable Energies - Electrical Engineering,\r\n\r\nBachelor in Technical Communication,\r\n\r\nBachelor in Tourism Management,\r\n\r\nMaster in Applied Research in Engineering Sciences,\r\n\r\nMaster in Architecture,\r\n\r\nMaster in Civil Engineering,\r\n\r\nMaster in Business Tax Theory,\r\n\r\nMaster in Computational Engineering,\r\n\r\nMaster in Data Analytics,\r\n\r\nMaster in Electrical Engineering and Information Technology,\r\n\r\nMaster in Vehicle Mechatronics,\r\n\r\nMaster in Automotive Technology,\r\n\r\nMaster in Building Technology'),
(17, 'Katholische Stiftungshochschule München KSH Munich', 3, 'BA, MA, MSc', 'Social Sciences, Education, Health Sciences\r\n', '/Assests/pictures/ksh.jpg', NULL, 'Bachelor in Social Work, Bachelor in Social Work (dual - Munich), Bachelor in Social Work (dual - Benediktbeuern), Bachelor in Social Work 2plus, Bachelor in Part-time Social Work, Bachelor in Childhood Education, Bachelor in Childhood Education (part-time/digital), Bachelor in Childhood Education for Foreign Students (BEFAS and BEFAS+), Bachelor in Healthcare Management, Master in Applied Educational Sciences / Pedagogy, Master in Social Work as a Science and Profession, Master in Management of Social and Healthcare Enterprises, Master in Education and Education Management in the Health System, Master in Midwifery-Led Care, Master in Applied Health Services Research'),
(18, 'Academy of Fine Arts, Munich', 3, 'Bachelor, Master, Diploma', 'Arts', '/Assests/pictures/art.jpg', NULL, 'Architecture and Art, Visual arts and therapy, Free Art, Art education'),
(19, 'Hochschule für Fernsehen und Film München', 3, 'Cinema and TV Film', 'Arts', '/Assests/pictures/hff.jpg', 'https://aufnahme.hff-muc.de/campus/campus/Portal/SelectApplicationProcedure', 'Dept. I - Media Studies, Dept. II - Technology, Dept. III - Feature Film and Television Feature, Dept. IV - Film and Television Documentary, Dept. V - Production and Media Business, Dept. VI - Screenplay'),
(20, 'Munich Business School (MBS)', 3, 'Bachelor, Master, MBA, Doctorate', 'Business & Management', '/Assests/pictures/mbs.jpg', 'https://www.munich-business-school.de/', 'Bachelor International Busines, Bachelor International Business, Master International Business , Master International Marketing and Brand Management , MBA General Management, Doctor of Business Administration (DBA), Graduate Exchange Semester'),
(21, 'Macromedia University of Applied Sciences – Munich', 3, 'Master', 'STEM, Arts, Business', '/Assests/pictures/macro.jpg', 'https://www.macromedia-fachhochschule.de/en/apply-online/online-application/', 'Master in Brand Management, Master in Business Management, Master in Design Management, Master in Digital Media Business, Master in MBA Data Analytics, Master in MBA Marketing, Master in MBA Master of Business Administration, Master in Media and Communication Management, Master in Strategic Marketing'),
(22, 'Hochschule Fresenius – Munich Campus', 3, 'Bachelor, Master', 'Business , Entrepreneurship, Management', '/Assests/pictures/fua.jpg', 'https://www.hs-fresenius.com/application/', 'Bachelor in International Business Management (B.A.),Master in Bioanalytical Chemistry and Pharmaceutical Analysis, Master in Biochemical Engineering, Master in Biomedicine, Master in Computer Science, Master in E-Commerce & Logistics, Master in Industrial Engineering and International Management, Master in International Business Management, Master in International Health Economics & Pharmacoeconomics, Master in International Management (For Non-Business Graduates), Master in Luxury Management, Master in Marketing & Brand Management, Master in MBA, Master in MBA – Fast track, Master in Medical and Pharmaceutical Biotechnology, Master in SAP Engineering & Analytics, Master in Sustainability in Fashion and Creative Industries (M.A.)');

-- --------------------------------------------------------

--
-- Table structure for table `university_details`
--

CREATE TABLE `university_details` (
  `detail_id` int(11) NOT NULL,
  `university_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `world_ranking` int(11) DEFAULT NULL,
  `top_programs` text DEFAULT NULL,
  `application_deadlines` text DEFAULT NULL,
  `undergraduate_application_link` varchar(255) DEFAULT NULL,
  `masters_application_link` varchar(255) DEFAULT NULL,
  `guidance` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `university_details`
--

INSERT INTO `university_details` (`detail_id`, `university_id`, `country_id`, `world_ranking`, `top_programs`, `application_deadlines`, `undergraduate_application_link`, `masters_application_link`, `guidance`) VALUES
(1, 1, 1, 291, 'Mathematics + 1 additional science subject at advanced level, English proficiency (C1 level), GPA around 3.0 to 3.5 (4.0 scale), IELTS / TOEFL.', 'Round 1: 5 November 2024 | Round 2: 7 January 2025 | Round 3: 13 February 2025 ', 'https://gargantua.polytechnique.fr/siatel-web/app/linkto/mICYYYSgETY6?aw=1', 'https://candidatures.polytechnique.fr/candidatures-mutualisees/logincandidature/?cursus=', 'For undergraduate admissions, candidates must submit academic transcripts, personal statements, and references. Admission requires strong performance in Mathematics and Sciences. For master programs, a Bachelor\'s degree in relevant fields is required, alongside a strong academic record, references, and motivation letter.'),
(2, 2, 1, 283, 'Economics, Law, Political Science, History, Philosophy, Geography', 'Undergraduate (DAP): 1 Oct 2025 – 15 Dec 2025 | Masters (Mon Master): 25 Feb 2025 – 24 Mar 2025', 'https://international.pantheonsorbonne.fr/en/join-paris-1-pantheon-sorbonne/full-degree-student', 'https://www.campusfrance.org/fr/candidature-procedure-etudes-en-france', 'For both undergraduate and master\'s programs, apply via the Études en France platform or the Mon Master portal.'),
(3, 3, 3, 28, 'Bachelor, Master', 'Bachelor\'s Programs: May 15 – July 15, 2025 | Master\'s Programs: January 1 – May 31, 2025', 'https://campus.tum.de/tumonline/!wbSelbstReg.maskStPersDaten', 'https://www.tum.de/en/studies/application/application-info-portal/online-application/onlineapplication-bachelor-master', 'A world-renowned institution dedicated to excellence in education, research, and innovation. Join us in shaping the future through groundbreaking discoveries and transformative learning.'),
(4, 4, 3, 59, 'M.Sc Computer Science, M.Sc Data Science, M.Sc Physics, M.Sc Chemistry', 'Winter Semester: 15 May 2025 | Summer Semester: 15 November 2025', 'https://cms-cdn.lmu.de/media/lmu/downloads/workspace/international-office/declaration-of-consent.pdf', 'https://lmu.moveon4.de/locallogin/6048bf17f9da40339b5735a6/eng#', 'Language Requirements: IELTS 6.5+ or TOEFL 90+ for English programs. No tuition fees, only semester contribution (~€150-300). Apply early for visa processing.'),
(5, 5, 2, 168, 'M.Sc Artificial Intelligence, M.Sc Data Science, M.Sc Biomedical Research, M.A Economics, LL.M International Law', 'Winter: 15 June 2025 | Summer: 15 November 2025', 'https://www.ub.edu/acad/estada/sol_alumne/identificacio_2025.php?lang=3', 'https://www.ub.edu/acad/estada/sol_alumne/identificacio_2025.php?lang=3', 'Language Requirements: IELTS 6.5+ or TOEFL 90+ for English programs. Spanish-taught programs require DELE B2. No application fee for EU students.'),
(6, 6, 2, 265, 'M.Sc Economics & Finance, M.Sc Data Science, M.Sc Biomedical Research, M.A Political Science, LL.M International Business Law', 'Application Cell 1: 15 November 2024 - 16 January 2025 |\r\n\r\nApplication Cell 2: 17 January 2025 - 06 March 2025 |\r\n\r\nApplication Cell 3: 07 March 2025 - 28 April 2025 |\r\n\r\nApplication Cell 4: 29 April 2025 - 05 June 2025 |\r\n\r\nApplication Cell 5: 21 July 2025 - 22 August 2025', 'https://www.upf.edu/en/web/masters/2_preinscripcio', 'https://gestioacademica.upf.edu/regis/controlreg/%5BmtoAlta%5DRegistroPublico?entradaPublica=true&destino=POST&idioma=en&pais=GB', 'Language: IELTS 6.5+ or TOEFL 90+. No Spanish required for English programs. Visa requires €7200/year proof. Top-ranked for Economics in Spain.'),
(7, 7, 1, 50, 'Physics, Mathematics, Engineering, Computer Science', 'Exchange programs May 15, 2025 | Spring Semester October 30, 2025 | May 5, 2025 with IDEX Scholarship ', 'https://ecandidat.universite-paris-saclay.fr/ecandidat/#!accueilView', 'https://inception.universite-paris-saclay.fr/en/creer-compte/', 'Paris-Saclay University offers detailed admission guidelines for international students. You can find specific information on the application process, requirements, and deadlines on their official website.'),
(8, 8, 1, 10, 'High School Certificate or Bachelor Degree, Strong Academic Background, English or French Language Proficiency (like IELTS/TOEFL or DELF/DALF), Motivation Letter, CV/Resume, Recommendation Letters', 'Master\'s Programs: April 30, 2025 | Exchange Programs:\r\nSemester 1 & Full-year mobility: May 30, 2025 | Graduate School@UGA: May 31, 2025 ', 'https://www.univ-grenoble-alpes.fr/education/how-to-apply/applying-and-registering/apply/apply-625777.kjsp', 'https://www.univ-grenoble-alpes.fr/education/how-to-apply/applying-and-registering/apply/apply-625777.kjsp', 'You can apply to Université Grenoble Alpes via the MonMaster platform for master programs, or Campus France portal if you are outside Europe. Specialized master programs have their own deadlines. English and French taught courses are available. Graduate Schools offer scholarships for excellent students.'),
(9, 9, 2, 198, 'English language, strong knowledge of international relations, IELTS', 'April 29th, 2025 – September 30th 2025', 'https://www.uam.es/uam/todos-grados', 'hhttps://www.uam.es/uam/todos-grados', 'For more details about admissions, please visit the official UAM guidance page.'),
(10, 10, 2, 601, 'English proficiency, (TOEFL/IELTS)', 'Application Submit: December 12, 2024', 'https://accesuniversitat.gencat.cat/accesuniversitat/login', 'https://accesuniversitat.gencat.cat/accesuniversitat/login', 'For undergraduate programs, a minimum IELTS score of 6.0 or TOEFL score of 80+ is required. For Master’s programs, an IELTS score of 6.5 or TOEFL score of 90+ is needed. Students must apply through the official website links provided for each program. The deadlines are for the academic year 2025, with specific dates for undergraduate and master’s admissions. Students should check the official website for any additional specific eligibility requirements based on their field of study.'),
(11, 11, 3, 126, 'High school diploma (or equivalent), (TOEFL/IELTS), minimum GPA requirement, letter of recommendation, statement of purpose.', 'Degree programmes with NC:\r\n    Winter semester: 02 May to 31 May (cut-off deadline) |\r\n    Summer semester: 01 December to 15 January (cut-off deadline) |\r\n    Study programmes without NC:\r\n    Winter semester: 02 May to 15 June (cut-off deadline) |\r\n    Summer semester: 01 December to 15 January (cut-off deadline)', 'https://my.uni-assist.de/registrierung', 'https://my.uni-assist.de/registrierung', 'Complete your application on Uni-Assist platform and submit all required documents. Make sure to check program-specific requirements on the university website.'),
(12, 12, 3, 3, 'IELTS 6.5, TOEFL 80, GMAT/GRE for certain programs, Bachelor\'s degree or equivalent, Academic Transcripts, Letters of Recommendation', 'Undergraduate subjects with no admission restrictions and no required entrance examination| \r\nSummer: April 30,2025 | Winter 31 October, 2025 |\r\nUndergraduate subjects with entrance examination |\r\nSummer: February 01, 2025 | Winter: September 30, 2025 |\r\nMaster\'s degree programmers with access restrictions |\r\nSummer: April 30, 2025 | Winter 31 October, 2025', 'https://www.uni-heidelberg.de/en/study/application-enrolment/enrolment', 'https://www.uni-heidelberg.de/en/study/application-enrolment/enrolment', 'Heidelberg University, located in Germany, offers a variety of undergraduate and graduate programs. They require applicants to meet specific academic qualifications, language proficiency (IELTS/TOEFL), and submit relevant documents such as transcripts and recommendation letters. Each program may have specific additional requirements (e.g., GRE/GMAT). Please refer to the official program page for exact details.'),
(13, 13, 1, 40, 'IELTS, TOEFL, Letters of Recommendation, Motivation Letter, CV, Proof of Academic Transcripts', 'January 15, 2025 for Undergraduate, May 1, 2025 for Master\'s', 'https://www.campusfrance.org/fr/candidature-procedure-etudes-en-france', 'https://www.campusfrance.org/fr/candidature-procedure-etudes-en-france', 'Guidelines for admission: Applicants must have a high school diploma or equivalent for undergraduate programs. For master\'s programs, applicants must have a bachelor\'s degree or equivalent in a related field. Proof of English proficiency (TOEFL, IELTS) is required for non-native speakers. Some programs may require additional documents such as a motivation letter, recommendation letters, and a CV.'),
(14, 14, 3, 91, 'IELTS, TOEFL, GMAT (for Business programs)', 'Undergraduate programs 15 July, 2025 |\r\nMaster Programs: 15 May, or 31 May, 2025 depending on the study program | Spring semester 2026: 15 November, 2025', 'https://portal2.uni-mannheim.de/portal2/pages/cs/sys/portal/hisinoneStartPage.faces?page=Bewerbung', 'https://portal2.uni-mannheim.de/portal2/pages/cs/sys/portal/hisinoneStartPage.faces?page=Bewerbung', 'University of Mannheim provides guidance through their admissions office for international students, and offers assistance with visa requirements and scholarship opportunities.'),
(15, 15, 2, 321, 'IELTS, TOEFL, GRE (depending on program)', 'July for Fall intake, January for Spring intake', 'https://cuentas.upm.es/solicitud', 'https://cuentas.upm.es/solicitud', 'Applicants are required to submit English proficiency scores like IELTS, TOEFL, or equivalent. GRE is required for some graduate programs. A completed application form and relevant academic documents must be submitted by the application deadlines.'),
(16, 16, 3, 289, 'M.SC, Bachelor', 'Undergraduate: 02.05.2025 to 15.07.2025 | Master: 02.05.2025 to 15.06.2025', 'https://www3.primuss.de/cgi-bin/bew_anmeldung_v3/index.pl', 'https://www3.primuss.de/cgi-bin/bew_anmeldung_v3/index.pl', 'Munich University of Applied Sciences (HM) is one of Germany\'s leading universities of applied sciences, located in the heart of Munich. It offers industry-oriented and research-based programs designed to prepare students for the global job market. Known for its innovation, international collaboration, and modern campus environment, HM welcomes students from around the world to pursue high-quality education in fields like engineering, business, and digital technologies.'),
(17, 17, 3, 258, 'Social Work, Childhood Education, Applied Educational Sciences, Social Work as a Profession, Midwifery-Led Care', 'May 1 – July 31 (varies by program)', 'https://bewerbung.ksh-m.de/register-user', 'https://bewerbung.ksh-m.de/register-user', 'KSH Munich is a Catholic University of Applied Sciences offering highly practical and ethically focused programs in social work, childhood education, health management, and more. The university operates campuses in Munich and Benediktbeuern and emphasizes strong real-world orientation and values-driven learning.'),
(18, 18, 3, 201, 'Architecture and Art, Visual arts and therapy, Free Art, Art education', 'May 15, 2025', 'https://bewerbung.adbk.de/campus/campus/Portal/SelectApplicationProcedure?l=de&t=', 'https://bewerbung.adbk.de/campus/campus/Portal/SelectApplicationProcedure?l=de&t=', 'The Academy of Fine Arts, Munich (Akademie der Bildenden Künste München) is one of the leading institutions in Germany for fine arts education. It is highly competitive and offers individual mentorship from experienced professors.'),
(19, 19, 3, 7718, 'Cinema and TV Film, Documentary Film, Screenwriting, Cinematography', 'Cinema and TV Film degree program: May 12th - 16th, 2025; | Cinema and TV Film degree program: May 12th - 16th, 2025;| Documentary Film degree program: May 26th - 28th, 2025;| Documentary Film degree program : May 26th - 28th, 2025; |||Production and Media Management degree program: May 7-9, 2025; |Screenwriting degree program: June 3-5, 2025; |Cinematography: May 12-15, 2025; | Cinematography: May 20, 2025', 'https://my.uni-assist.de/', 'https://my.uni-assist.de/', 'Hochschule für Fernsehen und Film München (HFF München) is one of Germany’s most prestigious film schools, offering world-class programs in cinema and TV film production, documentary film, screenwriting, cinematography, and media management. The university has a strong emphasis on practical skills and prepares students for careers in the film and television industries. The school provides extensive support for both undergraduate and master’s programs, with unique opportunities for internships and industry connections.'),
(20, 20, 3, 91, 'Bachelor , Master , MBA ', 'September 1,2025', 'https://www.munich-business-school.de/en/online-application', 'https://www.munich-business-school.de/en/online-application', 'Munich Business School (MBS) is a top-ranked private university in Germany that offers business-focused education. The university provides Bachelor’s, Master’s, MBA, and DBA programs, all available in English or bilingual tracks. It places strong emphasis on practical training, innovation, entrepreneurship, and global exposure.'),
(21, 21, 3, 232, 'Buisness ', '22 May 2025', 'https://www.macromedia-fachhochschule.de/en/apply-online/online-application/', 'https://www.macromedia-fachhochschule.de/en/apply-online/online-application/', 'Macromedia University of Applied Sciences is one of Germany\'s leading private universities for media, communication, and management. The Munich campus offers a vibrant environment in one of Europe’s most dynamic cities. With strong industry connections, Macromedia emphasizes practical experience alongside academic knowledge. Its master’s programs focus on preparing students for leadership roles in brand, media, marketing, and data analytics sectors.'),
(22, 22, 3, 200, '(B.A. & M.Sc.), MBA ', 'winter semester: May 1, 2025 | Summer: December 1, 2025', 'https://www.hs-fresenius.com/application/', 'https://www.hs-fresenius.com/application/', 'Founded in 1848, Hochschule Fresenius is one of Germany’s oldest and most respected private universities of applied sciences. The Munich campus offers a modern, centrally located environment with strong ties to industry and innovation. International students benefit from small class sizes, practice-oriented teaching, and English-taught programs in business and management.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `google_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visa_details`
--

CREATE TABLE `visa_details` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `processing_time` varchar(100) DEFAULT NULL,
  `language_requirement` varchar(100) DEFAULT NULL,
  `proof_of_funds` varchar(100) DEFAULT NULL,
  `validity` varchar(100) DEFAULT NULL,
  `work_rights` varchar(100) DEFAULT NULL,
  `requirement_note` varchar(255) DEFAULT NULL,
  `apply_link` text DEFAULT NULL,
  `info_link` text DEFAULT NULL,
  `country_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `visa_details`
--

INSERT INTO `visa_details` (`id`, `title`, `image_url`, `processing_time`, `language_requirement`, `proof_of_funds`, `validity`, `work_rights`, `requirement_note`, `apply_link`, `info_link`, `country_name`) VALUES
(1, 'Student Visa (Long Stay)', 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', '2-3 weeks', 'DELF B2', '€615/month', 'Duration of studies', '20 hours/week', '>90 day studies', 'https://france-visas.gouv.fr/en/web/france-visas/online-application', 'https://france-visas.gouv.fr/en/student', 'France'),
(2, 'Student Visa (Type D)', 'https://flagcdn.com/w320/es.png', '2–4 weeks', 'DELE B1/B2', '€900/month', 'Duration of studies + 90 days', '20 hours/week during term, full-time during holidays', 'Required for studying in Spain for more than 90 days', 'https://www.exteriores.gob.es/Embajadas/islamabad/en/ServiciosConsulares/Paginas/Consular/Visado-de-estudios.aspx', 'https://www.exteriores.gob.es/en/EmbajadasConsulados/Documents/Consular/20210611-Formulario%20nacional%20espa%c3%b1ol-ingl%c3%a9s.pdf', 'Spain'),
(3, 'Student Visa', 'https://flagcdn.com/w320/de.png', '4–6 weeks', 'TestDaF/DSH', '€11,208/year', 'Up to 2 years (extendable)', '120 full days or 240 half days per year', 'Required for non-EU citizens studying in Germany for more than 90 days', 'https://videx.diplo.de/videx/visum-erfassung/videx-kurzfristiger-aufenthalt', 'https://visa.vfsglobal.com/pak/en/deu/apply-visa', 'Germany');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`accommodation_id`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`country_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `cv_data`
--
ALTER TABLE `cv_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD PRIMARY KEY (`scholarship_id`),
  ADD KEY `scholarships_ibfk_1` (`university_id`),
  ADD KEY `scholarships_ibfk_3` (`country_id`);

--
-- Indexes for table `study_guides`
--
ALTER TABLE `study_guides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`university_id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `university_details`
--
ALTER TABLE `university_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `university_details_ibfk_1` (`university_id`),
  ADD KEY `university_details_ibfk_2` (`country_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `visa_details`
--
ALTER TABLE `visa_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `accommodation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT for table `cv_data`
--
ALTER TABLE `cv_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `study_guides`
--
ALTER TABLE `study_guides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `university_details`
--
ALTER TABLE `university_details`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `visa_details`
--
ALTER TABLE `visa_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD CONSTRAINT `scholarships_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `universities` (`university_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scholarships_ibfk_3` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `universities`
--
ALTER TABLE `universities`
  ADD CONSTRAINT `universities_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`);

--
-- Constraints for table `university_details`
--
ALTER TABLE `university_details`
  ADD CONSTRAINT `university_details_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `universities` (`university_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `university_details_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
