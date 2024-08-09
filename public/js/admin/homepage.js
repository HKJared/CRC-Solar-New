const language = $('header').data('language');

$(document).ready(function() {
    refreshToken();

    setInterval(refreshToken, 60000);

    $(document).on('input change', 'input, textarea, select', function() {
        $(this).removeClass('warning-border'); 
    });

    $('nav li label').click(function() {
        $(this).next('.sub-menu').slideToggle();
        $(this).parent().toggleClass('expanded');
    });

    $(".sub-menu li").each(function() {
        if ($(this).hasClass("active")) {
            $(this).closest(".sub-menu").show();
        }
    });

    $(document).on('input', '.price', function(event) {
        var inputValue = $(this).val();

        $(this).val(formatPrice(inputValue));
    });

    $(document).on('click', '.to-top-btn', function(event) {
        event.stopPropagation();

        $('html, main').animate({scrollTop: 0}, 500);
    });

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

    var account_action = $('.account-action');
    var action_container = account_action.find('.action-container');

    account_action.on('mouseenter', function() {
        action_container.slideDown();
    });

    account_action.on('mouseleave', function() {
        action_container.slideUp();
    });

    $('#logout').on('click', function() {
        showConfirm('Bạn có chắc chắn muốn đăng xuất?', function(result) {
            if (result) {
                logout();
            }
        });
    });
});

function refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token || refresh_token == '') {
        showNotification('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');

        setTimeout(function(){
            window.location.href = `/admin/login`
        }, 3000)
    }

    fetch('/api/vn/refresh-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authentication': refresh_token
        }
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            showNotification('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
            localStorage.removeItem('refresh_token');
            setTimeout(function() {
                window.location.href = '/admin/login'
            }, 3000);
            throw new Error('Network response was not ok');
        }
        return data;
    }))
    .then(result => {
        localStorage.setItem('access_token', result.access_token);
    })
    .catch(error => {

        console.error('There was a problem with the fetch operation:', error);
    });
}

function logout() {
    const access_token = localStorage.getItem('access_token');

    fetch('/api/vn/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "authentication": access_token
        }
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            removeLoading();
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('access_token');

            window.location.href = '/admin/login';
            throw new Error('Network response was not ok');
        }
        return data;
    }))
    .then(result => {
        removeLoading();
        
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');

        window.location.href = '/admin/login';
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}