var editor;
var keyword = '';
var page = 1;

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Danh sách đơn ứng tuyển";

    search();

    $(document).on('click', function(event) {
        const formEdit = $('#edit-note');
    
        // Kiểm tra nếu form tồn tại và click xảy ra bên ngoài form
        if (formEdit.length && !formEdit.is(event.target) && formEdit.has(event.target).length === 0) {
            formEdit.submit();
        }
    });

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $(this).find('input').val();
        page = 1;

        search();
    });

    $(document).on('click', '.edit-btn', function(event) {
        event.stopPropagation();

        const formEdit =  $('#edit-note');
        
        var recruitment_application_id = $(this).data('recruitmentapplicationid');

        showEditRecruitmentApplication(recruitment_application_id);
    });

    $(document).on('submit', '#edit-note', function(event) {
        event.preventDefault();

        let status = $(this).closest('li').find('.status-content').text() == 'Đang xử lí' ? 0 : 1;

        let newDataRecruitmentApplication = {
            recruitment_application_id: $(this).data('recruitmentapplicationid'),
            status: status,
            note: $(this).find('textarea').val()
        }

        editRecruitmentApplication(newDataRecruitmentApplication);
    });

    $(document).on('click', '.complete', function(event) {
        event.stopPropagation();

        const recruitment_application = {
            recruitment_application_id: $(this).data('recruitmentapplicationid'),
            status: 1,
            note: $(this).closest('li').find('.note-content').text()
        }

        showConfirm('Xác nhận đã xử lí đơn ứng tuyền này', function(result) {
            if (result) {
                editRecruitmentApplication(recruitment_application);
            }
        })
    });
});

function showEditRecruitmentApplication(recruitment_application_id) {
    var $recruitmentApplicationItem = $(`li[data-recruitmentapplicationid='${recruitment_application_id}']`);

    let note = $recruitmentApplicationItem.find('.note-content').text();

    let formEdit = `
    <form action="" class="" id="edit-note" data-recruitmentapplicationid="${recruitment_application_id}">
        <textarea name="" id="note"></textarea>
    </form>
    `;

    let $editForm = $recruitmentApplicationItem.find('.note').append(formEdit);
    $editForm.find('textarea').text(note);
    $recruitmentApplicationItem.find('.note-content').hide();
}

function editRecruitmentApplication(newDataRecruitmentApplication) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    // Gửi dữ liệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/recruitment-application`, {
        method: 'PUT',
        headers: {
            "authentication": access_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ newDataRecruitmentApplication: newDataRecruitmentApplication })
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

        var $recruitmentApplicationItem = $(`li[data-recruitmentapplicationid='${newDataRecruitmentApplication.recruitment_application_id}']`);

        $recruitmentApplicationItem.find('.note-content').html(newDataRecruitmentApplication.note).show();
        $('#edit-note').remove();

        if (newDataRecruitmentApplication.status) {
            $recruitmentApplicationItem.find('.status').html(`<span class="status-content center green">Đã xử lí</span>`)
        }
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function search() {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');
    loading = true;
    renderLoading();
    fetch(`/api/${language}/recruitment-applications?keyword=${ keyword }&page=${page}`, {
        method: 'GET',
        headers: {
            "authentication": access_token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                removeLoading();
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(data => {
        removeLoading();
        showRecruitmentApplications(data.data)
    })
    .catch(error => {
        removeLoading
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showRecruitmentApplications(recruitment_applications) {
    if (page == 1) {
        $('.recruitment-items').empty();
    }

    for (let i = 0; i < recruitment_applications.length; i++) {
        let recruitment_application_item = `
        <li class="recruitment-item row" data-recruitmentapplicationid="${recruitment_applications[i].recruitment_application_id}">
            <div class="info col">
                <h3 class="fullname">${recruitment_applications[i].fullname}</h3>
                <span class="position"><strong>Vị trí ứng tuyển:</strong> ${recruitment_applications[i].position}</span>
                <span class="created-at"><strong>Ngày nộp:</strong>  ${formatDateTime(recruitment_applications[i].created_at)}</span>
                <span class="cv-link"><strong>CV:</strong>  <a href="${recruitment_applications[i].cv_link}">${recruitment_applications[i].cv_link}</a></span>
            </div>
            <div class="note col full-height">
                <span class="note-title row center">Note <button class="edit-btn row center" type="button" data-recruitmentapplicationid="${recruitment_applications[i].recruitment_application_id}"><i class="fa-solid fa-pen"></i></button></span>
                <p class="note-content">${recruitment_applications[i].note}</p>
            </div>
            <div class="status col full-height">
                <span class="status-content center ${recruitment_applications[i].status ? 'green' : 'yellow' }">${recruitment_applications[i].status ? 'Đã xử lí' : 'Đang xử lí' }</span>
                ${recruitment_applications[i].status ? '' : '<button type="button" class="complete" data-recruitmentapplicationid="' + recruitment_applications[i].recruitment_application_id + '">Xác nhận đã xử lí</button>' }
            </div>
        </li>
        `;

        $('.recruitment-application-items').append(recruitment_application_item)
    }
}