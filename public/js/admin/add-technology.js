var editor;

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
});

$(document).ready(function() {
    document.title = "Admin - Thêm công nghệ mới";
});

$(document).ready(function() {
    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        //
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
                const imagePreviewContainer = $('.images-preview');
                imagePreviewContainer.empty(); 
                const imgElement = `
                    <div class="image-preview-item">
                        <img src="${e.target.result}" alt="technology Image">
                    </div>
                `;
                imagePreviewContainer.append(imgElement);
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('submit', 'form.add-technology', function (event) {
        event.preventDefault();
        
        var $form = $(this);

        showConfirm('Xác nhận lưu công nghệ mới.', function(result) {
            if(result) {
                // Collecting form data for new_data_technology
                var technology = {
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

            formData.append('technology', JSON.stringify(technology));

            createTechnology(formData);
            }
        })
    });
});

function createTechnology(formData) {
    const access_token = localStorage.getItem('access_token');
    const language = $('header').data('language');
    
    renderLoading();
    // Gửi dữ liệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/technology`, {
        method: 'POST',
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

        setTimeout(() => {
            window.location.href = `/admin/product-technologies`;
        }, 2000);
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}
