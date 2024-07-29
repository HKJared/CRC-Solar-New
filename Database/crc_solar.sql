-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 29, 2024 lúc 06:35 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `crc_solar`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone_number` varchar(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(55) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `refresh_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admins`
--

INSERT INTO `admins` (`admin_id`, `account`, `password`, `fullname`, `phone_number`, `email`, `role`, `status`, `refresh_token`) VALUES
(0, 'nobody', '...............', 'Nobody', '', '', '', 1, NULL),
(1, 'admin', 'dfe3123a5ecb026fcae8e10227438d39359eaa2dc08222bd57665f2ecbc29ead', 'Adminstrator', '', '', 'Adminstrator', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzIyMTgwMTA0LCJleHAiOjE3MjIyNjY1MDR9.9VViWex0JE43YhtlcKm8c--azupC8a6FON6pwNoVteM'),
(2, 'vuq147@gmail.com', '8464248886c269dc23c0e871aa349c906f131b169d93d6075541f22e315b2234', 'Vũ Tiến Quyền', '0399348711', 'vuq147@gmail.com', 'data_admin', 1, NULL),
(3, 'nhnguyen', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 'Nguyễn Đình Hưng', '0943959698', 'nhkhungkhoi@gmail.com', 'data_admin', 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blogs`
--

