$(document).ready(function() {
    var language = $('.top-language');
    var lang1 = language.find('.lang1');

    // Bắt sự kiện khi di chuột vào
    language.on('mouseenter', function() {
        lang1.stop().slideDown();
    });

    // Bắt sự kiện khi di chuột ra
    language.on('mouseleave', function() {
        lang1.stop().slideUp();
    });

    // Hiệu ứng toggle khi nhấp vào các mục nav-link
    $(document).on('click', '.nav-link', function(event) {
        event.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các phần tử cha
        var subMenu = $(this).find('.dropdown-sub-menu');
        var chevronIcon = $(this).find('.fa-chevron-down');

        // Ẩn tất cả các menu con khác và xóa lớp blur
        $('.dropdown-sub-menu').not(subMenu).slideUp().removeClass('active');
        $('body > *').not('header').removeClass('blur');
        
        // Toggle menu con hiện tại
        subMenu.stop().slideToggle().toggleClass('active');
        subMenu.css('display', 'flex');

        // Toggle class quay icon
        chevronIcon.toggleClass('fa-rotate-180');

        // Thêm lớp blur nếu menu con hiện tại được hiển thị
        if (subMenu.hasClass('active')) {
            $('body > *').not('header').addClass('blur');
        } else {
            $('body > *').not('header').removeClass('blur');
        }
    });

    // Đóng menu khi nhấp vào bất kỳ nơi nào khác trên trang
    $(document).on('click', function() {
        $('.dropdown-sub-menu').slideUp().removeClass('active');
        $('body > *').not('header').removeClass('blur');
        $('.fa-chevron-down').removeClass('fa-rotate-180'); // Xóa lớp khi đóng menu
    });

    // Ngăn chặn việc đóng menu khi nhấp vào bên trong menu
    $(document).on('click', '.dropdown-sub-menu', function(event) {
        event.stopPropagation();
    });
});
