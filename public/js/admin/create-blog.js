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
    $(document).on('change', '#main_image', function() {
        const file = this.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $('#file-error').text('');
        
        if (file) {
            // Kiểm tra định dạng file
            if (!validImageTypes.includes(file.type)) {
                showNotification('Định dạng file không hợp lệ. Vui lòng chọn file ảnh (jpg, png, gif).');
                $(this).val(''); // Reset input file
                return;
            }
            
            // Hiển thị ảnh xem trước
            const reader = new FileReader();
            reader.onload = function(e) {
                $('.preview').html(`<img src="${e.target.result}" alt="Ảnh xem trước" class="full-width full-height">`);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#create-blog-form').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn submit form mặc định

        // Kiểm tra các đầu vào
        const title = $('#title').val().trim();
        const detail = editor.getData();
        const category_id = $('#category_id').val();
        const tag = $('#tag').val().trim();
        const seo_title = $('#seo_title').val().trim();
        const is_outstanding = $('#is_outstanding').is(':checked');
        const main_image = $('#main_image')[0].files[0];

        // Kiểm tra tiêu đề
        if (title === "") {
            showNotification("Tiêu đề không được để trống");
            $('#title').addClass('warning-border');
            $('main').animate({
                scrollTop: $('#title').offset().top - 20
            }, 500);
            return;
        }

        if (!main_image) {
            showNotification('Hãy thêm ảnh chính cho bài viết.');
            return
        }

        const data = {
            title: title,
            detail: detail,
            category_id: category_id,
            tag: tag,
            seo_title: seo_title,
            is_outstanding: is_outstanding,
            category_id: category_id
        }
        
        // Tạo form data để gửi file
        let formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('images', main_image);

        createBlog(formData)
    });
});

function createBlog(formData){
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${ language }/blog`, {
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
        setTimeout(function() {
            window.location.href = `${ language == 'vn' ? '' : '/' + language }/admin/blogs`;
        }, 2000)
    }) 
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}