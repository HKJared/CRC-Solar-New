$(document).ready(function() {
    // Function to create the count-up effect
    function countUp(element, finalValue, hasPlus) {
        let count = 0;
        let increment = finalValue / 100; // Adjust the increment value for speed
        let interval = setInterval(function() {
            count += increment;
            if (count >= finalValue) {
                clearInterval(interval);
                count = finalValue;
            }
            $(element).text(Math.floor(count) + (hasPlus ? '+' : ''));
        }, 10); // Adjust the interval time for smoother effect
    }

    // Observe when the element comes into view
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let $cntNum = $(entry.target);
                let finalText = $cntNum.text();
                let hasPlus = finalText.includes('+');
                let finalValue = parseInt(finalText, 10);
                countUp($cntNum, finalValue, hasPlus);
                $cntNum.addClass('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Attach the observer to each .cnt-num element
    $('.cnt-num').each(function() {
        observer.observe(this);
    });
    
    $(document).on('click', '.confirm-container', function(event) {
        if ($(event.target).is('#confirm') || $(event.target).closest('#confirm').length) {
            return;
        }

        $('.confirm').css('animation', 'scaleOut 0.5s forwards');

        setTimeout(function() {
            $('.confirm').css('animation', 'none'); 
        }, 500); 
    });

    $(document).on('click', '.x-btn', function() {
        $(this).closest('.edit-text-container').css('display', 'none');
        $(this).closest('.edit-image-container').css('display', 'none');
    });

    $(document).on('click', '.edit-button-text', function() {
        const container = $(this).closest('.edit-element');

        const textElements  = container.find("[id*='text']");

        let textsContainerHTML = ``;

        textElements.each(function() {
            textsContainerHTML += `
            <div class="text row flex-box" style="margin-bottom: 40px;gap: 30px">
                <div class="old-text center">
                    <p style="white-space: pre-line;">${ $(this).text() }</p>
                </div>
                <div class="new-text center">
                    <textarea name="" id="" data-elementid="${ $(this).attr('id') }"></textarea>
                </div>
            </div>
            `
        });

        $('.texts-container').html(textsContainerHTML);

        $('.edit-text-container').css('display', 'flex');
    });

    $(document).on('click', '.edit-text-container .submit-btn', function() {
        showConfirm('Xác nhận thay đổi', function(result) {
            if (result) {
                let data = [];

                $('.texts-container textarea').each(function() {
                    // Lấy giá trị của textarea và data-elementid
                    let detail = $(this).val().trim();
                    let elementId = $(this).data('elementid');
            
                    // Kiểm tra xem giá trị có khác rỗng không
                    if (detail !== '') {
                        // Thêm đối tượng vào mảng
                        data.push({ element_id: elementId, detail: detail });
                    }
                });

                updateDisplayText(data)

                $('.edit-text-container').css('display', 'none');
            } else {
                return
            }
        });
    });

    $(document).on('click', '.edit-button-image', function() {
        const container = $(this).closest('div');
        const imageElements = container.find("[id*='image']");
        let imagesContainerHTML = ``;
        const maxContainerHeight = 330;
        const numElements = imageElements.length;

        imageElements.each(function() {
            const imgWidth = $(this).width();
            const imgHeight = $(this).height();
            const newHeight = maxContainerHeight / numElements;
            const newWidth = (imgWidth * newHeight) / imgHeight;

            imagesContainerHTML += `
            <div class="image row flex-box" style="margin-bottom: 40px;gap: 30px">
                <div class="old-image center" style="width: ${ newWidth }px; height: ${ newHeight }px;">
                    <img src="${ $(this).attr('src') }" alt="">
                </div>
                <div class="new-image center">
                    <input type="file" data-id="${ $(this).attr('id') }" accept=".png, .jpg, .jpeg">
                </div>
            </div>
            `
        });

        $('.images-container').html(imagesContainerHTML);

        $('.edit-image-container').css('display', 'flex');
    });

    $(document).on('click', '.edit-image-container .submit-btn', function() {
        showConfirm('Xác nhận thay đổi', function(result) {
            if (result) {
                let data = [];

                $('.texts-container textarea').each(function() {
                    // Lấy giá trị của textarea và data-elementid
                    let detail = $(this).val().trim();
                    let elementId = $(this).data('elementid');
            
                    // Kiểm tra xem giá trị có khác rỗng không
                    if (detail !== '') {
                        // Thêm đối tượng vào mảng
                        data.push({ element_id: elementId, detail: detail });
                    }
                });

                updateDisplayText(data);
            } else {
                return
            }
        });
    });

    $(document).on('change', '.new-image input', function() {
        const file = this.files[0];
        const reader = new FileReader();
        const oldImageContainer = $(this).closest('.image').find('.old-image img');
    
        reader.onload = function(e) {
            oldImageContainer.attr('src', e.target.result);
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    });

    $(document).on('click', '.edit-image-container .submit-btn', function() {
        showConfirm('Xác nhận thay đổi', function(result) {
            if (result) {
                let data = [];
                
                $('.images-container input').each(function() {
                    const file = this.files[0];
                    const elementId = $(this).attr('data-id');
                    const src = $(this).closest('.image').find('img').attr('src');
                    if (file) {
                        data.push({ element_id: elementId, src: src, file: file });
                    }
                });
                updateDisplayImage(data);
            }
        });
    });
});

function updateDisplayText (data) {
    const language = $('header').data('language');
    const page = $('.body main').data('page');
    const access_token = localStorage.getItem('access_token');

    if (!data.length) {
        showNotification('Không có dữ liệu nào được thay đổi');
        return
    }

    renderLoading();
    fetch(`/api/${ language }/display-texts?page=${ page }`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "authentication": access_token
        },
        body: JSON.stringify({
            data: data
        })
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
    .then(result => {
        removeLoading();
        showNotification(result.message);
        for (let i = 0; i < data.length; i++) {
            $(`#${ data[i].element_id }`).text(data[i].detail)
        }

        $('.edit-text-container').css('display', 'none');
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function updateDisplayImage(data) {
    const page = $('.body main').data('page');
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    if (!data.length) {
        showNotification('Không có hình ảnh nào được thay đổi');
        return;
    }

    let formData = new FormData();
    data.forEach(item => {
        formData.append('images', item.file);
        formData.append('element_ids', item.element_id);
    });

    renderLoading();
    fetch(`/api/${language}/display-images?page=${ page }`, {
        method: 'PUT',
        headers: {
            "authentication": access_token
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
        removeLoading();
        showNotification(result.message);
        data.forEach(item => {
            $(`#${item.element_id}`).attr('src', item.src); 
        });

        $('.edit-image-container').css('display', 'none');
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}