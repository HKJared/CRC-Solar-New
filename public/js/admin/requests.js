var keyword = '';
var page = 1;
var loading = false;

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Danh sách yêu cầu liên hệ";

    search();

    $(document).on('click', '.row-table', function() {
        var subRequest = $(this).find('.sub-request');
        var icon = $(this).find('i');
        
        if (subRequest.is(':visible')) {
            subRequest.slideUp();
            icon.removeClass('rotate-180');
        } else {
            subRequest.slideDown();
            icon.addClass('rotate-180');
        }
    });

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $('.search-text').val();
        page = 1;
        search();
    });

    $(document).on('click', 'button.complete', function(event) {
        event.stopPropagation();

        const request_id = $(this).data('requestid');

        showConfirm('Xác nhận đã xử lí yêu cầu liên hệ.', function(result) {
            if (result) {
                updateRequest(request_id);
            }
        });
    });
});

function search() {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');
    loading = true;
    renderLoading();
    fetch(`/api/${ language }/requests?keyword=${ keyword }&page=${ page }`, {
        method: 'GET',
        headers: {
            "authorization": access_token,
            'Content-Type': 'appdivcation/json'
        }
    })
    .then(response => {
        return response.json().then(result => {
            if (!response.ok) {
                removeLoading();
                showNotification(data.message);
                throw new Error('Network response was not ok');
            }
            return result;
        });
    })
    .then(result => {
        showRequests(result.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showRequests(data) {
    if (page == 1) {
        $('.requests-container ul').empty();
    }

    if (!data.length) {
        if (page == 1) {
            const noResultHTML = `<div class="no-result">
                <h2>Không có bài viết nào phù hợp</h2>
                <span>Vui lòng thử tìm kiếm khác</span> 
            </div>`;

            $('.requests-container ul').append(noResultHTML);
        }

        return
    }
 
    for (let i = 0; i < data.length; i++) {
        let requestHTML = `
            <li class="row-table request-item" data-requestid="${data[i].request_id}" style="display: none">
                <div class="request row">
                    <i class="fa-solid fa-caret-down"></i>
                    <div class="id center">
                        <span>${data[i].request_id}  </span>
                    </div>
                    <div class="fullname center">
                        <span><strong>${data[i].fullname}</strong></span>
                    </div>
                    <div class="message center">
                        <span>${data[i].message}</span>
                    </div>
                    <div class="status center ${data[i].status ? 'green' : 'yellow'}">
                        <span>${data[i].status ? 'Đã xử lí' : 'Đang xử lí'}</span>
                    </div>
                </div>
                <ul class="sub-request">
                    <li><strong>Email:</strong> ${data[i].email}</li>
                    <li><strong>Số điện thoại:</strong> ${data[i].phone_number}</li>
                    <li><strong>Nội dung:</strong> ${data[i].message}</li>
                    ${data[i].status ? '' : '<li class="change-status"><button type="button" class="complete" data-requestid="' + data[i].request_id + '">Xác nhận đã xử lí</button></li>'}
                </ul>
            </li>
        `;

        let $requestHTML = $(requestHTML);
        $('.request-items').append($requestHTML);
        $requestHTML.slideDown();
    }

    loading = false;
}

function updateRequest(request_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/request`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ request_id: request_id })
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

        var $requestItem = $(`li[data-requestid='${request_id}']`);

        $requestItem.find('.status').removeClass('yellow').addClass('green').find('span').html('Đã xử lí');

        $requestItem.find('.change-status').remove();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}