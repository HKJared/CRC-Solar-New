$(document).ready(function () {
    $(document).on('input change', 'input, textarea, select', function() {
        $(this).removeClass('warning-border'); 
    });

    $(document).on('click', '.show-detail', function() {
        const $recruitmentItem = $(this).closest('.recruitment');
        $recruitmentItem.find('.detail').slideDown();
    });

    $(document).on('click', '.btn-hide', function() {
        $(this).closest('.detail').slideUp();
    });

    $(document).on('click', '.btn-apply', function() {
        const recruitment_id = $(this).data('recruitmentid');
        const position = $(this).closest('.recruitment').find('.title-recruitment').text();
        $('#apply-form').data('recruitmentid', recruitment_id);
        $('#apply-form').find('h2').html(`Ứng tuyển vị trí: ${ position }`);
        $('.apply-container').show();
    });

    $(document).on('click', '.x-btn', function() {
        $('#apply-form input').val('');
        $('.apply-container').hide();
    });

    $(document).on('submit', '#apply-form', function(event) {
        event.preventDefault();

        const recruitment_application = {
            recruitment_id: $(this).data('recruitmentid'),
            fullname: $('#fullname').val(),
            email: $('#email').val(),
            phone_number: $('#phone_number').val(),
            cv_link: $('#cv_link').val()
        };

        let hasError = false; // Biến kiểm tra lỗi

        // Kiểm tra các trường và thêm class .warning-border nếu trống
        for (let key in recruitment_application) {
            if (key !== 'detail' && !recruitment_application[key]) {
                $(`#${key}`).addClass('warning-border');
                hasError = true;
            }
        }

        // Nếu có lỗi, hiển thị thông báo và ngăn submit
        if (hasError) {
            showNotification('Vui lòng điền đầy đủ thông tin.');
            return; // Ngăn không cho form submit nếu có lỗi
        }

        createRecruitmentApplication(recruitment_application);
    })
});

function createRecruitmentApplication(recruitment_application) {
    const language = $('header').data('language');

    renderLoading();
    // Gửi dữ liệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/recruitment-application`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ recruitment_application: recruitment_application })
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                removeLoading();
                showNotification(data.message);
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(data => {
        removeLoading();
        showNotification(data.message);

        $('.apply-container').hide();
        $('#apply-form input').val('');
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}