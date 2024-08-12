$(document).ready(function() {
    const $sliderList = $('.slider .list');
    const $images = $sliderList.find('img');
    const totalSlides = $images.length;
    let currentIndex = 0;

    function showNextSlide() {
        currentIndex++;
        if (currentIndex >= totalSlides) {
            currentIndex = 0;
        }
        $sliderList.animate({ scrollLeft: currentIndex * $sliderList.width() }, 500);
    }

    // Tự động cuộn mỗi 3 giây
    setInterval(showNextSlide, 3000);
});


$(document).ready(function() {
    $('.technologies-container li').on('click', function() {
        // Kiểm tra xem mục hiện tại đã có lớp active chưa
        if ($(this).hasClass('active')) {
            return; // Nếu đã active, không làm gì cả
        }
    
        var technologyId = $(this).data('technologyid');
        var $targetElement = $('.detail-technologies-container .row[data-technologyid="' + technologyId + '"]');
        
        // Xóa lớp active khỏi tất cả các mục khác
        $('.technologies-container li').removeClass('active');
        // Thêm lớp active cho mục được click
        $(this).addClass('active');
        
        // Tính toán vị trí của phần tử mô tả trong list
        var targetIndex = $targetElement.index(); // Lấy chỉ số của phần tử
        var containerWidth = $('.detail-technologies-container').width(); // Lấy chiều rộng của container
        var targetPosition = targetIndex * containerWidth; // Vị trí cần cuộn tới
    
        // Cuộn list đến vị trí của phần tử mô tả với hiệu ứng mượt
        $('.detail-technologies-container .list').animate({
            scrollLeft: targetPosition
        }, 700); // Thời gian animation là 700ms
    });    
});
