$(document).ready(function() {
    var language = $('.top-language');
    var lang1 = language.find('.lang1');

    // Hiệu ứng khi rê chuột vào ngôn ngữ
    language.on('mouseenter', function() {
        lang1.stop().slideDown();
    });

    // Hiệu ứng khi rê chuột ra khỏi ngôn ngữ
    language.on('mouseleave', function() {
        lang1.stop().slideUp();
    });

    // Hiệu ứng toggle khi click vào các nav-link
    $(document).on('click', '.nav-link', function(event) {
        event.stopPropagation(); // Ngăn không cho sự kiện lây lan lên cha
        var subMenu = $(this).find('.dropdown-sub-menu');
        var chevronIcon = $(this).find('.fa-chevron-down');
        var is_other_subMenu_show = $('.dropdown-sub-menu.active').not(subMenu).length;

        $('.dropdown-sub-menu').not(subMenu).slideUp().removeClass('active');
        $('body > *').not('header').removeClass('blur');
        $('.fa-chevron-down').not(chevronIcon).removeClass('fa-rotate-180');

        if (is_other_subMenu_show > 0) {
            setTimeout(function() {
                subMenu.stop().slideToggle().toggleClass('active');
                subMenu.css('display', 'flex');
                chevronIcon.toggleClass('fa-rotate-180');
            }, 400);
        } else {
            subMenu.stop().slideToggle().toggleClass('active');
            subMenu.css('display', 'flex');
            chevronIcon.toggleClass('fa-rotate-180');
        }

        // Thêm lớp blur nếu submenu hiện tại được hiển thị
        if (subMenu.hasClass('active')) {
            $('body > *').not('header').addClass('blur');
        } else {
            $('body > *').not('header').removeClass('blur');
        }
    });

    // Đóng submenu khi click bên ngoài
    $(document).on('click', function() {
        $('.dropdown-sub-menu.active').slideUp().removeClass('active');
        $('body > *').not('header').removeClass('blur');
        $('.fa-chevron-down').removeClass('fa-rotate-180'); // Xóa lớp khi đóng submenu
    });

    // Ngăn không cho submenu đóng khi click bên trong submenu
    $(document).on('click', '.dropdown-sub-menu', function(event) {
        event.stopPropagation();
    });
});