CREATE TABLE `blogs` (
  `blog_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `tag` varchar(255) NOT NULL,
  `seo_title` varchar(255) NOT NULL,
  `main_image` varchar(255) NOT NULL,
  `is_outstanding` tinyint(1) NOT NULL DEFAULT 1,
  `category_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `language` varchar(2) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blogs`
--

INSERT INTO `blogs` (`blog_id`, `title`, `detail`, `tag`, `seo_title`, `main_image`, `is_outstanding`, `category_id`, `status`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Dịch vụ bảo dưỡng', '', '', '', '/image/gioi-thieu.png', 1, 1, 1, 'vn', 1, '2024-07-18 12:12:13', NULL, NULL),
(2, 'Dịch vụ sửa chữa', '', '', '', '/image/gioi-thieu.png', 1, 1, 1, 'vn', 1, '2024-07-18 12:12:13', NULL, NULL),
(3, 'Chính sách bảo hành', '', '', '', '/image/gioi-thieu.png', 1, 1, 1, 'vn', 1, '2024-07-18 12:12:53', NULL, NULL),
(4, 'ĐẠI HỘI CỔ ĐÔNG THƯỜNG NIÊN 2024 THÔNG QUA MỤC TIÊU KINH DOANH VỚI NHIỀU CHỈ TIÊU TÍCH CỰC', '<p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><br><span style=\"background-color:hsl( 0, 0%, 100% );color:hsl(0, 0%, 30%);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\"><strong>Sáng ngày 15/06/2024 tại Hà Nội, công ty Cổ phần CREATE CAPITAL VIỆT NAM tổ chức Đại hội đồng cổ đông thường niên 2024 với nhiều nội dung quan trọng được đệ trình và thông qua. Tổng số cổ đông và đại diện theo uỷ quyền hợp lệ của cổ đông thực tế tại thời điểm khai mạc Đại hội cổ đông thường niên năm 2024 là 24 người, sở hữu và đại diện cho 43.167.379 cổ phần, tương đương với 71,95% tổng số cổ phần có quyền biểu quyết của Công ty. Căn cứ theo quy định của Luật Doanh nghiệp và Điều lệ Công ty, đại hội cổ đông thường niên năm 2024 của Công ty cổ phần Create Capital Việt Nam đáp ứng đủ các điều kiện để tiến hành.</strong></span></span></p><hr><p>&nbsp;</p><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:6000/4000;border-style:none;box-sizing:border-box;margin-bottom:-4px;max-width:600px;outline:0px;vertical-align:middle;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-07-03-09-40-56-61.jpg\" alt=\"image 2024-07-03-09-40-56-61\" width=\"6000\" height=\"4000\" title=\"image 2024-07-03-09-40-56-61\"></figure><div style=\"-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;color:rgb(102, 102, 102);font-family:Montserrat, Arial, sans-serif;font-size:14px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;margin:0px;orphans:2;outline:0px;padding:0px;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\" align=\"center\"><p>&nbsp;</p><hr><p>&nbsp;</p></div><p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:white;color:rgb(36,36,36);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Đại hội đã nghe ông Mai Anh Tám đọc chương trình đại hội, quy chế làm việc và được các cổ đông dự họp nhất trí 100% số CP có quyền biểu quyết tham dự đại hội tán thành thông qua nội dung Chương trình Đại hội. Quy chế làm việc áp dụng tại đại hội.</span></span></p><p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:white;color:rgb(36,36,36);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Tại Đại hội ông Mai Anh Tám- Chủ tịch HĐQT trình bày trước Đại hội báo cáo hoạt động của Hội đồng quản trị năm 2023, kế hoạch và phương hướng hoạt động năm 2024.</span></span></p><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:6000/4000;border-style:none;box-sizing:border-box;margin-bottom:-4px;max-width:600px;outline:0px;vertical-align:middle;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-07-03-09-42-24-73.jpg\" alt=\"image 2024-07-03-09-42-24-73\" title=\"image 2024-07-03-09-42-24-73\" width=\"6000\" height=\"4000\"></figure><p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:rgb(251,251,251);color:black;font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Thông tin tại Đại hội cho thấy, đối mặt với những khó khăn và thuận lợi đan xen, năm 2023, HĐQT Công ty đã phối hợp với Ban Tổng Giám đốc luôn sâu sát, triển khai kịp thời, nhất quán các chính sách phù hợp. HĐQT chủ trương chỉ đạo các công tác đầu tư, sản xuất sớm hoàn thành theo kế hoạch đề ra nhằm đảm bảo các dây chuyền máy móc thiết bị hoạt động ổn định. Với sự đồng lòng, đoàn kết giữa Hội đồng quản trị. Ban Tổng Giám đốc và toàn thể CBCNV đã mang đến kết quả kinh doanh năm 2023 tương đối tích cực trong bối cảnh chung của nền kinh tế.</span></span></p><p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:rgb(251,251,251);color:black;font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Cụ thể doanh thu thuần đạt 354,3 tỷ, lợi nhuận sau thuế hợp nhất năm 2023 đạt 29,453 tỷ đạt 98,2% kế hoạch đề ra. Thu nhập bình quân người lao động 10 triệu đồng/ người/ tháng. Bên cạnh những khó khăn về suy thoái kinh tế nói chung, việc sát nhập nhà máy pin năng lượng mặt trời Crc Solar Cell phải chuyển sang đầu năm 2024 do việc chào bán cổ phiếu bị kéo dài. Tuy mức tăng trưởng doanh thu chỉ đạt 69% theo kế hoạch đã được đại hội đồng cổ đông thông qua, HĐQT đã chỉ đạo kiểm soát chi phí và điều chỉnh phương hướng kinh doanh để mức lợi nhuận trong năm 2023 vẫn gần sát kế hoạch đề ra.</span></span><br><br><span style=\"background-color:white;color:rgb(36,36,36);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Năm 2024 mặc dù kinh tế đã có những khởi sắc nhất định, tuy nhiên theo HĐQT công ty nhận định, hoạt động kinh doanh đối với các doanh nghiệp sản xuất kinh doanh vẫn sẽ gặp nhiều khó khan. Vì vậy, HĐQT và Ban giám đốc đã đề ra những kế hoạch cụ thể như sau:</span></span></p><p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:white;color:rgb(36,36,36);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\"><strong>Đầu tư:</strong> Đẩy mạnh đầi tư vào lĩnh vực sản xuất pin năng lượng mặt trời với việc thúc đẩy triển khai đầu tư xây dựng 2 nhà máy sản xuất pin năng lượng mặt trời, tại khu Công nghệ cao – thành phố Đà Nẵng để sản xuất tấm tế bào quang điện và tại KCN Minh Quân, tỉnh Yên Bái với công suất tấm tế bào quang điện tương đương 500 MWp/năm và công suất gia công tấm pin năng lượng mặt trời tương đương 300 MWp/ năm.</span></span></p><p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:white;color:rgb(36,36,36);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\"><strong>Sản xuất kinh doanh:</strong> Tập chung duy trì doanh thu từ nghành nông sản và vật liệu xây dựng, sản xuất điện năng lượng mặt trời. Đồng thời nhạy bén trong các hoạt động đầu tư để đáp ứng kịp thời xu hướng phát triển của thị trường và sử dụng vốn hiệu quả. Tiếp tục xây dựng, củng cố và phát triển thương hiệu của công ty. Tăng cường quản trị rủi ro, đảm bảo an toàn tài chính, tang cường công tác kiểm soát chi phí hoạt động của công ty.</span></span><br><br><span style=\"background-color:white;color:rgb(36,36,36);font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Từ những kế hoạch nêu trên, HĐQT đề ra các chỉ tiêu chính cho các kế hoạch kinh doanh năm 2024 như sau: Kế hoạch doanh thu hợp nhất đạt 780 tỷ đồng, kế hoạch lợi nhuận sau thuế hợp nhất 56 tỷ đồng, bình quân đầu người đặt mục tiêu phấn đấu tăng từ 10% so với năm 2023.</span></span><br><br><span style=\"background-color:rgb(251,251,251);color:black;font-family:Arial, Helvetica, sans-serif;\"><span style=\"background-repeat:initial;box-sizing:border-box;outline:0px;\">Đại hội cũng tiến hành bầu HĐQT và Ban Kiểm soát nhiệm kỳ 2024 - 2029. Theo đó, HĐQT gồm các thành viên: ông Mai Anh Tám, bà Dương Thị Huyến, ông Lê Thành Nhân, ông Hoàng Trung Kiên và ông Phạm Văn Trưởng. Ông Mai Anh Tám được tín nhiệm bầu làm Chủ tịch HĐQT Công ty.</span></span><br><br><span style=\"color:black;font-family:Arial, Helvetica, sans-serif;\"><span style=\"box-sizing:border-box;outline:0px;\">Ban Kiểm soát gồm có bà Phạm Thị Huế, bà Hà Thị Hiến, bà Ngọ Thị Thu Giang. Bà Phạm Thị Huế được bầu làm Trưởng Ban Kiểm soát.</span></span></p><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:6000/4000;border-style:none;box-sizing:border-box;margin-bottom:-4px;max-width:600px;outline:0px;vertical-align:middle;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-07-03-09-44-30-36.jpg\" alt=\"image 2024-07-03-09-44-30-36\" title=\"image 2024-07-03-09-44-30-36\" width=\"6000\" height=\"4000\"></figure><p style=\"-webkit-text-stroke-width:0px;background-color:rgb(251, 251, 251);background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:9pt 0cm;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\">&nbsp;</p>', '', '', '/image/2024-07-03-09-40-56-61.jpg', 1, 2, 1, 'vn', 1, '2024-07-25 00:32:43', NULL, '2024-07-25 00:32:43'),
(5, 'CÔNG NGHỆ MỚI GIÚP TRẺ HÓA PIN NĂNG LƯỢNG MẶT TRỜI', '<p style=\"text-align:justify;\"><span style=\"background-color:rgb(255,255,255);color:hsl(0, 0%, 30%);font-family:Arial, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;letter-spacing:normal;orphans:2;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><strong>EtaVolt, công ty con của Đại học Công nghệ Nanyang Singapore, vừa phát triển thành công công nghệ mới giúp trẻ hóa các tấm pin mặt trời.</strong></span></span></p><p>&nbsp;</p><hr><p>&nbsp;</p><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:1286/965;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-04-10-10-08-34-63.jpg\" alt=\"image 2024-04-10-10-08-34-63\" width=\"1286\" height=\"965\"></figure><hr><div style=\"-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;color:rgb(102, 102, 102);font-family:Montserrat, Arial, sans-serif;font-size:14px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;margin:0px;orphans:2;outline:0px;padding:0px;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\" align=\"center\"><p style=\"background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(0, 0, 0);font-family:Arial, sans-serif;font-size:15px;line-height:30px;margin:0px 0px 10px;outline:0px;text-align:justify;\"><span style=\"box-sizing:border-box;outline:0px;\">Đây được xem là bước đột phá trong ngành công nghiệp năng lượng mặt trời trên thế giới. Công nghệ này áp dụng được cho trên 90% pin mặt trời silicon trên thị trường, bao gồm cả những loại có chứa boron, oxy và các tạp chất khác.</span></p><p style=\"background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(0, 0, 0);font-family:Arial, sans-serif;font-size:15px;line-height:30px;margin:0px 0px 10px;outline:0px;text-align:justify;\"><span style=\"box-sizing:border-box;outline:0px;\">Khi ánh sáng mạnh và nhiệt độ phù hợp được áp dụng chính xác vào pin mặt trời, chúng sẽ kích thích các phân tử vật chất chuyển động nhanh chóng, từ đó thay đổi cách sắp xếp và vá lại các \'lỗ hổng\' do ánh sáng và nhiệt gây ra. Tránh rò rỉ năng lượng và thu năng lượng ánh sáng tối ưu.</span></p><p style=\"background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(0, 0, 0);font-family:Arial, sans-serif;font-size:15px;line-height:30px;margin:0px 0px 10px;outline:0px;text-align:justify;\"><span style=\"box-sizing:border-box;outline:0px;\">Thiết bị sử dụng công nghệ này có thể tự động lăn trên các tấm pin mặt trời dài tới 2,3 mét trong vòng 5 phút, giúp chúng phục hồi tới 5% hiệu suất bị mất và bảo vệ chúng khỏi sự xuống cấp lên đến 5 năm.</span></p><p style=\"box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-size:16px;line-height:30px;margin:0px 0px 25px;outline:0px;\">&nbsp;</p></div><p><img class=\"image_resized\" style=\"-webkit-text-stroke-width:0px;aspect-ratio:1024/125;background-color:rgb(255, 255, 255);border-style:none;box-sizing:border-box;color:rgb(102, 102, 102);float:right;font-family:Montserrat, Arial, sans-serif;font-size:14px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;margin-bottom:-4px;max-width:250px;orphans:2;outline:0px;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;width:250px;word-spacing:0px;\" src=\"https://crcsolar.com.vn/images/logo.png\" width=\"1024\" height=\"125\"></p>', '', '', '/image/2024-04-10-10-08-34-63.jpg', 1, 4, 1, 'vn', 1, '2024-07-25 02:15:53', NULL, '2024-07-25 02:15:53'),
(6, 'ỨNG DỤNG CỦA PIN MẶT TRỜI TRONG CUỘC SỐNG', '<p style=\"text-align:justify;\"><span style=\"background-color:rgb(255,255,255);color:hsl(0, 0%, 30%);font-family:Inter, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;box-sizing:border-box;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><strong>Với nguồn năng lượng đang dần cạn kiệt trên trái đất, các nhà khoa học đã tìm kiếm và tìm ra nguồn năng lượng vô tận từ mặt trời. Nguồn năng lượng đó đã được các nhà khoa học ứng dụng thành công vào các phát minh khoa học. Với những </strong></span><i><span style=\"-webkit-text-stroke-width:0px;box-sizing:border-box;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><strong>ứng dụng của pin năng lượng mặt trời</strong></span></i><span style=\"-webkit-text-stroke-width:0px;box-sizing:border-box;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><strong> trên nhiều lĩnh vực, sẽ mở ra một cơ hội khai thác và tận dụng nguồn năng lượng mới cho toàn nhân loại.</strong></span></span></p><p style=\"text-align:justify;\">&nbsp;</p><hr><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:800/534;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-04-10-10-11-20-73.jpg\" alt=\"image 2024-04-10-10-11-20-73\" width=\"800\" height=\"534\"></figure><hr><p>&nbsp;</p><p style=\"text-align:justify;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">Ứng dụng của pin mặt trời với nguồn điện cho thiết bị di động:</span><img class=\"image-style-align-right image_resized\" style=\"aspect-ratio:300/168;width:28.9%;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-04-10-09-31-53-59.jpg\" alt=\"image 2024-04-10-09-31-53-59\" width=\"300\" height=\"168\"></p><p style=\"text-align:justify;\"><br><br><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Một trong những ứng dụng của&nbsp;</span><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">pin mặt trời</span><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">&nbsp;chính là cung cấp nguồn năng lượng vô tận để sạc các thiết bị di động như điện thoại, máy tính bảng, laptop…, giúp cho bạn dù đi bất cứ đâu cũng không cần lo lắng thiếu nguồn điện.</span><br><br><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Những&nbsp;</span><em style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\"><i><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">tấm pin mặt trời</span></i></em><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">&nbsp;được thiết kế với nhiều hình dáng, được lắp đặt bên trong những phát minh thông minh, hiện đại, điển hình như cục sạc dự phòng và trên một số ứng dụng khác.</span><br>&nbsp;</p><hr><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"background-color:rgb(255,255,255);color:rgb(51,51,51);font-family:Inter, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;letter-spacing:normal;orphans:2;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><strong>Trạm sạc năng lượng mặt trời:</strong></span></span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Trạm sạc năng lượng mặt trời được thiết kế dùng để sạc pin cho smartphone, có sẵn dây kết nối microUSB hay Lightning cho các thiết bị Android và iPhone với tốc độ sạc tương đương bộ sạc bằng nguồn điện lưới quốc gia.</span></p><p style=\"text-align:justify;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">Balo năng lượng mặt trời:</span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Balo được tích hợp pin năng lượng mặt trời có khả năng chuyển đổi năng lượng bức xạ mặt trời thành năng lượng điện dùng để sạc cho các thiết bị điện tử như smartphone, iphone, ipad, sạc dự phòng…rất tiện lợi cho những doanh nhân thường xuyên đi công tác hay những bạn trẻ đi tham quan, du lịch, đi phượt…</span></p><p style=\"text-align:justify;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">Thùng rác năng lượng mặt trời:</span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Những chiếc thùng rác thông minh có chức năng lọc nước thải để nuôi cây xanh và đặc biệt là có thể sạc pin điện thoại bằng năng lượng mặt trời vô cùng tiện lợi hiện đang có tại Đà Nẵng.</span></p><p style=\"text-align:justify;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">Dù năng lượng mặt trời:</span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Một ứng dụng của pin mặt trời chính là chiếc dù thông minh với nhiều công dụng được trang bị các tấm pin giữ vai trò chuyển hóa năng lượng mặt trời thành điện năng, được tích trữ ở phần tay cầm của ô.</span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Chiếc ô này được công ty tại Arab Saudi phát minh, có thể dùng làm quạt mát, đèn pin, công cụ định vị GPS và đặc biệt có gắn thêm 3 cổng USB, có thể sạc bất cứ thiết bị điện tử nào.</span></p><p style=\"text-align:justify;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">Quần áo năng lượng mặt trời</span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Bộ sưu tập gồm những chiếc áo được trang bị dây dẫn điện bên trong được đan xen khéo léo cùng sợi vải kết nối với với chất liệu cao su tổng hợp, được khắc laser trực tiếp vào chất da.</span></p><p style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;clear:both;color:rgb(51, 51, 51);font-family:Inter, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:30px;margin:0px 0px 1rem;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;outline:0px;\">Những chiếc áo này được một nhà thiết kế người Hà Lan có tên Pauline van Dongen mới làm ra và tung ra trong bộ sưu tập mang tên Oloid, có khả năng tận dụng năng lượng từ mặt trời để sạc cho các thiết bị di động.</span></p><hr><p><img class=\"image-style-align-left image_resized\" style=\"aspect-ratio:283/178;width:14.09%;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-04-10-09-33-49-62.jpg\" alt=\"image 2024-04-10-09-33-49-62\" width=\"283\" height=\"178\"></p><p style=\"text-align:justify;\"><br><span style=\"--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-ring-color:rgb(59 130 246 / .5);--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-offset-width:0px;--tw-ring-shadow:0 0 #0000;--tw-rotate:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-shadow-colored:0 0 #0000;--tw-shadow:0 0 #0000;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;box-sizing:border-box;font-weight:bolder;outline:0px;\">Tích hợp vào các thiết bị an ninh</span><br><span style=\"background-color:rgb(255,255,255);color:rgb(51,51,51);font-family:Arial, Helvetica, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;letter-spacing:normal;orphans:2;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\">Hiện nay có một giải pháp giám sát không dây chính là camera năng lượng mặt trời G/4G/Wifi cho nông trại, giao thông đường phố, sân vườn, cảnh báo đột nhập, cảnh báo sạt lở đất, công trình xây dựng trên cao…, có thể lắp đặt ở những nơi khó đi dây điện.</span></span><br><br><br>&nbsp;</p>', '', '', '/image/2024-04-10-10-11-20-73.jpg', 1, 16, 1, 'vn', 1, '2024-07-25 02:36:35', NULL, '2024-07-25 02:36:35'),
(7, 'TRIỂN LÃM & HỘI NGHỊ PHÁT ĐIỆN QUANG ĐIỆN QUỐC TẾ (SNEC PV) 2024', '<p class=\"MsoNormal\" style=\"-webkit-text-stroke-width:0px;background-color:white;background-repeat:initial;box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-family:Montserrat, Arial, sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;line-height:normal;margin:0px 0px 25px;orphans:2;outline:0px;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\"><br><span style=\"background-color:white;color:hsl(0, 0%, 30%);\"><span style=\"background-repeat:initial;border:1pt none windowtext;box-sizing:border-box;outline:0px;padding:0cm;\">Hội nghị &amp; Triển lãm Năng lượng Thông minh và Phát điện Quang điện Quốc tế lần thứ 17 (SNEC Expo) đã chính thức khai mạc vào ngày 13 tháng 6 tại Trung tâm Triển lãm và Hội nghị Quốc gia ở Thượng Hải. Hội nghị SNEC Expo năm nay là sự kiện lớn nhất được tổ chức trong những năm trở lại đây, với diện tích trên 400.000 mét vuông, thu hút hơn 3.300 gian hàng và 500.000 khách tham quan.</span></span></p><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:2568/1926;border-style:none;box-sizing:border-box;margin-bottom:-4px;max-width:600px;outline:0px;vertical-align:middle;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-06-19-06-12-48-33.jpg\" alt=\"image 2024-06-19-06-12-48-33\" title=\"image 2024-06-19-06-12-48-33\" width=\"2568\" height=\"1926\"></figure><hr><div style=\"-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:border-box;color:rgb(102, 102, 102);font-family:Montserrat, Arial, sans-serif;font-size:14px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;margin:0px;orphans:2;outline:0px;padding:0px;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\" align=\"center\"><p style=\"text-align:justify;\">&nbsp;</p><p class=\"MsoNormal\" style=\"box-sizing:border-box;clear:both;color:rgb(81, 81, 81);font-size:16px;line-height:normal;margin:0px 0px 0cm;outline:0px;text-align:justify;\"><img class=\"image-style-align-right image_resized\" style=\"aspect-ratio:2568/1926;border-style:none;box-sizing:border-box;margin-bottom:-4px;max-width:600px;outline:0px;vertical-align:middle;width:40.25%;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-06-19-06-14-14-44.jpg\" alt=\"image 2024-06-19-06-14-14-44\" width=\"2568\" height=\"1926\" title=\"image 2024-06-19-06-14-14-44\"><span style=\"background-color:white;color:rgb(51,51,51);\"><span style=\"background-repeat:initial;border:1pt none windowtext;box-sizing:border-box;outline:0px;padding:0cm;\">Các ngành công nghiệp quang điện và thông tin đang giải quyết nhiệm vụ khó khăn về đổi mới công nghệ và chuyển đổi năng lượng bằng cách tập trung vào việc xây dựng lưới điện mới với năng lượng mới là cốt lõi và đạt được mục tiêu carbon kép. Chủ đề của diễn đàn này là \"Số hóa năng lượng mới: Tạo năng lượng trung hòa carbon\", nhằm mục đích thúc đẩy sự tích hợp sâu sắc giữa hệ thống năng lượng và công nghệ thông tin, cũng như trao đổi kiến ​​thức và thực tiễn trong quá trình số hóa năng lượng.</span></span><br><br><span style=\"background-color:white;color:rgb(51,51,51);\"><span style=\"background-repeat:initial;border:1pt none windowtext;box-sizing:border-box;outline:0px;padding:0cm;\">Hội nghị thượng đỉnh diễn ra vào thời điểm đất nước có sự thay đổi. Màu xanh lá cây là nền tảng mới cho sự phát triển chất lượng. Chủ đề Tài chính xanh góp phần hiện thực hóa tính trung hòa carbon sẽ tập trung vào tài chính xanh trong khuôn khổ các mục tiêu trung hòa carbon. Vai trò là người đi đầu trong đầu tư xanh, cải thiện chính sách đầu tư xanh và xây dựng hệ thống tài chính và đầu tư xanh phù hợp với mục tiêu đạt đỉnh carbon và trung hòa carbon. Làm thế nào để tích cực phát triển tài chính xanh, cải thiện và thiết lập các hệ thống tiêu chuẩn tài chính xanh.</span></span><br><br><span style=\"background-color:white;color:rgb(51,51,51);\"><span style=\"background-repeat:initial;border:1pt none windowtext;box-sizing:border-box;outline:0px;padding:0cm;\">Hội nghị thượng đỉnh diễn ra vào thời điểm đất nước có sự thay đỏi. Màu xanh lá cây là nền tảng mới cho sự phát triển. Chủ đề Tài chính xanh </span></span><span style=\"background-color:rgb(255,255,255);color:rgb(51,51,51);font-family:Montserrat, Arial, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\">góp phần hiện thực hóa tính trung hòa carbon sẽ tập trung vào tài chính xanh trong khuôn khổ các mục tiêu trung hòa carbon. Vai trò là người đi đầu trong đầu tư xanh, cải thiện chính sách đầu tư xanh và xây dựng hệ thống tài chính và đầu tư xanh phù hợp với mục tiêu đạt đỉnh carbon và trung hòa carbon. Làm thế nào để tích cực phát triển tài chính xanh, cải thiện và thiết lập các hệ thống tiêu chuẩn tài chính xanh.</span></span><br><br><span style=\"background-color:rgb(255,255,255);color:rgb(33,37,41);font-family:Montserrat, Arial, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\">Hội nghị SNEC bao gồm nhiều chương trình kết hợp các chủ đề khác nhau, bao gồm các xu hướng thị trường của ngành PV, chiến lược hợp tác và phát triển, định hướng chính sách của các quốc gia khác nhau, công nghệ công nghiệp tiên tiến, tài chính PV và đầu tư, v.v ... Đó là cơ hội mà bạn không thể bỏ lỡ để luôn cập nhật về công nghệ và thị trường, trình bày kết quả của bạn với cộng đồng và kết nối với các chuyên gia công nghiệp, học giả và doanh nhân và đồng nghiệp.&nbsp;Hội nghị &amp; Triển lãm sản xuất điện quang điện quốc tế cung cấp cho người tham dự cơ hội khám phá triển lãm của các cơ sở sản xuất PV, vật liệu, tế bào PV, sản phẩm và mô-đun ứng dụng PV, và hệ thống và dự án PV, bao gồm mọi bộ phận của toàn bộ chuỗi ngành công nghiệp PV.</span></span><br><br><img class=\"image_resized\" style=\"aspect-ratio:2568/1926;width:32.52%;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-06-19-06-20-31-40.jpg\" alt=\"image 2024-06-19-06-20-31-40\" width=\"2568\" height=\"1926\"> &nbsp;<img class=\"image_resized\" style=\"aspect-ratio:2568/1926;width:32.34%;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-06-19-06-20-38-22.jpg\" alt=\"image 2024-06-19-06-20-38-22\" width=\"2568\" height=\"1926\"> &nbsp;<img class=\"image_resized\" style=\"aspect-ratio:2568/1926;width:32.26%;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2024-06-19-06-20-47-56.jpg\" alt=\"image 2024-06-19-06-20-47-56\" width=\"2568\" height=\"1926\"></p><p>&nbsp;</p></div>', '', '', '/image/2024-06-19-06-12-48-33.jpg', 1, 2, 1, 'vn', 1, '2024-07-25 05:00:12', NULL, '2024-07-25 05:00:12');
INSERT INTO `blogs` (`blog_id`, `title`, `detail`, `tag`, `seo_title`, `main_image`, `is_outstanding`, `category_id`, `status`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(8, 'CRC SOLAR THAM GIA TRIỂN LÃM TẤM PIN NĂNG LƯỢNG MẶT TRỜI INTERSOLAR NORTH AMERICA TẠI HOA KỲ', '<p style=\"text-align:justify;\"><span style=\"background-color:rgb(255,255,255);color:hsl(0, 0%, 0%);font-family:Arial, Helvetica, sans-serif;\"><span style=\"-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:justify;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;\">Từ ngày 12-15/01/2022 tại &nbsp;LongBeach, Bang Califonia, Hoa kỳ, Công ty CRC Solar đã tham gia Triển lãm năng lượng Intersolar North America. Đây là triển lãm hàng đầu thế giới về năng lượng mặt trời với sự góp mặt bởi rất nhiều các doanh nghiệp và chuyên gia trong lĩnh vực năng lượng mặt trời. Phái đoàn của CRC Solar đã làm việc với các đối tác, doanh nghiệp lớn của Mỹ và tham gia các buổi hội thảo chuyên đề tại triển lãm để lần đầu ra mắt sản phẩm Tấm Pin công nghệ cao CRC Solar với các đối tác tại Hoa Kỳ. Đây là cơ hội để CRC Solar quảng bá sản phẩm tấm Pin Năng Lượng Mặt Trời sản xuất tại Việt Nam và mở ra chương trình hợp tác tiêu thụ cũng như xuất khẩu tấm Pin CRC Solar vào thị trường Mỹ trong năm 2022 và các năm tiếp theo.</span></span></p><p>&nbsp;</p><hr><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:1276/956;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2022-01-16-23-11-36-79.jpg\" alt=\"image 2022-01-16-23-11-36-79\" width=\"1276\" height=\"956\"></figure><hr><figure class=\"image image_resized\" style=\"width:100%;\"><img style=\"aspect-ratio:956/1276;\" src=\"https://crcsolar.com.vn/groupadmin/uploads/contents/2022-01-16-23-11-26-22.jpg\" alt=\"image 2022-01-16-23-11-26-22\" width=\"956\" height=\"1276\"></figure><p><br><br><br><img class=\"image-style-align-right image_resized\" style=\"aspect-ratio:1024/125;width:25.46%;\" src=\"https://crcsolar.com.vn/images/logo.png\" width=\"1024\" height=\"125\"><br><br><br><br>&nbsp;</p>', '', '', '/image/2022-01-17-10-09-01-24.jpg', 1, 2, 1, 'vn', 1, '2024-07-25 05:05:53', NULL, '2024-07-25 05:05:53'),
(9, 'Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '<p><strong>Chiều ngày 11/4, Bộ trưởng Bộ Công Thương Nguyễn Hồng Diên có buổi làm việc với các đơn vị về phát triển điện mặt trời mái nhà.</strong><br>&nbsp;</p><hr><p>&nbsp;</p><figure class=\"table\" style=\"width:100%;\"><table style=\"background-color:hsl( 205, 100%, 96% );border-color:hsl(0, 0%, 0%);border-style:double;\"><tbody><tr><td><br><a href=\"https://congthuong.vn/bo-truong-bo-cong-thuong-chu-tri-hop-giao-ban-duong-day-500kv-mach-3-thang-42024-313598.html\"><i>&nbsp; &nbsp; Bộ trưởng Bộ Công Thương chủ trì hợp giao ban đường dây 500kV mạch 3 tháng 4/2024</i></a><br><br><a href=\"https://congthuong.vn/bo-truong-bo-cong-thuong-chu-tri-hop-giao-ban-duong-day-500kv-mach-3-thang-42024-313598.html\"><i>&nbsp; &nbsp; EVN triển khai Chỉ thị số 05/CT-BCT của Bộ trưởng Bộ Công Thương về cấp điện cao điểm mùa khô 2024</i></a><br><br><a href=\"https://congthuong.vn/bo-truong-bo-cong-thuong-chu-tri-hop-giao-ban-duong-day-500kv-mach-3-thang-42024-313598.html\"><i>&nbsp; &nbsp; Bộ Công Thương họp Ban soạn thảo, Tổ biên tập xây dựng Nghị định về DPPA</i></a><br>&nbsp;</td></tr></tbody></table></figure><hr><p style=\"box-sizing:border-box;margin:0px 0px 1em;padding:0px;text-align:justify;\"><br>Cùng tham dự buổi làm việc có đại diện: Cục Điện lực và Năng lượng tái tạo, Cục Điều tiết điện lực, Cục Kỹ thuật an toàn và Môi trường công nghiệp, Văn phòng <a class=\"__MB_LINK_IN_ARTICLE\" style=\"border-style:none;box-sizing:border-box;color:rgb(0, 0, 255);margin:0px;padding:0px;text-decoration:none;\" href=\"https://congthuong.vn/chu-de/cong-doan-bo-cong-thuong.topic\" title=\"Xem thêm tin về Bộ Công Thương\">Bộ Công Thương</a>, Vụ Pháp chế, Vụ Kế hoạch Tài chính, Vụ Tiết kiệm năng lượng và Phát triển bền vững.</p><p style=\"box-sizing:border-box;margin:0px 0px 1em;padding:0px;text-align:justify;\">Ngoài ra còn đại diện: <a class=\"__MB_LINK_IN_ARTICLE\" style=\"border-style:none;box-sizing:border-box;color:rgb(0, 0, 255);margin:0px;padding:0px;text-decoration:none;\" href=\"https://congthuong.vn/chu-de/tap-doan-dien-luc-viet-nam.topic\" title=\"Xem thêm tin về Tập đoàn Điện lực Việt Nam\">Tập đoàn Điện lực Việt Nam</a> (EVN), Tổng công ty Điện lực miền Bắc (EVN NPC), Tổng công ty Điện lực miền Nam (EVN SPC), Tổng công ty điện lực TP Hà Nội (EVN HANOI), Viện Năng lượng và Hiệp hội Năng lượng Việt Nam.Cùng tham dự buổi làm việc có đại diện: Cục Điện lực và Năng lượng tái tạo, Cục Điều tiết điện lực, Cục Kỹ thuật an toàn và Môi trường công nghiệp, Văn phòng <a class=\"__MB_LINK_IN_ARTICLE\" style=\"border-style:none;box-sizing:border-box;color:rgb(0, 0, 255);margin:0px;padding:0px;text-decoration:none;\" href=\"https://congthuong.vn/chu-de/cong-doan-bo-cong-thuong.topic\" title=\"Xem thêm tin về Bộ Công Thương\">Bộ Công Thương</a>, Vụ Pháp chế, Vụ Kế hoạch Tài chính, Vụ Tiết kiệm năng lượng và Phát triển bền vững.</p><p style=\"box-sizing:border-box;margin:0px 0px 1em;padding:0px;text-align:justify;\">Ngoài ra còn đại diện: <a class=\"__MB_LINK_IN_ARTICLE\" style=\"border-style:none;box-sizing:border-box;color:rgb(0, 0, 255);margin:0px;padding:0px;text-decoration:none;\" href=\"https://congthuong.vn/chu-de/tap-doan-dien-luc-viet-nam.topic\" title=\"Xem thêm tin về Tập đoàn Điện lực Việt Nam\">Tập đoàn Điện lực Việt Nam</a> (EVN), Tổng công ty Điện lực miền Bắc (EVN NPC), Tổng công ty Điện lực miền Nam (EVN SPC), Tổng công ty điện lực TP Hà Nội (EVN HANOI), Viện Năng lượng và Hiệp hội Năng lượng Việt Nam.<br><br>&nbsp;</p><figure class=\"image image-style-side image_resized\" style=\"width:40.58%;\"><img style=\"aspect-ratio:512/63;\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAA/CAYAAACWy3CrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA/NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0RDNBMUMzRThBNTExRUI5MUM5OEE1RUNBQjE5NUQwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0RDNBMUMyRThBNTExRUI5MUM5OEE1RUNBQjE5NUQwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIElsbHVzdHJhdG9yIENDIDIzLjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NWFlOTcxMWMtOWI3Yi1hYTQ4LWE2NWYtYWJjM2Q1MzkwZWFhIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlk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\" width=\"512\" height=\"63\" uploadprocessed=\"true\"></figure><p><br><br><br><br>&nbsp;</p><p>&nbsp;</p>', 'Tin năng lượng', 'Năng lượng xanh', '/image/z5337603268015-1b4394b51223fca83e8936613b80923820240411142217.jpg', 1, 4, 1, 'vn', 1, '2024-07-26 10:31:24', 1, '2024-07-28 17:34:47');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `seo_title` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `parent_id` int(11) DEFAULT NULL,
  `language` varchar(2) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `title`, `name`, `description`, `seo_title`, `status`, `parent_id`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Dịch vụ', 'services', '', '', 1, NULL, 'vn', 1, '2024-07-18 12:07:09', NULL, NULL),
(2, 'Tin tức', 'news', '', '', 1, NULL, 'vn', NULL, '2024-07-20 17:34:00', NULL, '2024-07-20 17:34:00'),
(3, 'Sự kiện', 'events', '', '', 1, NULL, 'vn', NULL, '2024-07-20 17:34:00', NULL, '2024-07-20 17:34:00'),
(4, 'Tin tức khác', 'other-news', '', '', 1, NULL, 'vn', NULL, '2024-07-20 17:49:06', NULL, '2024-07-20 17:49:06'),
(5, 'Trách nhiệm xã hội', 'social-responsibility', '', '', 1, NULL, 'vn', NULL, '2024-07-20 17:49:06', NULL, '2024-07-20 17:49:06'),
(6, 'Services', 'services', '', '', 1, NULL, 'en', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(7, '服务', 'services', '', '', 1, NULL, 'cn', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(8, 'News', 'news', '', '', 1, NULL, 'en', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(9, '新闻', 'news', '', '', 1, NULL, 'cn', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(10, 'Events', 'events', '', '', 1, NULL, 'en', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(11, '事件', 'events', '', '', 1, NULL, 'cn', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(12, 'Other News', 'other-news', '', '', 1, NULL, 'en', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(13, '其他新闻', 'other-news', '', '', 1, NULL, 'cn', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(14, 'Social Responsibility', 'social-responsibility', '', '', 1, NULL, 'en', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(15, '社会责任', 'social-responsibility', '', '', 1, NULL, 'cn', NULL, '2024-07-20 17:56:12', NULL, '2024-07-20 17:56:12'),
(16, 'Công nghệ', 'technologies', '', '', 1, NULL, 'vn', NULL, '2024-07-25 02:20:36', NULL, NULL),
(17, 'Technologies', 'technologies', '', '', 1, NULL, 'en', NULL, '2024-07-25 02:20:36', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `display_images`
--

CREATE TABLE `display_images` (
  `display_image_id` int(11) NOT NULL,
  `element_id` varchar(255) NOT NULL,
  `page` varchar(255) NOT NULL,
  `src` text NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `display_images`
--

INSERT INTO `display_images` (`display_image_id`, `element_id`, `page`, `src`, `updated_by`, `updated_at`) VALUES
(1, 'block1-image4', 'home', '/image/block1.1.jpg', 2, '2024-07-24 00:53:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `display_texts`
--

CREATE TABLE `display_texts` (
  `display_text_id` int(11) NOT NULL,
  `element_id` varchar(255) NOT NULL,
  `page` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `language` varchar(2) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `display_texts`
--

INSERT INTO `display_texts` (`display_text_id`, `element_id`, `page`, `detail`, `language`, `updated_by`, `updated_at`) VALUES
(1, 'block2-text1', 'home', 'CRC SOLAR không ngừng nỗ lực phấn đấu để trở thành công ty hàng đầu trong lĩnh vực sản xuất, thi công các công trình sử dụng tấm pin năng lượng mặt trời công nghệ tiên tiến hiện đại nhất tại Việt Nam.', 'vn', NULL, NULL),
(2, 'block2-text2', 'home', 'CRC SOLAR luôn cung cấp những sản phẩm tấm pin năng lượng mặt trời đạt tiêu chuẩn chất lượng cao nhất cho mọi công trình. Thực hiện sản xuất đúng theo tiến độ và chất lượng đã cam kết với khách hàng.', 'vn', NULL, NULL),
(3, 'block2-text3', 'home', 'Cải tiến liên tục: Văn hóa và động lực để phát triển. Hợp tác: Sẵn sàng hợp tác trên tinh thần đôi bên cùng có lợi. Tôn trọng: Luôn tôn trọng khách hàng, nhân viên và đối tác.', 'vn', NULL, '2024-07-18 14:04:16'),
(4, 'block2-text4', 'home', 'CRC SOLAR có đội ngũ cán bộ kỹ thuật được đào tạo bài bản, có tính kỷ luật cao. Tất cả các sản phẩm của CRC SOLAR đều là những sản phẩm chất lượng có nguồn gốc xuất xứ rõ ràng.', 'vn', NULL, '2024-07-18 14:04:16'),
(5, 'block1-text1', 'home', 'Công ty CP CRC SOLAR CELL là công ty chuyên sản xuất tấm pin năng lượng mặt trời có trụ sở tại Khu Công Nghiệp Lương Sơn xã Hòa Sơn huyện Lương Sơn tỉnh Hòa Bình, Việt Nam.', 'vn', 1, '2024-07-22 22:37:47'),
(6, 'block1-text2', 'home', '200+', 'vn', NULL, NULL),
(7, 'block1-text3', 'home', '5', 'vn', 1, '2024-07-25 12:55:53'),
(8, 'block1-text4', 'home', '10', 'vn', NULL, '2024-07-19 01:09:59'),
(9, 'block1-text5', 'home', '40+', 'vn', NULL, '2024-07-19 01:09:59'),
(10, 'block1-text6', 'home', 'Là một doanh nghiệp của Việt Nam, CRC Solar luôn luôn tự hào là một doanh nghiệp hàng Việt Nam chất lượng cao đi tiên phong trong ngành sản xuất điện mặt trời này.\n\nChúng tôi thường xuyên tổ chức các chương trình đào tạo nội bộ, lập kế hoạch nghề nghiệp và chăm sóc đời sống công nhân viên. Ngoài ra, CRC Solar còn hợp tác với các trường đại học, các tổ chức giáo dục và nghiên cứu khoa học để bồi dưỡng tài năng và tạo thêm công ăn việc làm tại địa phương.', 'vn', 1, '2024-07-22 15:19:23'),
(11, 'block5-text1', 'home', 'Tháng 7/2021, công ty CP CRC Solar Cell đã cho ra mắt dòng pin 166 Series mới với các module công suất cao và siêu hiệu quả. Dòng tấm pin mới này thiết kế 144 cell mang lại công suất tối đa 550W và đạt hiệu suất siêu cao là 21,39%.\r\nCRC Solar cung cấp bảo hành sản phẩm lên đến 15 năm tốt nhất trong ngành và bảo hành tuyến tính 25 năm. Suy giảm chỉ là 2% trong năm đầu tiên và suy giảm hàng năm tối đa là 0,5% từ năm thứ hai đến năm thứ 25. Với vật liệu làm tấm pin được nâng cấp và thiết kế quy trình tối ưu hóa, pin năng lượng CRC Solar cung cấp độ tin cậy và an toàn tải cơ học vượt trội. Hiệu suất tải cơ học tuyệt vời làm cho sản phẩm của chúng tôi có thể để lắp đặt được ở cả các khu vực có tải trọng tuyết / gió lớn.', 'vn', NULL, '2024-07-19 01:09:59'),
(12, 'block2-text1', 'home', 'CRC SOLAR constantly strives to become a leading company in the field of manufacturing and constructing projects using solar panels with the most modern and advanced technology in Vietnam.', 'en', NULL, NULL),
(13, 'block2-text1', 'home', 'CRC SOLAR不断努力成为越南采用最现代、最先进技术的太阳能电池板制造和建设项目领域的领先公司。', 'cn', NULL, NULL),
(14, 'block2-text2', 'home', 'CRC SOLAR always provides solar panel products that meet the highest quality standards for every project. Carry out production according to the schedule and quality committed to customers.', 'en', NULL, '2024-07-19 02:31:48'),
(15, 'block2-text2', 'home', 'CRC SOLAR 始终为每个项目提供符合最高质量标准的太阳能电池板产品。按照向客户承诺的进度和质量进行生产。', 'cn', NULL, '2024-07-19 02:31:48'),
(16, 'block2-text3', 'home', 'Continuous improvement: Culture and motivation for growth. Cooperation: Ready to cooperate in the spirit of mutual benefit. Respect: Always respect customers, employees and partners.', 'en', NULL, '2024-07-19 02:31:48'),
(17, 'block2-text3', 'home', '持续改进：成长的文化和动力。合作：本着互惠互利的精神进行合作。尊重：始终尊重客户、员工和合作伙伴。', 'cn', NULL, '2024-07-19 02:31:48'),
(18, 'block2-text4', 'home', 'CRC SOLAR has a team of well-trained and highly disciplined technical staff. All CRC SOLAR products are quality products with clear origins.', 'en', NULL, '2024-07-19 02:31:48'),
(19, 'block2-text4', 'home', '华润太阳能拥有一支训练有素、纪律严明的技术人员队伍。 CRC SOLAR的所有产品均为优质产品，来源清晰。', 'cn', NULL, '2024-07-19 02:31:48'),
(20, 'block1-text1', 'home', 'CRC SOLAR CELL Joint Stock Company is a company specializing in manufacturing solar panels headquartered in Luong Son Industrial Park, Hoa Son commune, Luong Son district, Hoa Binh province, Vietnam.', 'en', NULL, '2024-07-19 02:31:48'),
(21, 'block1-text1', 'home', 'CRC SOLAR CELL 股份公司是一家专业生产太阳能电池板的公司，总部位于越南和平省良山县良山公社良山工业园。', 'cn', NULL, '2024-07-19 02:31:48'),
(22, 'block1-text2', 'home', '200+', 'en', NULL, '2024-07-19 02:31:48'),
(23, 'block1-text2', 'home', '200+', 'cn', NULL, '2024-07-19 02:31:48'),
(24, 'block1-text3', 'home', '5', 'en', NULL, '2024-07-19 02:31:48'),
(25, 'block1-text3', 'home', '5', 'cn', NULL, '2024-07-19 02:31:48'),
(26, 'block1-text4', 'home', '10', 'en', NULL, '2024-07-19 02:31:48'),
(27, 'block1-text4', 'home', '10', 'cn', NULL, '2024-07-19 02:31:48'),
(28, 'block1-text5', 'home', '40+', 'en', NULL, '2024-07-19 02:31:48'),
(29, 'block1-text5', 'home', '40+', 'cn', NULL, '2024-07-19 02:31:48'),
(30, 'block1-text6', 'home', 'As a Vietnamese enterprise, CRC Solar is always proud to be a high-quality Vietnamese enterprise pioneering in this solar power production industry.\r\n\r\nWe regularly organize internal training programs, career planning and care for employee lives. In addition, CRC Solar also cooperates with universities, educational and scientific research organizations to foster talent and create more local jobs.', 'en', NULL, '2024-07-19 02:31:48'),
(31, 'block1-text6', 'home', '作为一家越南企业，CRC Solar始终自豪地成为太阳能发电行业领先的优质越南企业。\r\n\r\n我们定期组织内部培训、职业规划、关心员工生活。此外，华润太阳能还与大学、教育科研机构合作，培养人才，创造更多当地就业岗位。', 'cn', NULL, '2024-07-19 02:31:48'),
(32, 'block5-text1', 'home', 'In July 2021, CRC Solar Cell Joint Stock Company launched the new 166 Series battery line with high capacity and super efficient modules. This new line of panels is designed with 144 cells, delivering a maximum capacity of 550W and achieving super high efficiency of 21.39%.\r\nCRC Solar offers an industry-best 15-year product warranty and a 25-year linear warranty. Degradation is only 2% in the first year and a maximum annual decline of 0.5% from year two to year 25. With upgraded panel materials and optimized process design, the battery CRC Solar energy provides outstanding mechanical load safety and reliability. Excellent mechanical load performance makes our products suitable for installation in areas with heavy snow/wind loads.', 'en', NULL, '2024-07-19 02:31:48'),
(33, 'block5-text1', 'home', '2021年7月，CRC太阳能电池股份公司推出了新型166系列电池系列，具有高容量和超高效组件。该新系列电池板采用144片电池片设计，最大容量达550W，并实现21.39%的超高效率。\r\nCRC Solar 提供业界最佳的 15 年产品保修和 25 年线性保修。第一年的衰减仅为 2%，第二年至第 25 年的最大年衰减为 0.5%。凭借升级的面板材料和优化的工艺设计，电池 CRC Solar energy 提供了出色的机械负载安全性和可靠性。优异的机械负载性能使我们的产品适合安装在雪/风负载较大的地区。', 'cn', NULL, '2024-07-19 02:31:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `detail` text NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `logs`
--

INSERT INTO `logs` (`log_id`, `admin_id`, `action`, `status`, `detail`, `create_at`) VALUES
(1, 1, 'create account data admin', 0, '', '2024-07-25 12:08:24'),
(2, 1, 'create account data admin', 0, '', '2024-07-25 12:11:32'),
(3, 1, 'update account data admin', 0, '', '2024-07-25 12:22:27'),
(4, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 12:55:24'),
(5, 1, 'update', 1, 'Chỉnh sửa nội dung hiển thị trang home.vn', '2024-07-25 12:55:53'),
(6, 2, 'login', 0, 'Tài khoản đã bị vô hiệu hóa.', '2024-07-25 22:56:13'),
(7, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản vuq147@gmail.com', '2024-07-25 22:56:30'),
(8, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 22:57:11'),
(9, 2, 'logout', 1, 'Đăng xuất thành công', '2024-07-25 23:30:08'),
(10, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 23:30:14'),
(11, 2, 'logout', 1, 'Đăng xuất thành công', '2024-07-25 23:33:05'),
(12, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 23:33:13'),
(13, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản vuq147@gmail.com', '2024-07-25 23:33:27'),
(14, 2, 'login', 0, 'Tài khoản đã bị vô hiệu hóa.', '2024-07-25 23:34:27'),
(15, 2, 'login', 0, 'Tài khoản đã bị vô hiệu hóa.', '2024-07-25 23:34:33'),
(16, 2, 'login', 0, 'Tài khoản đã bị vô hiệu hóa.', '2024-07-25 23:34:36'),
(17, 2, 'login', 0, 'Tài khoản đã bị vô hiệu hóa.', '2024-07-25 23:34:38'),
(18, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản vuq147@gmail.com', '2024-07-25 23:34:59'),
(19, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 23:48:09'),
(20, 2, 'logout', 1, 'Đăng xuất thành công', '2024-07-25 23:49:14'),
(21, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 23:49:30'),
(22, 2, 'logout', 1, 'Đăng xuất thành công', '2024-07-25 23:50:20'),
(23, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-25 23:50:30'),
(24, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-26 09:36:50'),
(25, 1, 'logout', 1, 'Đăng xuất thành công', '2024-07-26 09:53:03'),
(26, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-26 09:53:21'),
(27, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-26 09:54:02'),
(28, 1, 'create account data admin', 1, 'Tạo tài khoản admin: nhnguyen', '2024-07-26 09:57:53'),
(29, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản nhnguyen', '2024-07-26 09:58:04'),
(30, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản nhnguyen', '2024-07-26 09:58:04'),
(31, 1, 'create', 0, 'Sản phẩm thiếu hình ảnh', '2024-07-26 10:00:55'),
(32, 1, 'create', 0, 'Sản phẩm thiếu hình ảnh', '2024-07-26 10:02:00'),
(33, 2, 'update account data admin', 0, '', '2024-07-26 10:04:51'),
(34, 2, 'update account data admin', 0, '', '2024-07-26 10:04:52'),
(35, 2, 'update account data admin', 0, '', '2024-07-26 10:04:53'),
(36, 2, 'update account data admin', 0, 'Tài khoản không được cấp quyền.', '2024-07-26 10:16:10'),
(37, 2, 'update account data admin', 0, 'Tài khoản không được cấp quyền.', '2024-07-26 10:16:11'),
(38, 1, 'create', 1, 'Tạo vài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '2024-07-26 10:31:21'),
(39, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-26 13:34:31'),
(40, 1, 'delete product image', 1, '', '2024-07-26 16:09:58'),
(41, 1, 'logout', 1, 'Đăng xuất thành công', '2024-07-27 13:26:06'),
(42, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-27 13:26:10'),
(43, 1, 'update', 0, '', '2024-07-27 19:08:16'),
(44, 1, 'update', 0, '', '2024-07-27 19:17:53'),
(45, 1, 'update', 0, '', '2024-07-27 19:19:23'),
(46, 1, 'update', 1, '', '2024-07-27 19:20:41'),
(47, 1, 'update', 1, '', '2024-07-27 19:23:38'),
(48, 1, 'update', 1, '', '2024-07-27 19:25:25'),
(49, 1, 'update', 1, '', '2024-07-27 19:28:36'),
(50, 1, 'update', 1, '', '2024-07-27 19:33:02'),
(51, 1, 'update', 1, '', '2024-07-27 19:35:35'),
(52, 1, 'update', 1, '', '2024-07-27 19:36:25'),
(53, 1, 'update', 1, '', '2024-07-27 19:36:48'),
(54, 1, 'delete', 0, '', '2024-07-27 20:37:34'),
(55, 1, 'update', 0, '', '2024-07-27 20:47:31'),
(56, 1, 'update', 0, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - MONOFACIAL\' thành \'CRC 72MHM - 182 - MONOFACIAL\'', '2024-07-27 20:47:57'),
(57, 1, 'update', 0, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - MONOFACIAL\' thành \'CRC 72MHM - 182 - MONOFACIAL\'', '2024-07-27 20:48:44'),
(58, 1, 'update', 0, 'Chỉnh sửa sản phẩm \'dangphong\' thành \'dangphong\'', '2024-07-27 20:54:23'),
(59, 1, 'update', 0, 'Chỉnh sửa sản phẩm \'dangphong\' thành \'dangphong\'', '2024-07-27 20:55:24'),
(60, 1, 'update', 0, 'Chỉnh sửa sản phẩm \'dangphong\' thành \'dangphong\'', '2024-07-27 20:55:44'),
(61, 1, 'update', 0, 'Chỉnh sửa sản phẩm \'dangphong\' thành \'dangphong\'', '2024-07-27 20:56:53'),
(62, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'dangphong\' thành \'dangphong\'', '2024-07-27 20:57:12'),
(63, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'dangphong\' thành \'dangphong\'', '2024-07-27 20:58:12'),
(64, 1, 'delete', 0, '', '2024-07-27 20:58:25'),
(65, 1, 'delete', 0, '', '2024-07-27 20:59:49'),
(66, 1, 'delete', 1, 'Xóa sản phẩm dangphong', '2024-07-27 21:00:35'),
(67, 1, 'logout', 1, 'Đăng xuất thành công', '2024-07-27 21:05:06'),
(68, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-27 21:05:08'),
(69, 1, 'logout', 1, 'Đăng xuất thành công', '2024-07-28 12:57:20'),
(70, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 12:57:22'),
(71, 0, 'update', 0, '', '2024-07-28 17:00:58'),
(72, 1, 'logout', 1, 'Đăng xuất thành công', '2024-07-28 17:02:15'),
(73, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 17:02:17'),
(74, 1, 'update', 1, 'Cập nhật bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà thành bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '2024-07-28 17:02:29'),
(75, 1, 'update', 1, 'Cập nhật bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà thành bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '2024-07-28 17:03:09'),
(76, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - MONOFACIAL\' thành \'CRC 72MHM - 182 - MONOFACIAL\'', '2024-07-28 17:06:31'),
(77, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - MONOFACIAL\' thành \'CRC 72MHM - 182 - MONOFACIAL\'', '2024-07-28 17:07:45'),
(78, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - MONOFACIAL\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-28 17:07:55'),
(79, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - BIFACIAL MODULES\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-28 17:10:39'),
(80, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - BIFACIAL MODULES\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-28 17:12:21'),
(81, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - BIFACIAL MODULES\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-28 17:12:41'),
(82, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - BIFACIAL MODULES\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-28 17:12:50'),
(83, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - BIFACIAL MODULES\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-28 17:15:51'),
(84, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 72MHM - 182 - BIFACIAL MODULES\' thành \'CRC 72MHM - 182 - MONOFACIAL\'', '2024-07-28 17:17:00'),
(85, 1, 'update', 1, 'Cập nhật bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà thành bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '2024-07-28 17:29:57'),
(86, 1, 'update', 1, 'Cập nhật bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà thành bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '2024-07-28 17:31:53'),
(87, 1, 'update', 1, 'Cập nhật bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà thành bài viết: Bộ trưởng Nguyễn Hồng Diên làm việc với các đơn vị về phát triển điện mặt trời mái nhà', '2024-07-28 17:34:47'),
(88, 1, 'logout', 1, 'Đăng xuất thành công', '2024-07-28 19:34:53'),
(89, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 19:35:02'),
(90, 2, 'login', 0, 'Mật khẩu không chính xác.', '2024-07-28 19:47:39'),
(91, 2, 'login', 0, 'Mật khẩu không chính xác.', '2024-07-28 20:52:29'),
(92, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 20:54:28'),
(93, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản vuq147@gmail.com', '2024-07-28 20:55:36'),
(94, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản vuq147@gmail.com', '2024-07-28 20:55:37'),
(95, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản nhnguyen', '2024-07-28 20:55:38'),
(96, 1, 'update account data admin', 1, 'Vô hiệu hóa tài khoản nhnguyen', '2024-07-28 20:55:39'),
(97, 2, 'logout', 1, 'Đăng xuất thành công', '2024-07-28 21:03:14'),
(98, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 21:03:33'),
(99, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 22:01:33'),
(100, 1, 'login', 1, 'Đăng nhập thành công.', '2024-07-28 22:21:44'),
(101, 1, 'update', 1, 'Cập nhật yêu cầu liên hệ số 1', '2024-07-28 22:46:05'),
(102, 1, 'update', 1, 'Cập nhật yêu cầu liên hệ số 2', '2024-07-28 22:49:37'),
(103, 1, 'create', 0, 'Tạo câu hỏi \"CRC Solar có cam kết gì về chất lượng sản phẩm?\"', '2024-07-29 02:40:50'),
(104, 1, 'create', 1, 'Tạo câu hỏi \"CRC Solar có cam kết gì về chất lượng sản phẩm?\"', '2024-07-29 02:41:24'),
(105, 1, 'create', 1, 'Tạo câu hỏi \"Thị trường pin năng lượng mặt trời hiện nay phát triển như thế nào?\"', '2024-07-29 02:43:48'),
(106, 1, 'create', 1, 'Tạo câu hỏi \"Lợi ích của việc sử dụng năng lượng mặt trời cho hộ gia đình là gì?\"', '2024-07-29 02:46:19'),
(107, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 60MHM - 166\' thành \'CRC 60MHM - 166\'', '2024-07-29 11:03:15'),
(108, 1, 'update', 1, 'Chỉnh sửa sản phẩm \'CRC 60MHM - 166\' thành \'CRC 72MHM - 182 - BIFACIAL MODULES\'', '2024-07-29 11:03:34'),
(109, 1, 'update', 1, 'Chỉnh sửa nội dung hiển thị trang introduction.vn', '2024-07-29 11:05:01'),
(110, 1, 'update', 1, 'Chỉnh sửa nội dung hiển thị trang introduction.vn', '2024-07-29 11:05:43'),
(111, 1, 'update', 1, 'Chỉnh sửa nội dung hiển thị trang introduction.vn', '2024-07-29 11:07:02'),
(112, 1, 'create', 1, 'Tạo câu hỏi \"Tôi là ai?\"', '2024-07-29 11:12:17'),
(113, 2, 'login', 1, 'Đăng nhập thành công.', '2024-07-29 11:17:15'),
(114, 2, 'logout', 1, 'Đăng xuất thành công', '2024-07-29 11:17:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `product_category_id` int(11) NOT NULL,
  `quantity_cell` int(11) NOT NULL,
  `power_output_range` varchar(255) NOT NULL,
  `max_system_vol` int(11) NOT NULL,
  `max_efficiency` float NOT NULL,
  `dimension` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `language` varchar(2) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_code`, `product_category_id`, `quantity_cell`, `power_output_range`, `max_system_vol`, `max_efficiency`, `dimension`, `detail`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'CRC 72MHM - 182 - BIFACIAL MODULES', 'CRC 72MHM - 182 - BIFACIAL MODULES', 2, 144, '530W - 550W', 1500, 24.31, '2279x1134x35mm', '', 'vn', 1, '2024-07-18 01:39:53', 1, '2024-07-29 11:03:34'),
