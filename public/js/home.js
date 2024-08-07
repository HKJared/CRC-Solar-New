$(document).ready(function() {
    
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
        
        // Tính toán vị trí của phần tử mô tả so với khung cuộn ngang của list
        var targetPosition = $targetElement.position().left;
        
        // Cuộn list đến vị trí của phần tử mô tả với hiệu ứng mượt
        $('.detail-technologies-container .list').animate({
            scrollLeft: targetPosition
        }, 700); // Thời gian animation là 500ms
    });
});
