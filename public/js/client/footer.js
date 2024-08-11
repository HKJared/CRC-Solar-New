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

    // Function to create the count-up effect
    function countUp(element, finalValue, hasPlus) {
        let count = 0;
        let increment = finalValue / 100; // Adjust the increment value for speed
        let interval = setInterval(function() {
            count += increment;
            if (count >= finalValue) {
                clearInterval(interval);
                count = finalValue;
            }
            $(element).text(Math.floor(count) + (hasPlus ? '+' : ''));
        }, 10); // Adjust the interval time for smoother effect
    }

    // Observe when the element comes into view
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let $cntNum = $(entry.target);
                let finalText = $cntNum.text();
                let hasPlus = finalText.includes('+');
                let finalValue = parseInt(finalText, 10);
                countUp($cntNum, finalValue, hasPlus);
                $cntNum.addClass('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Attach the observer to each .cnt-num element
    $('.cnt-num').each(function() {
        observer.observe(this);
    });

    $(document).on('click', 'a.link-element', function(event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>

        // Lấy giá trị href của thẻ <a>
        var target = $(this).attr('href');
        
        // Trượt đến phần tử mục tiêu và cách đỉnh 100px
        $('html, body').animate({
            scrollTop: $(target).offset().top - 120
        }, 800); // Thời gian trượt (800ms)
    });
});