(2, 'CRC 72MHM - 166', 'CRC 72MHM - 166', 1, 144, '445W - 465W', 1500, 21.39, '2094x1038x35mm', '', 'vn', 1, '2024-07-18 01:39:53', NULL, NULL),
(3, '54MDH-BH', '54MDH-BH', 2, 108, '390W - 410W', 1500, 21.15, '2094x1038x35mm', '', 'vn', 1, '2024-07-18 01:52:35', NULL, NULL),
(4, '60MDH', '60MDH', 2, 120, '440W - 460W', 1500, 21.19, '2094x1038x35mm', '', 'vn', 1, '2024-07-18 01:52:35', NULL, NULL),
(5, '60MGD', '60MGD', 2, 120, '440W - 460W', 1500, 21.19, '2094x1038x35mm', '', 'vn', 1, '2024-07-18 01:52:35', NULL, NULL),
(6, '72MDH', '72MDH', 2, 144, '530W - 550W', 1500, 21.28, '2094x1038x35mm', '', 'vn', 1, '2024-07-18 01:52:35', NULL, '2024-07-18 01:52:35'),
(7, 'CRC 72MGD', 'CRC 72MGD', 2, 144, '530W - 550W', 1500, 21.28, '2094x1038x35mm', '', 'vn', 1, '2024-07-18 01:52:35', NULL, '2024-07-18 01:52:35'),
(8, 'CRC 72MHM - 182 - MONOFACIAL', 'CRC 72MHM - 182 - MONOFACIAL', 2, 144, '530W - 550W', 1500, 21.28, '2279x1134x35mm', '', 'vn', 1, '2024-07-18 01:55:22', 1, '2024-07-28 17:17:00'),
(9, 'CRC 72MHM - 182 - BIFACIAL MODULES', 'CRC 72MHM - 182 - BIFACIAL MODULES', 2, 144, '530W - 550W', 1500, 24.31, '2279x1134x35mm', '', 'vn', 1, '2024-07-18 01:55:22', 1, '2024-07-28 17:12:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_categories`
--

CREATE TABLE `product_categories` (
  `product_category_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `seo_title` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `language` varchar(2) NOT NULL DEFAULT 'vn',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_categories`
--

INSERT INTO `product_categories` (`product_category_id`, `title`, `description`, `seo_title`, `status`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, '166 Series', 'High Power, Monocrystalline, Half-cut Cell', 'High Power, Monocrystalline, Half-cut Cell', 1, 'vn', 1, '2024-07-18 01:21:53', NULL, NULL),
(2, '182 Series', 'High Power, Monocrystalline, Half-cut Cell', 'High Power, Monocrystalline, Half-cut Cell', 1, 'vn', 1, '2024-07-18 01:21:53', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `product_image_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`product_image_id`, `product_id`, `content`, `src`) VALUES
(5, 1, 'Ảnh 5', '/image/Crc 60Mhm - 166.jpg'),
(7, 2, 'Ảnh 7', '/image/Crc 72Mhm - 166.jpg'),
(8, 8, 'Ảnh 8', '/image/Crc 72Mhm - 182 - B.jpg'),
(11, 9, 'Ảnh asdas', '/image/demo2.jpg'),
(12, 9, 'Ảnhasdas', '/image/demo3.jpg'),
(15, 9, '', '/image/1_2021-07-29-06-45-24.jpg'),
(16, 7, '', '/image/2023-08-18-14-18-53-72.jpg'),
(17, 6, '', '/image/2023-08-18-14-17-48-85.jpg'),
(18, 5, '', '/image/2023-08-18-14-16-12-20.jpg'),
(19, 4, '', '/image/2023-08-18-14-09-43-35.jpg'),
(20, 4, '', '/image/2023-08-18-14-06-50-37.jpg'),
(21, 3, '', '/image/2023-08-18-14-06-50-37.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_technology`
--

CREATE TABLE `product_technology` (
  `product_technology_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `technology_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_technology`
--

INSERT INTO `product_technology` (`product_technology_id`, `product_id`, `technology_id`) VALUES
(1, 3, 2),
(2, 3, 1),
(3, 4, 2),
(4, 4, 1),
(5, 5, 2),
(6, 5, 1),
(7, 6, 2),
(8, 6, 1),
(9, 1, 2),
(11, 7, 2),
(12, 7, 1),
(13, 2, 2),
(14, 2, 1),
(15, 8, 2),
(16, 8, 1),
(17, 9, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `language` varchar(2) NOT NULL DEFAULT 'vn',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `questions`
--

INSERT INTO `questions` (`question_id`, `title`, `detail`, `status`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'CRC Solar là gì và công ty chuyên về lĩnh vực nào?', 'CRC Solar là một công ty hàng đầu trong lĩnh vực năng lượng mặt trời, chuyên cung cấp các giải pháp và sản phẩm liên quan đến năng lượng mặt trời bao gồm tấm pin mặt trời, hệ thống năng lượng mặt trời và dịch vụ lắp đặt, bảo trì.', 1, 'vn', 1, '2024-07-28 23:38:14', NULL, '2024-07-28 23:38:14'),
(2, 'Các sản phẩm của CRC Solar có chứng nhận chất lượng không?', 'Các sản phẩm của CRC Solar đều đạt các chứng nhận chất lượng quốc tế như IEC, TUV, UL, đảm bảo hiệu suất và độ bền cao trong suốt thời gian sử dụng.', 1, 'vn', 1, '2024-07-28 23:38:14', NULL, '2024-07-28 23:38:14'),
(3, 'Công ty CRC Solar có cung cấp dịch vụ lắp đặt hệ thống năng lượng mặt trời không?', 'Có, CRC Solar cung cấp dịch vụ lắp đặt hệ thống năng lượng mặt trời từ khâu khảo sát, thiết kế, lắp đặt đến bảo trì, đảm bảo hệ thống hoạt động hiệu quả và bền bỉ.', 1, 'vn', 1, '2024-07-28 23:38:14', NULL, '2024-07-28 23:38:14'),
(4, 'Năng lượng mặt trời là gì và lợi ích của việc sử dụng năng lượng mặt trời là gì?', 'Năng lượng mặt trời là năng lượng được tạo ra từ ánh sáng mặt trời. Lợi ích của việc sử dụng năng lượng mặt trời bao gồm giảm thiểu khí thải carbon, tiết kiệm chi phí điện năng và tăng cường độc lập về năng lượng.', 1, 'vn', 1, '2024-07-28 23:38:14', NULL, '2024-07-28 23:38:14'),
(5, 'Hệ thống năng lượng mặt trời hoạt động như thế nào?', 'Hệ thống năng lượng mặt trời hoạt động bằng cách sử dụng các tấm pin mặt trời để chuyển đổi ánh sáng mặt trời thành điện năng. Điện năng này sau đó được lưu trữ trong các bộ lưu điện hoặc trực tiếp sử dụng để cung cấp điện cho các thiết bị trong gia đình hoặc doanh nghiệp.', 1, 'vn', 1, '2024-07-28 23:38:14', NULL, '2024-07-28 23:38:14'),
(6, 'Làm thế nào để biết nhà của tôi có phù hợp để lắp đặt hệ thống năng lượng mặt trời không?', 'Để biết nhà của bạn có phù hợp để lắp đặt hệ thống năng lượng mặt trời, bạn có thể liên hệ với CRC Solar để được tư vấn và khảo sát. Chúng tôi sẽ đánh giá vị trí, hướng nhà và diện tích mái nhà của bạn để đề xuất giải pháp phù hợp.', 1, 'vn', 1, '2024-07-28 23:38:14', NULL, '2024-07-28 23:38:14'),
(7, 'CRC Solar có cam kết gì về chất lượng sản phẩm?', 'CRC Solar cam kết cung cấp các sản phẩm năng lượng mặt trời với chất lượng cao nhất. Chúng tôi sử dụng các nguyên vật liệu tốt nhất và áp dụng quy trình kiểm tra chất lượng nghiêm ngặt để đảm bảo rằng các sản phẩm của chúng tôi đạt tiêu chuẩn quốc tế. Ngoài ra, CRC Solar còn cung cấp chế độ bảo hành dài hạn và dịch vụ hỗ trợ kỹ thuật chuyên nghiệp để đảm bảo sự hài lòng của khách hàng.', 1, 'vn', 1, '2024-07-29 02:41:24', NULL, '2024-07-29 02:41:24'),
(8, 'Thị trường pin năng lượng mặt trời hiện nay phát triển như thế nào?', 'Thị trường pin năng lượng mặt trời hiện nay đang phát triển mạnh mẽ và nhanh chóng trên toàn cầu. Với sự quan tâm ngày càng tăng về năng lượng tái tạo và giảm thiểu tác động tiêu cực đến môi trường, nhiều quốc gia đã đưa ra các chính sách hỗ trợ và khuyến khích việc sử dụng năng lượng mặt trời. Công nghệ sản xuất pin năng lượng mặt trời cũng không ngừng được cải tiến, giúp tăng hiệu suất và giảm chi phí. Điều này đã làm cho việc sử dụng năng lượng mặt trời trở nên phổ biến hơn trong cả các hộ gia đình và các doanh nghiệp.', 1, 'vn', 1, '2024-07-29 02:43:48', NULL, '2024-07-29 02:43:48'),
(9, 'Lợi ích của việc sử dụng năng lượng mặt trời cho hộ gia đình là gì?', 'Sử dụng năng lượng mặt trời cho hộ gia đình mang lại nhiều lợi ích đáng kể. Đầu tiên, nó giúp giảm hóa đơn tiền điện hàng tháng bằng cách tự sản xuất điện từ nguồn năng lượng miễn phí của mặt trời. Thứ hai, việc sử dụng năng lượng mặt trời góp phần bảo vệ môi trường bằng cách giảm lượng khí thải carbon và phụ thuộc vào nhiên liệu hóa thạch. Ngoài ra, lắp đặt hệ thống năng lượng mặt trời còn tăng giá trị bất động sản và có thể nhận được các khoản hỗ trợ hoặc ưu đãi từ chính phủ. Cuối cùng, việc sử dụng năng lượng mặt trời mang lại sự độc lập về năng lượng, giúp hộ gia đình không bị ảnh hưởng bởi việc tăng giá điện hoặc cúp điện.', 1, 'vn', 1, '2024-07-29 02:46:19', NULL, '2024-07-29 02:46:19'),
(10, 'Tôi là ai?', 'CRC Solar', 1, 'vn', 1, '2024-07-29 11:12:17', NULL, '2024-07-29 11:12:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recruitments`
--

CREATE TABLE `recruitments` (
  `recruitment_id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `salary_range` varchar(255) NOT NULL,
  `experience_required` int(11) NOT NULL,
  `application_deadline` date NOT NULL,
  `detail` text NOT NULL,
  `language` varchar(2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `recruitments`
--

INSERT INTO `recruitments` (`recruitment_id`, `position`, `department`, `location`, `quantity`, `salary_range`, `experience_required`, `application_deadline`, `detail`, `language`, `status`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Trưởng phòng kinh doanh', 'Phòng kinh doanh', 'Hà Nội', 3, '15 - 20 triệu', 3, '2024-07-20', '', 'vn', 1, 0, '2024-07-20 18:19:15', NULL, '2024-07-20 18:19:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `requests`
--

CREATE TABLE `requests` (
  `request_id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(11) NOT NULL,
  `message` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `language` varchar(2) NOT NULL DEFAULT 'vn',
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `requests`
--

INSERT INTO `requests` (`request_id`, `fullname`, `address`, `email`, `phone_number`, `message`, `status`, `language`, `updated_by`, `updated_at`) VALUES
(1, 'Vũ Tiến Quyền', '', 'vuq147@gmail.com', '0399348711', 'ABCDEF', 1, 'vn', 1, '2024-07-28 22:46:05'),
(2, 'Vũ Tiến Quyền', '', 'vuq147@gmail.com', '0399348711', 'ABCDEF', 1, 'vn', 1, '2024-07-28 22:49:37'),
(3, 'Vũ Tiến Quyền', '', 'vuq147@gmail.com', '0399348711', 'qưeq98wequiwehkqjwhekjqwhejkqwhekjqwhekjqwhekjqwhekjqhwekjqhwkejqhwkdjhqwkjdhqwkdjhqwkjdh\r\nqwkjdhqwkjdhqwkjdhqwkjdhqwkjdhqkwjdhqkwjdhqkwjdhqkwgiwuegwjhernbfqwekrjfghlweijgfhlwkjehfi', 0, 'vn', NULL, '2024-07-28 19:54:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `technologies`
--

CREATE TABLE `technologies` (
  `technology_id` int(11) NOT NULL,
  `technology_name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `detail` text NOT NULL,
  `language` varchar(2) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `technologies`
--

INSERT INTO `technologies` (`technology_id`, `technology_name`, `image`, `description`, `detail`, `language`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Công nghệ PERC', '/image/cong-nghe-perc.jpg', 'Dựa trên tấm nền đơn tinh thể tiên tiến và công nghệ chống LID, CRC Solar đảm bảo bảo hành điện năng năm đầu tiên hơn ≥98% cho các mô-đun PV. \nHiệu suất bức xạ thấp vượt trội, hệ số nhiệt độ điện năng thấp, nhiệt độ hoạt động thấp, tất cả những công nghệ', '', 'vn', 1, '2024-07-18 01:30:47', NULL, NULL),
(2, 'Công nghệ Half-cut', '/image/cong-nghe-half-cut.png', 'Trong điều kiện chiếu xạ cao, mô-đun nửa tế bào (Half-Cell), đặc biệt là mô-đun nửa tế bào hai mặt (Bifacial Half-Cell), sẽ có năng suất cao hơn so với mô-đun thông thường. Mô-đun nửa ô hai mặt (Bifacial Half-cell) sẽ giúp đạt được LCOE thấp nhất ở những ', '', 'vn', 1, '2024-07-18 01:30:47', NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Chỉ mục cho bảng `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`blog_id`),
  ADD KEY `fk_blog_created` (`created_by`),
  ADD KEY `fk_blog_categori` (`category_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `fk_blogs_updated` (`updated_by`),
  ADD KEY `fk_blogs_created` (`created_by`);

--
-- Chỉ mục cho bảng `display_images`
--
ALTER TABLE `display_images`
  ADD PRIMARY KEY (`display_image_id`);

--
-- Chỉ mục cho bảng `display_texts`
--
ALTER TABLE `display_texts`
  ADD PRIMARY KEY (`display_text_id`);

--
-- Chỉ mục cho bảng `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_log_admin` (`admin_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_products_created` (`created_by`),
  ADD KEY `fk_products_updated` (`updated_by`),
  ADD KEY `fk_product_category` (`product_category_id`);

--
-- Chỉ mục cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`product_category_id`),
  ADD KEY `fk_product_category_created` (`created_by`),
  ADD KEY `fk_product_category_updated` (`updated_by`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`product_image_id`),
  ADD KEY `fk_product_images` (`product_id`);

--
-- Chỉ mục cho bảng `product_technology`
--
ALTER TABLE `product_technology`
  ADD PRIMARY KEY (`product_technology_id`),
  ADD KEY `fk_product` (`product_id`),
  ADD KEY `fk_technology` (`technology_id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `fk_question_created` (`created_by`),
  ADD KEY `fk_question_deleted` (`updated_by`);

--
-- Chỉ mục cho bảng `recruitments`
--
ALTER TABLE `recruitments`
  ADD PRIMARY KEY (`recruitment_id`);

--
-- Chỉ mục cho bảng `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `fk_request_updated` (`updated_by`);

--
-- Chỉ mục cho bảng `technologies`
--
ALTER TABLE `technologies`
  ADD PRIMARY KEY (`technology_id`),
  ADD KEY `fk_technology_created` (`created_by`),
  ADD KEY `fk_technology_updated` (`updated_by`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `blogs`
--
ALTER TABLE `blogs`
  MODIFY `blog_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `display_images`
--
ALTER TABLE `display_images`
  MODIFY `display_image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `display_texts`
--
ALTER TABLE `display_texts`
  MODIFY `display_text_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `product_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `product_image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `product_technology`
--
ALTER TABLE `product_technology`
  MODIFY `product_technology_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `recruitments`
--
ALTER TABLE `recruitments`
  MODIFY `recruitment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `requests`
--
ALTER TABLE `requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `technologies`
--
ALTER TABLE `technologies`
  MODIFY `technology_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `fk_blog_categori` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_blog_created` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_blogs_created` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_blogs_updated` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `fk_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`product_category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_products_created` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_updated` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_product_category_created` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_product_category_updated` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_product_images` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_technology`
--
ALTER TABLE `product_technology`
  ADD CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_technology` FOREIGN KEY (`technology_id`) REFERENCES `technologies` (`technology_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_question_created` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_question_deleted` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `fk_request_updated` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Các ràng buộc cho bảng `technologies`
--
ALTER TABLE `technologies`
  ADD CONSTRAINT `fk_technology_created` FOREIGN KEY (`created_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_technology_updated` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
