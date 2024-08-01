var keyword = '';
var loading = false;
const language = $('header').data('language');
var editor;

var filesArray = [];
var existingImages = [];
var imagesToDelete = [];

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
    document.title = "Admin - Danh sách sản phẩm";
    search();
});

$(document).ready(function() {
    $(document).on('click', '.edit-btn', function(event) {
        event.stopPropagation();
        
        var product_id = $(this).data('productid');

        showEditProduct(product_id);
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();

        const product_id = $(this).data('productid');
        
        showConfirm('Xác nhận xóa sản phẩm này', function(result) {
            if(result) {
                deleteProduct(product_id);
            }
        });
    });

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $('.search-text').val();

        search();
    });

    $(document).on('change', '#images', function (e) {
        const newFiles = Array.from(e.target.files);
        filesArray = filesArray.concat(newFiles);
        updateImagePreview();
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

    $(document).on('click', 'form.edit-product .x-btn', function(event) {
        event.stopPropagation();

        $('.edit-product-container').slideUp();
    });

    $(document).on('submit', 'form.edit-product', function (event) {
        event.preventDefault();
        
        var $form = $(this);

        showConfirm('Xác nhận cập nhật sản phẩm.', function(result) {
            if(result) {
                // Collecting form data for new_data_product
                var newDataProduct = {
                    product_id: $form.data('productid'),
                    product_name: $('#product_name').val(),
                    product_code: $('#product_code').val(),
                    product_category_id: $('#product_category').val(),
                    quantity_cell: $('#quantity_cell').val(),
                    power_output_range: $('#power_output_range').val(),
                    max_system_vol: $('#max_system_vol').val(),
                    max_efficiency: $('#max_efficiency').val(),
                    dimension: $('#dimension').val(),
                    detail: editor.getData()
                };
        
                // Technologies processing
                var technologiesToDelete = [];
                var technologiesToUpdate = [];
        
                $('div#technologies input[type=checkbox]').each(function () {
                    var $checkbox = $(this);
                    var technologyId = $checkbox.val();
                    var isChecked = $checkbox.is(':checked');
                    var isHaving = $checkbox.data('ishaving');
        
                    if (isHaving == "1" && !isChecked) {
                        technologiesToDelete.push({ technology_id: technologyId });
                    }
                    if (isHaving == undefined && isChecked) {
                        technologiesToUpdate.push({ technology_id: technologyId });
                    }
                });
        
                var firstImageSrc = $('#image-preview .image-preview-item img').first().attr('src');
        
                updateProduct(newDataProduct, technologiesToDelete, technologiesToUpdate, firstImageSrc);
            }
        })
    });
});

function showEditProduct(product_id) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/product?product_id=${product_id}`, {
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
            showNotification('Product not found');
            return;
        }

        const product = result.data;

        // Populate form fields
        $('#product_name').val(product.product_name || '');
        $('#product_code').val(product.product_code || '');
        $('#product_category').val(product.product_category_id || '');
        $('#quantity_cell').val(product.quantity_cell || '');
        $('#power_output_range').val(product.power_output_range || '');
        $('#max_system_vol').val(product.max_system_vol || '');
        $('#max_efficiency').val(product.max_efficiency || '');
        $('#dimension').val(product.dimension || '');
        $('form.edit-product').attr('data-productid', product.product_id);
        editor.setData(product.detail);
        
        // Ensure technologies is an array
        const technologies = product.technologies || [];

        // Update checkboxes based on the technologies array
        technologies.forEach(tech => {
            const checkbox = $(`#technology_${tech.id}`);
            if (checkbox.length) {
                checkbox.prop('checked', true);
                checkbox.attr('data-ishaving', '1');
            }
        });

        const imagePreviewContainer = $('.images-preview');
        imagePreviewContainer.empty(); 

        existingImages = Array.isArray(product.images) ? product.images : [];
        imagesToDelete.length = 0;

        existingImages.forEach(image => {
            const imgElement = `
                <div class="image-preview-item">
                    <img src="${image.src}" alt="Product Image">
                    <button type="button" class="remove-image" data-imageid="${image.id}"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
            imagePreviewContainer.append(imgElement);
        });

        $('.edit-product-container').slideDown();

        $('main').animate({
            scrollTop: $('.edit-product-container').offset().top
        }, 1000);

    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function search() {
    
    const access_token = localStorage.getItem('access_token');
    loading = true;
    renderLoading();
    fetch(`/api/${ language }/products?keyword=${ keyword }`, {
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
        showProducts(result.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showProducts(data) {
    $('.product-items').empty();
    if (!data.length) {
        const noResultHTML = `<div class="no-result">
            <h2>Không sản phẩm nào phù hợp</h2>
            <span>Vui lòng thử tìm kiếm khác</span> 
        </div>`;

        $('.product-items').append(noResultHTML);

        return
    }
 
    for (let i = 0; i < data.length; i++) {
        let productHTML = `
        <li class="col" data-productid="${data[i].product_id}">
            <div class="product-item center col">
                <div class="image">
                    <img src="${data[i].src}" alt="">
                </div>
                <div class="product-info full-width flex-box row">
                    <span>${data[i].quantity_cell} cell</span>
                    <span>${data[i].power_output_range}</span>
                </div>
                <div class="name full-width" title="${data[i].product_name}">
                    <span>${data[i].product_name}</span>
                </div>
                <div class="action">
                    <button class="edit-btn row center" type="button" data-productid="${data[i].product_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="delete-btn row center" type="button" data-productid="${data[i].product_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>
        </li>`;

        $('.product-items').append(productHTML);
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

function updateProduct(newDataProduct, technologiesToDelete, technologiesToUpdate, firstImageSrc) {
    const access_token = localStorage.getItem('access_token');
    const language = $('header').data('language');
    
    var formData = new FormData();

    formData.append('newDataProduct', JSON.stringify(newDataProduct));
    formData.append('technologiesToDelete', JSON.stringify(technologiesToDelete));
    formData.append('technologiesToUpdate', JSON.stringify(technologiesToUpdate));
    formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    filesArray.forEach(file => formData.append('images', file));
    
    renderLoading();
    // Gửi dữ liệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/product`, {
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

        var $productItem = $(`li[data-productid='${newDataProduct.product_id}']`);

        // Cập nhật hình ảnh
        $productItem.find('.image img').attr('src', firstImageSrc);

        // Cập nhật thông tin sản phẩm
        $productItem.find('.product-info span').eq(0).text(`${newDataProduct.quantity_cell} cell`);
        $productItem.find('.product-info span').eq(1).text(newDataProduct.power_output_range);
        $productItem.find('.name span').text(newDataProduct.product_name);
        $productItem.addClass('highlight-green');

        var newPosition = $productItem.offset().top - 100;

        $('html, body').animate({ scrollTop: newPosition }, 1000, function() {
            setTimeout(function() {
                $productItem.removeClass('highlight-green');
            }, 2000); 
        });

        $('.edit-product-container').slideUp();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function deleteProduct(product_id) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/product`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ product_id: product_id })
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

        var $productItem = $(`li[data-productid='${product_id}']`);

        $productItem.remove();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}