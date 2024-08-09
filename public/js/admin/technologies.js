var keyword = '';
var loading = false;
var editor;

var filesArray = [];
var existingImages = [];
var imagesToDelete = [];

CKEDITOR.ClassicEditor
.create(document.getElementById("technology_detail"), {
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
    document.title = "Admin - Danh mục công nghệ";
    search();
});

$(document).ready(function() {
    $(document).on('click', '.edit-btn', function(event) {
        event.stopPropagation();
        
        var technology_id = $(this).data('technologyid');

        showEditTechnology(technology_id);
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();

        const technology_id = $(this).data('technologyid');
        
        showConfirm('Xác nhận xóa công nghệ này', function(result) {
            if(result) {
                deleteTechnology(technology_id);
            }
        });
    });

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $('.search-text').val();

        search();
    });

    $(document).on('change', '#images', function (e) {
        const input = e.target;
        const files = input.files;
        const validImageTypes = ['image/jpeg', 'image/png'];
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Kiểm tra nếu file không phải là ảnh
            if (!validImageTypes.includes(file.type)) {
                // Xóa file khỏi input
                input.value = '';
                showNotification('Vui lòng chọn file có định xạng JPG hoặc PNG');
                return;
            }
    
            // Nếu đúng là ảnh, tạo src và thay đổi src của ảnh trong .image-preview-item img
            const reader = new FileReader();
            reader.onload = function (e) {
                $('.image-preview-item img').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('click', '.remove-image', function (event) {
        event.stopPropagation();

        const image_id = $(this).data('imageid');
        const $imagePreviewItem = $(this).closest('.image-preview-item');

        if (image_id) {
            showConfirm('Đây là ảnh cũ của sản phẩm, bạn có chắc chắn muốn xóa không?', function(result) {
                if (result) {
                    imagesToDelete.push({image_id: image_id});
                    $imagePreviewItem.remove();
                }
            });
        } else {
            const index = $(this).data('index');
            filesArray = filesArray.filter((_, i) => i !== index); // Remove file from array by index
            updateImagePreview(); // Update preview

            // Reset input file element
            $('#images').val('');
            const dt = new DataTransfer();
            filesArray.forEach(file => dt.items.add(file));
            $('#images')[0].files = dt.files;
            $(this).closest('.image-preview-item').remove();
        }
    });

    $(document).on('click', 'form.edit-technology .x-btn', function(event) {
        event.stopPropagation();

        $('.edit-technology-container').slideUp();
    });

    $(document).on('submit', 'form.edit-technology', function (event) {
        event.preventDefault();
        
        var $form = $(this);

        showConfirm('Xác nhận cập nhật nội dung chỉnh sửa', function(result) {
            if(result) {
                // Collecting form data for new_data_technology
                var newDataTechnology = {
                    technology_id: $form.data('technologyid'),
                    technology_name: $('#technology_name').val(),
                    description: $('#description').val(),
                    image: $('.image-preview-item img').attr('src'),
                    detail: editor.getData()
                };
    
            var formData = new FormData();

            var imageFile = $('#images')[0].files[0];
            if (imageFile) {
                formData.append('images', imageFile);
            }

            formData.append('newDataTechnology', JSON.stringify(newDataTechnology));

            updateTechnology(formData, newDataTechnology);
            }
        })
    });
});

function showEditTechnology(technology_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/technology?technology_id=${technology_id}`, {
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

        if (!result) {
            showNotification('technology not found');
            return;
        }

        const technology = result.data;

        // Populate form fields
        $('#technology_name').val(technology.technology_name || '');
        $('#description').text(technology.description || '');
        $('form.edit-technology').attr('data-technologyid', technology.technology_id);
        editor.setData(technology.detail);

        const imagePreviewContainer = $('.images-preview');
        imagePreviewContainer.empty(); 
        const imgElement = `
            <div class="image-preview-item">
                <img src="${technology.image}" alt="technology Image">
            </div>
        `;
        imagePreviewContainer.append(imgElement);

        let extraInfoHTML = `<span>Tạo bởi <strong>${technology.admin_name}</strong> lúc <strong>${formatDateTime(technology.created_at)}</strong></span>`;
        if (technology.updated_by) {
            extraInfoHTML += `<span>Chỉnh sửa bởi <strong>${technology.updated_by_name}</strong> lúc <strong>${formatDateTime(technology.updated_at)}</strong></span>`;
        }
        $('.extra-info').html(extraInfoHTML);

        $('.edit-technology-container').slideDown();

        $('main').animate({
            scrollTop: $('.edit-technology-container').offset().top
        }, 1000);

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
    fetch(`/api/${ language }/technologies?keyword=${ keyword }`, {
        method: 'GET',
        headers: {
            "authorization": access_token,
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
        showTechnologies(result.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showTechnologies(data) {
    $('.technology-items').empty();
    if (!data.length) {
        const noResultHTML = `<div class="no-result">
            <h2>Không sản phẩm nào phù hợp</h2>
            <span>Vui lòng thử tìm kiếm khác</span> 
        </div>`;

        $('.technology-items').append(noResultHTML);

        return
    }
 
    for (let i = 0; i < data.length; i++) {
        let technologyHTML = `
        <li class="col" data-technologyid="${data[i].technology_id}">
            <div class="technology-item center col">
                <div class="image">
                    <img src="${data[i].image}" alt="">
                </div>
                <div class="name full-width" title="${data[i].technology_name}">
                    <span>${data[i].technology_name}</span>
                </div>
                <div class="action">
                    <button class="edit-btn row center" type="button" data-technologyid="${data[i].technology_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="delete-btn row center" type="button" data-technologyid="${data[i].technology_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>
        </li>`;

        $('.technology-items').append(technologyHTML);
    }

    loading = false;
}

function updateImagePreview() {
    const previewContainer = $('#image-preview');

    filesArray.forEach((file, index) => {
        // Check if the image preview already exists by checking the index in the container
        const existingItem = previewContainer.find(`.image-preview-item[data-index="${index}"]`);
        
        if (existingItem.length === 0) { // If no existing preview item found
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = $('<img>').attr('src', e.target.result);
                const removeBtn = $('<button>').addClass('remove-image').text('X').data('index', index);
                const imagePreviewItem = $('<div>').addClass('image-preview-item').attr('data-index', index).append(img).append(removeBtn);
                previewContainer.append(imagePreviewItem);
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateTechnology(formData, newDataTechnology) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');
    
    renderLoading();
    // Gửi dữ liệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/technology`, {
        method: 'PUT',
        headers: {
            "authentication": access_token
        },
        body: formData
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

        var $technologyItem = $(`li[data-technologyid='${newDataTechnology.technology_id}']`);

        // Cập nhật hình ảnh
        $technologyItem.find('.image img').attr('src', newDataTechnology.image);

        // Cập nhật thông tin sản phẩm
        $technologyItem.find('.name span').text(newDataTechnology.technology_name);
        $technologyItem.addClass('highlight-green');

        var newPosition = $technologyItem.offset().top - 100;

        $('html, body').animate({ scrollTop: newPosition }, 1000, function() {
            setTimeout(function() {
                $technologyItem.removeClass('highlight-green');
            }, 2000); 
        });

        $('.edit-technology-container').slideUp();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function deleteTechnology(technology_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/technology`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ technology_id: technology_id })
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

        var $technologyItem = $(`li[data-technologyid='${technology_id}']`);

        $technologyItem.remove();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}