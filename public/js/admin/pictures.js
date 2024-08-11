var keyword = '';
var loading = false;
var page = 1;

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Thư viện ảnh";

    search();
});

$(document).ready(function() {
    $(document).on('click', '.add-picture', function(event) {
        event.stopPropagation();

        const formHTML = `
        <form id="add-picture-form" class="col">
            <h3>Thêm hình ảnh</h3>
            <button type="button" class="x-btn"><i class="fa-solid fa-xmark"></i></button>
            <label for="title">Tag</label>
            <input type="text" name="" id="tag">
            <label for="size">Size</label>
            <select name="" id="size">
                <option value="normal">Thường</option>
                <option value="big">Lớn</option>
                <option value="tall">Cao</option>
                <option value="wide">Rộng</option>
            </select>
            <label for="src">Chọn hình ảnh</label>
            <input type="file" name="" id="src">
            <div class="image-preview normal">
                
            </div>
            <button type="submit" class="submit-picture">Submit</button>
        </form>
        `;

        $('.add-picture-container').html(formHTML).css('display', 'flex');
    });

    $(document).on('change', '#src', function() {
        const file = this.files[0];
        const validImageTypes = ['image/jpeg', 'image/png'];
        
        if (file) {
            // Kiểm tra định dạng file
            if (!validImageTypes.includes(file.type)) {
                showNotification('Định dạng file không hợp lệ. Vui lòng chọn file ảnh (jpg, png).');
                $(this).val(''); // Reset input file
                return;
            }
            
            // Hiển thị ảnh xem trước
            const reader = new FileReader();
            reader.onload = function(e) {
                $('.image-preview').html(`<img src="${e.target.result}" alt="Ảnh xem trước" class="full-width full-height">`);
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('change', '#size', function() {
        const size = $(this).val();
        $('.image-preview').removeClass('normal big tall wide').addClass(size);
    });

    $(document).on('submit', '#add-picture-form', function(event) {
        event.preventDefault();

        const $form = $(this);

        showConfirm('Xác nhận thêm hình ảnh', function(result) {
            if(result) {
                const main_image = $('#src')[0].files[0];

                if (!main_image) {
                    showNotification('Chưa có hình ảnh nào được chọn.');
                    return
                }
                
                const picture = {
                    src: $('#src').attr('src'),
                    tag: $('#tag').val(),
                    size:  $('#size').val()
                }

                let formData = new FormData();
                formData.append('data', JSON.stringify(picture));
                formData.append('images', main_image);

                createPicture(formData);
            }
        });
    });

    $(document).on('click', '.x-btn', function(event) {
        event.stopPropagation();

        $('.add-picture-container').empty().css('display', 'none');
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();

        const picture_id = $(this).closest('div').data('pictureid');

        showConfirm('Xác nhận xóa ảnh này', function(result) {
            if (result) {
                deletePicture(picture_id);
            }
        });
    });

    $(document).on('click', '.see-more-container button', function(event) {
        event.stopPropagation();

        page++;
        search();
    });
});

function search() {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');
    loading = true;
    fetch(`/api/${language}/pictures?keyword=${ keyword }&page=${page}`, {
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
        showPictures(data.data)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showPictures(pictures) {
    if (page == 1) {
        $('.picture-items').empty();
    }

    for (let i = 0; i < pictures.length; i++) {
        let picture_item = `
        <div class="${ pictures[i].size }" data-pictureid="${pictures[i].picture_id}" title="Thêm bởi ${pictures[i].admin_name} vào lúc ${formatDateTime(pictures[i].created_at)}">
            <button type="button" class="delete-btn center"><i class="fa-solid fa-trash-can"></i></button>  
            <img src="${ pictures[i].src }" class="picture" alt="">
        </div>
        `;

        $('.picture-items').append(picture_item)
    }
}

function createPicture(formData){
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${ language }/picture`, {
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

        const newPicture = result.newPicture;

        let picture_item = `
        <div class="${ newPicture.size }" data-pictrueid="${newPicture.picture_id}" title="Thêm bởi ${newPicture.admin_name} vào lúc ${formatDateTime(newPicture.created_at)}">    
            <img src="${ newPicture.src }" class="picture" alt="">
        </div>
        `;

        $('.picture-items').prepend(picture_item);

        $('.add-picture-container').empty().css('display', 'none');
    }) 
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function deletePicture(picture_id) {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${ language }/picture`, {
        method: 'DELETE',
        headers: {
            'authentication': access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ picture_id: picture_id })
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

        var $pictureItem = $(`div[data-pictureid='${picture_id}']`);
        $pictureItem.remove();
    }) 
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}