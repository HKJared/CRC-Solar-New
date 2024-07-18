$(document).ready(function() {
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
});