$(document).ready(function() {
    var $toTopBtn = $('.to-top-btn');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            $toTopBtn.addClass('show');
        } else {
            $toTopBtn.removeClass('show');
        }
    });

    $toTopBtn.click(function() {
        $('html, body').animate({ scrollTop: 0 }, 'smooth');
    });
});