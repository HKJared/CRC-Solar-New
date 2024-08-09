var editor;

renderLoading();
CKEDITOR.ClassicEditor
.create(document.getElementById("product_detail"), {
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
    document.title = "CRC Solar - Admin - Thêm sản phẩm";

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        //
    });

    // Xử lý submit form
    let filesArray = [];

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

    $('#images').on('change', function(e) {
        const newFiles = Array.from(e.target.files);
        filesArray = filesArray.concat(newFiles);
        updateImagePreview();
    });

    $(document).on('click', '.remove-image', function() {
        const index = $(this).data('index');
        filesArray = filesArray.filter((_, i) => i !== index); // Remove file from array by index
        updateImagePreview(); // Update preview

        // Reset input file element
        $('#images').val('');
        const dt = new DataTransfer();
        filesArray.forEach(file => dt.items.add(file));
        $('#images')[0].files = dt.files;
        $(this).closest('.image-preview-item').remove();
    });

    $('.add-product').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành động submit mặc định

        const product_name = $('#product_name').val();
        const product_code = $('#product_code').val();
        const product_category_id = $('#product_category').val();
        const quantity_cell = $('#quantity_cell').val();
        const power_output_range = $('#power_output_range').val();
        const max_system_vol = $('#max_system_vol').val();
        const max_efficiency = $('#max_efficiency').val();
        const dimension = $('#dimension').val();
        const product_detail = editor.getData();

        const technologies = [];
        $('input[name="technologies"]:checked').each(function() {
            technologies.push($(this).val());
        });

        const product = {
            product_name,
            product_code,
            product_category_id,
            quantity_cell,
            power_output_range,
            max_system_vol,
            max_efficiency,
            dimension,
            product_detail,
            technologies
        };

        console.log(product);

        const formData = new FormData();

        formData.append('product', JSON.stringify(product));
        filesArray.forEach(file => formData.append('images', file));

        const access_token = localStorage.getItem('access_token');

        renderLoading();
        // Gửi dữ liệu sản phẩm tới máy chủ
        fetch(`/api/${ language }/product`, {
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
                window.location.href = `/admin/products`;
            }, 3500);
        })
        .catch(error => {
            removeLoading();
            console.error('There was a problem with the fetch operation:', error);
        });
    });
});