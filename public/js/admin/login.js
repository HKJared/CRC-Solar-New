$(document).ready(function() {
    $(document).on('input', 'input', function() {
        $(this).removeClass('warning-border');
    });

    $(document).on('click', '.toggle-eyes', function() {
        let input = $(this).siblings('input');
        let icon = $(this).find('i');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    $(document).on('submit', '#loginForm', function(event) {
        event.preventDefault();
        
        let account = $('#account').val();
        let password = $('#password').val();
        let isValid = true;
    
        if (!account || account == "") {
            showNotification('Vui lòng nhập tài khoản.');
            $('#account').addClass('warning-border');
            isValid = false;
        }
    
        if (!password || password == "") {
            showNotification('Vui lòng nhập mật khẩu');
            $('#password').addClass('warning-border');
            isValid = false;
        }
    
        if (isValid) {
            login({account: account, password: password});
        }
    });
});

function login(data) {
    renderLoading();
    fetch(`/api/vn/login`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({ account: data })
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            removeLoading();
            showNotification(data.message);
            throw new Error('Network response was not ok');
        }
        return data;
    }))
    .then(result => {
        removeLoading();
        
        localStorage.setItem('refresh_token', result.refresh_token);
        localStorage.setItem('access_token', result.access_token);

        window.location.href = '/admin'
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}