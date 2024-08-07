var editor;
var keyword = '';
var loading = false;
var page = 1;
const language = $('header').data('language');

var filesArray = [];
var existingImages = [];
var imagesToDelete = [];

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
    document.title = "Admin - Danh sách bài viết";
    search();
});

$(document).ready(function() {
    $(document).on('click', '.edit-btn', function(event) {
        event.stopPropagation();
        
        var blog_id = $(this).data('blogid');

        showEditBlog(blog_id);
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();

        const blog_id = $(this).data('blogid');
        
        showConfirm('Xác nhận xóa sản phẩm này', function(result) {
            if(result) {
                deleteBlog(blog_id);
            }
        });
    });

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $('.search-text').val();

        search();
    });

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

    $(document).on('click', 'form.edit-blog .x-btn', function(event) {
        event.stopPropagation();

        $('.edit-blog-container').slideUp();
    });

    $(document).on('submit', 'form.edit-blog', function (event) {
        event.preventDefault();
        
        var $form = $(this);
    
        showConfirm('Xác nhận cập nhật bài viết.', function(result) {
            if(result) {
                // Collecting form data for newDataBlog
                var newDataBlog = {
                    blog_id: $form.data('blogid'),
                    title: $('#title').val(),
                    detail: editor.getData(), // Assuming you have a CKEditor instance initialized as `editor`
                    category_id: $('#category_id').val(),
                    tag: $('#tag').val(),
                    seo_title: $('#seo_title').val(),
                    is_outstanding: $('#is_outstanding').is(':checked'),
                    status: $('#status').is(':checked'),
                    main_image: $('.preview img').attr('src')
                };
                
                const main_image = $('#main_image')[0].files[0];
                if (main_image) {
                    formData.append('images', main_image);
                }

                if (title === "") {
                    showNotification("Tiêu đề không được để trống");
                    $('#title').addClass('warning-border');
                    $('main').animate({
                        scrollTop: $('#title').offset().top - 20
                    }, 500);
                    return;
                }
                
                let formData = new FormData();
                formData.append('newDataBlog', JSON.stringify(newDataBlog));
        
                updateBlog(formData, newDataBlog);
            }
        });
    });
    
});

function showEditBlog(blog_id) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/blog?blog_id=${blog_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'appdivcation/json',
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
            showNotification('blog not found');
            return;
        }

        const blog = result.data;
        console.log(blog)

        // Populate form fields
        $('#title').val(blog.title || '');
        $('#category_id').val(blog.category_id);
        $('#tag').val(blog.tag || '');
        $('#seo_title').val(blog.seo_title || '');
        $('#is_outstanding').prop('checked', blog.is_outstanding);
        $('#status').prop('checked', blog.status);
        $('.preview').html(`<img src="${blog.main_image}" alt="Ảnh xem trước" class="full-width full-height">`);

        let extraInfoHTML = `<span>Tạo bởi <strong>${blog.admin_name}</strong> lúc <strong>${formatDateTime(blog.created_at)}</strong></span>`;
        if (blog.updated_by) {
            extraInfoHTML += `<span>Chỉnh sửa bởi <strong>${blog.updated_by_name}</strong> lúc <strong>${formatDateTime(blog.updated_at)}</strong></span>`;
        }
        $('.extra-info').html(extraInfoHTML);
        $('form.edit-blog').attr('data-blogid', blog.blog_id);
        editor.setData(blog.detail);
        
        $('.edit-blog-container').slideDown();

        $('main').animate({
            scrollTop: $('.edit-blog-container').offset().top
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
    fetch(`/api/${ language }/blogs?keyword=${ keyword }&page=${ page }`, {
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
        showBlogs(result.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showBlogs(data) {
    if (page == 1) {
        $('.blog-items').empty();
    }

    if (!data.length) {
        if (page == 1) {
            const noResultHTML = `<div class="no-result">
                <h2>Không có bài viết nào phù hợp</h2>
                <span>Vui lòng thử tìm kiếm khác</span> 
            </div>`;

            $('.blog-items').append(noResultHTML);
        }

        return
    }
 
    for (let i = 0; i < data.length; i++) {
        let blogHTML = `
        <div class="blog-item col" data-blogid="${data[i].blog_id}" title="${data[i].title}">
            <div class="img">
                <img src="${data[i].main_image}" alt="">
            </div>
            <div class="info-container col">
                <div class="info flex-box row">
                    <p><i class="fa-regular fa-user"></i> ${data[i].admin_name}</p>
                    <p><i class="fa-regular fa-clock"></i> ${formatDate(data[i].created_at)}</p>
                </div>
                <div class="title">
                    <h3>${data[i].title}</h3>
                </div>
                <div class="action">
                    <button class="edit-btn row center" type="button" data-blogid="${data[i].blog_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="delete-btn row center" type="button" data-blogid="${data[i].blog_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>

        </div>`;

        $('.blog-items').append(blogHTML);
    }

    loading = false;
}

function updateBlog(formData, newDataBlog) {
    const access_token = localStorage.getItem('access_token');
    const language = $('header').data('language');
    
    renderLoading();
    // Gửi dữ divệu sản phẩm tới máy chủ
    fetch(`/api/${ language }/blog`, {
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

        var $blogItem = $(`div[data-blogid='${newDataBlog.blog_id}']`);
        $blogItem.attr('title', newDataBlog.title);
        $blogItem.find('.img img').attr('src', newDataBlog.main_image);

        // Cập nhật thông tin sản phẩm
        $blogItem.find('.title span').text(`${newDataBlog.title}`);
        $blogItem.addClass('highlight-green');

        var newPosition = $blogItem.offset().top - 100;

        $('html, body').animate({ scrollTop: newPosition }, 1000, function() {
            setTimeout(function() {
                $blogItem.removeClass('highlight-green');
            }, 2000); 
        });

        $('.edit-blog-container').slideUp();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function deleteBlog(blog_id) {
    const access_token = localStorage.getItem('access_token');
    const language = $('header').data('language');

    renderLoading();
    fetch(`/api/${language}/blog?blog_id=${blog_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'appdivcation/json',
            'authentication': access_token
        }
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

        var $blogItem = $(`div[data-blogid='${blog_id}']`);

        $blogItem.remove();

        if ($('form.edit-blog').data('blogid') == blog_id) {
            $('form.edit-blog').slideUp();
        }
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}