var keyword = '';
var loading = false;
var page = 1;

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Thư viện ảnh";

    search();
});

$(document).ready(function() {
    $(document).on('click', '.add-document', function(event) {
        event.stopPropagation();

        const formHTML = `
        <form id="add-document-form" class="col">
            <h3>Thêm tài liệu</h3>
            <button type="button" class="x-btn"><i class="fa-solid fa-xmark"></i></button>
            <label for="document_name">Tên tài liệu</label>
            <input type="text" name="" id="document_name">
            <label for="src">Chọn tài liệu</label>
            <input type="file" id="src" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
            <button type="submit" class="submit-document">Submit</button>
        </form>
        `;

        $('.add-document-container').html(formHTML).css('display', 'flex');
    });

    $(document).on('submit', '#add-document-form', function(event) {
        event.preventDefault();

        showConfirm('Xác nhận thêm tài liệu', function(result) {
            if(result) {
                const inputFile = $('#src')[0].files[0];

                if (!inputFile) {
                    showNotification('Chưa có tài liệu nào được chọn.');
                    return
                }
                
                const document = {
                    document_name: $('#document_name').val()
                }

                let formData = new FormData();
                formData.append('data', JSON.stringify(document));
                formData.append('documents', inputFile);

                createDocument(formData);
            }
        });
    });

    $(document).on('click', '.x-btn', function(event) {
        event.stopPropagation();

        $('.add-document-container').empty().css('display', 'none');
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();

        const document_id = $(this).data('documentid');

        showConfirm('Xác nhận xóa tài liệu này', function(result) {
            if (result) {
                deleteDocument(document_id);
            }
        });
    })
});

function search() {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');
    loading = true;
    fetch(`/api/${language}/documents?keyword=${ keyword }&page=${page}`, {
        method: 'GET',
        headers: {
            "authentication": access_token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(data => {
        showDocuments(data.data)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showDocuments(documents) {
    if (page == 1) {
        $('.document-items').empty();
    }

    for (let i = 0; i < documents.length; i++) {
        let updateInfoHTML = ``;
        if (documents[i].updated_by) {
            updateInfoHTML = `<span class="updated-by">Cập nhật gần nhất bởi: <strong>${documents[i].updated_by_name}</strong> vào lúc "${formatDateTime(documents[i].updated_at)}"</span>`
        }

        let document_item = `
        <li class="document-item row" data-documentid="${documents[i].document_id}">
            <div class="info col">
                <h3 class="document-name">${documents[i].document_name}</h3>
                <span class="created-by"><strong>${documents[i].admin_name}</strong>, ${formatDateTime(documents[i].created_at)}</span>
                ${ updateInfoHTML }
            </div>
            <div class="action">
                <a class="view-btn row center" href="${documents[i].src}" target="_blank"><i class="fa-solid fa-eye"></i> View</a>
                <button class="delete-btn row center" type="button" data-documentid="${documents[i].document_id}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
        </li>
        `;

        $('.document-items').append(document_item)
    }
}

function createDocument(formData){
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${ language }/document`, {
        method: 'POST',
        headers: {
            'authentication': access_token
        },
        body: formData
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

        const newDocument = result.newDocument;

        let documentHTML = `
        <li class="document-item row" style="display: none;" data-documentid="${newDocument.document_id}">
            <div class="info col">
                <h3 class="document-name">${newDocument.document_name}</h3>
                <span class="created-by"><strong>${newDocument.admin_name}</strong>, ${formatDateTime(newDocument.created_at)}</span>
            </div>
            <div class="action">
                <a class="view-btn row center" href="${newDocument.src}" target="_blank"><i class="fa-solid fa-eye"></i> View</a>
                <button class="delete-btn row center" type="button" data-documentid="${newDocument.document_id}"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
        </li>
        `

        let $documentHTML = $(documentHTML);
        $('.document-items').prepend($documentHTML);
        $documentHTML.slideDown();

        $('.add-document-container').html('').css('display', 'none');
    }) 
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function deleteDocument(document_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${ language }/document`, {
        method: 'DELETE',
        headers: {
            'authentication': access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ document_id: document_id })
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

        var $documentItem = $(`li[data-documentid='${document_id}']`);
        $documentItem.slideUp();

        setTimeout(function() {
            $documentItem.remove();
        }, 2000);
    }) 
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}