var editor;
var keyword = '';
var page = 1;

renderLoading();
CKEDITOR.ClassicEditor
.create(document.getElementById("detail"), {
    toolbar: {
        items: [
            'exportPDF','exportWord', '|',
            'findAndReplace', 'selectAll', '|',
            'heading', '|',
            'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
            'bulletedList', 'numberedList', 'todoList', '|',
            'outdent', 'indent', '|',
            'undo', 'redo',
            '-',
            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
            'alignment', '|',
            'link', 'uploadImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
            'specialCharacters', 'horizontalLine', 'pageBreak', '|',
            'textPartLanguage', '|',
            'sourceEditing'
        ],
        shouldNotGroupWhenFull: true
    },
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true
        }
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
        ]
    },
    placeholder: '',
    fontFamily: {
        options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif'
        ],
        supportAllValues: true
    },
    fontSize: {
        options: [ 10, 12, 14, 'default', 18, 20, 22 ],
        supportAllValues: true
    },
    htmlSupport: {
        allow: [
            {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true
            }
        ]
    },
    htmlEmbed: {
        showPreviews: true
    },
    link: {
        decorators: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            }
        }
    },
    mention: {
        feeds: [
            {
                marker: '@',
                feed: [
                    '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                    '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                    '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                    '@sugar', '@sweet', '@topping', '@wafer'
                ],
                minimumCharacters: 1
            }
        ]
    },
    removePlugins: [
        'AIAssistant',
        'CKBox',
        'CKFinder',
        'EasyImage',
        'MultiLevelList',
        'RealTimeCollaborativeComments',
        'RealTimeCollaborativeTrackChanges',
        'RealTimeCollaborativeRevisionHistory',
        'PresenceList',
        'Comments',
        'TrackChanges',
        'TrackChangesData',
        'RevisionHistory',
        'Pagination',
        'WProofreader',
        'MathType',
        'SlashCommand',
        'Template',
        'DocumentOutline',
        'FormatPainter',
        'TableOfContents',
        'PasteFromOfficeEnhanced',
        'CaseChange'
    ]
})
.then( newEditor => {
    removeLoading();
    editor = newEditor;
} )
.catch( error => {
    removeLoading();
    console.error( error );
} );

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Tạo bài tuyển dụng";

    search();

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $(this).find('input').val();
        page = 1;

        search();
    });

    $('.edit-recruitment').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành động submit mặc định

        const recruitment = {
            position: $('#position').val(),
            department: $('#department').val(),
            location: $('#location').val(),
            quantity: $('#quantity').val(),
            salary_range: $('#salary_range').val(),
            experience_required: $('#experience_required').val(),
            application_deadline: $('#application_deadline').val(),
            detail: editor.getData(),
        };

        let hasError = false; // Biến kiểm tra lỗi

        // Kiểm tra các trường và thêm class .warning-border nếu trống
        for (let key in recruitment) {
            if (key !== 'detail' && !recruitment[key]) {
                $(`#${key}`).addClass('warning-border');
                hasError = true;
            }
        }

        // Nếu có lỗi, hiển thị thông báo và ngăn submit
        if (hasError) {
            showNotification('Vui lòng điền đầy đủ thông tin.');
            return; // Ngăn không cho form submit nếu có lỗi
        }

        editRecruitment(recruitment);
    });

    $(document).on('click', '.edit-btn', function(event) {
        event.stopPropagation();
        
        var recruitment_id = $(this).data('recruitmentid');

        showEditRecruitment(recruitment_id);
    });
});

function showEditRecruitment(recruitment_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/recruitment?recruitment_id=${recruitment_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        }
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

        const recruitment = result.data;

        // Populate form fields
        $('#position').val(recruitment.position || '');
        $('#department').val(recruitment.department || '');
        $('#location').val(recruitment.location || '');
        $('#quantity').val(recruitment.quantity || '');
        $('#salary_range').val(recruitment.salary_range || '');
        $('#experience_required').val(recruitment.experience_required || '');
        var date = new Date(recruitment.application_deadline);
        var formattedDate = date.toISOString().split('T')[0];
        $('#application_deadline').val(formattedDate || '');
        $('form.edit-recruitment').attr('data-recruitmentid', recruitment.recruitment_id);
        editor.setData(recruitment.detail);

        let extraInfoHTML = `<span>Tạo bởi <strong>${recruitment.admin_name}</strong> lúc <strong>${formatDateTime(recruitment.created_at)}</strong></span>`;
        if (recruitment.updated_by) {
            extraInfoHTML += `<span>Chỉnh sửa gần nhất bởi <strong>${recruitment.updated_by_name}</strong> lúc <strong>${formatDateTime(recruitment.updated_at)}</strong></span>`;
        }
        $('.extra-info').html(extraInfoHTML);

        $('.edit-recruitment-container').slideDown();

        $('main').animate({
            scrollTop: $('.edit-recruitment-container').offset().top
        }, 1000);

    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function editRecruitment(recruitment) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    // Gửi dữ liệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/recruitment`, {
        method: 'POST',
        headers: {
            "authentication": access_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ recruitment: recruitment })
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
        setTimeout(() => {
            window.location.href = `/admin/recruitments`;
        }, 2000);
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
    fetch(`/api/${language}/recruitments?keyword=${ keyword }&page=${page}`, {
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
        showRecruitments(data.data)
    })
    .catch(error => {
        removeLoading
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showRecruitments(recruitments) {
    if (page == 1) {
        $('.recruitment-items').empty();
    }

    for (let i = 0; i < recruitments.length; i++) {
        let recruitment_item = `
        <li class="recruitment-item row" data-recruitmentid="${recruitments[i].recruitment_id}">
            <div class="info col">
                <h3 class="position">${recruitments[i].position}</h3>
                <span class="department"><strong>Bộ phận:</strong> ${recruitments[i].department}</span>
                <span class="application-deadline"><strong>Hạn ứng tuyển:</strong>  ${formatDate(recruitments[i].application_deadline)}</span>
            </div>
            <div class="action">
                <button class="edit-btn row center" type="button" data-recruitmentid="${recruitments[i].recruitment_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="delete-btn row center" type="button" data-recruitmentid="${recruitments[i].recruitment_id}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
        </li>
        `;

        $('.recruitment-items').append(recruitment_item)
    }
}

function deleteRecruitment(recruitment_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${ language }/recruitment`, {
        method: 'DELETE',
        headers: {
            'authentication': access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recruitment_id: recruitment_id })
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
        showNotification(result.message);
        removeLoading();

        var $recruitmentItem = $(`li[data-recruitmentid='${recruitment_id}']`);
        $recruitmentItem.slideUp();

        setTimeout(function() {
            $recruitmentItem.remove();
        }, 2000);
    }) 
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}