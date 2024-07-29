$(document).ready(function() {
    $(document).on('click', '.toggle-eyes', function() {
        let input = $(this).siblings('input');
        let icon = $(this).find('i');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            $('#confirm_password').attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            $('#confirm_password').attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    $('.create-data-admin').on('submit', function(event) {
        event.preventDefault();


        // Get form data
        const fullname = $('#fullname').val();
        const phone_number = $('#phone_number').val();
        const email = $('#email').val();
        const account = $('#account').val();
        const password = $('#password').val();
        const confirm_password = $('#confirm_password').val();

        let is_valid = true;

        // Basic validation
        $('.create-data-admin input').each(function() {
            if ($(this).val() === '') {
                $(this).addClass('warning-border');
                isValid = false;
            }
        });

        if (!is_valid) {
            showNotification('Vui lòng điều đầy đủ thông tin.');
            return
        }

        if (account.lenght < 6 || account.includes(' ')) {
            showNotification('Tài khoản cần tối thiểu 6 ký tự và không được có khoảng trống.');
            return
        }

        if (password.lenght < 6 || password.includes(' ')) {
            showNotification('Mật khẩu cần tối thiểu 6 ký tự và không được có khoảng trống.');
            return
        }

        if (password !== confirm_password) {
            $('#account').addClass('warning-border');
            $('#confirm_account').addClass('warning-border');
            showNotification('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        // Create account data
        const accountData = {
            fullname,
            phone_number,
            email,
            account,
            password
        };

        createAccount(accountData);
    });
});

function createAccount (data) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch('/api/vn/create-data-admin', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "authentication": access_token
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
        showNotification(result.message);
        
        setTimeout(function() {
            window.location.href = `${ language == 'vn' ? '' : ('/' + language) }/admin/data-admins`
        })
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}