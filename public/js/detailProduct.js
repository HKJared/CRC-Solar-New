
$(document).ready(function() {
    $(document).on('click', '.next', function() {
        const items = $('.box-image .slide .item');
        $('.box-image .slide').append(items[0]);
    });

    $(document).on('click', '.pre', function() {
        const items = $('.box-image .slide .item');
        $('.box-image .slide').prepend(items[items.length - 1]);
    });
})