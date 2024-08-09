var keyword = '';

$(document).ready(function() {
    document.title = "Admin - Danh sách quản trị viên";
    search()
});

$(document).ready(function() {
    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $('.search-text').val();

        search();
    });

    $(document).on('click', '.toggle-status label', function() {
        const label = $(this);
        const checkbox = label.prev('input[type="checkbox"]');
        const admin_id = checkbox.data('admin-id');
        const currentStatus = checkbox.is(':checked');
        const access_token = localStorage.getItem('access_token');
        
        // Chuyển đổi trạng thái checkbox
        checkbox.prop('checked', !currentStatus);

        fetch('/api/vn/toggle-admin-status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authentication': access_token
            },
            body: JSON.stringify({ admin_id: admin_id })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    showNotification(data.message);
                    throw new Error('Network response was not ok');
                });
            }
            return response.json(); // Phân tích dữ liệu JSON khi phản hồi thành công
        })
        .then(result => {
            const row = label.closest('tr');
            const statusCell = row.find('.status');
            const newStatus = !currentStatus;
            
            if (newStatus) {
                statusCell.removeClass('is-disable').addClass('is-active').find('span').text('Active');
            } else {
                statusCell.removeClass('is-active').addClass('is-disable').find('span').text('Disable');
            }

            showNotification(result.message)
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            // Nếu có lỗi, khôi phục trạng thái checkbox về trạng thái ban đầu
            checkbox.prop('checked', currentStatus);
        })
        .finally(() => {
            // Xóa lớp loading sau khi hoàn tất
            label.removeClass('loading');
        });
    });
});

function search() {
    loading = true;
    renderLoading();
    fetch(`/api/${ language }/data-admins?keyword=${ keyword }`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
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
        showDataAdmins(result.data);
        loading = false;
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showDataAdmins(data) {
    for (let i = 0; i < data.length; i++) {
        let isChecked = data[i].status == 1 ? 'checked' : '';
        let dataAdminHTML = `
        <tr class="row">
            <td class="name row">
                <div class="image center"><i class="fa-solid fa-user-tie"></i></div>
                <div class="admin-account-container col">
                    <span class="admin-name">${ data[i].fullname }</span>
                    <span class="admin-account">${ data[i].account }</span>
                </div>
            </td>
            <td class="info">
                <div class="admin-info-container col full-height">
                    <span class="email">${ data[i].email }</span>
                    <span class="phone-number">${ data[i].phone_number }</span>
                </div>
            </td>
            <td class="status center ${ data[i].status == 1 ? 'is-active' : 'is-disable' }"><span>${ data[i].status == 1 ? 'Active' : 'Disable' }</span></td>
            <td class="role center"><span>Data Admin</span></td>
            <td class="action center">
                <div class="toggle-status center full-width">
                    <input type="checkbox" id="switch${ i }" ${isChecked} data-admin-id="${ data[i].admin_id }"/>
                    <label for="">Toggle</label>
                </div>
            </td>
        </tr>`;

        $('.data-admin-items').append(dataAdminHTML);
    }
}