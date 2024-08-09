var keyword = '';
var loading = false;

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Hỏi đáp";

    search();

    $(document).on('click', '.row-table', function() {
        var subFAQ = $(this).find('.sub-FAQ');
        var icon = $(this).find('.FAQ > i');
        
        if (subFAQ.is(':visible')) {
            subFAQ.slideUp();
            icon.removeClass('rotate-180');
        } else {
            subFAQ.slideDown();
            icon.addClass('rotate-180');
        }
    });

    $(document).on('click', '.toggle-status', function(event) {
        event.stopPropagation();
    });

    $(document).on('submit', '.search', function(event) {
        event.preventDefault();

        keyword = $('.search-text').val();
        page = 1;
        search();
    });

    $(document).on('click', '.add-FAQ', function(event) {
        event.stopPropagation();

        const formHTML = `
        <form id="add-FAQ-form" class="col">
            <h3>Thêm câu hỏi</h3>
            <button type="button" class="x-btn"><i class="fa-solid fa-xmark"></i></button>
            <label for="title">Câu hỏi</label>
            <input type="text" name="" id="title">
            <label for="detail">Giải đáp</label>
            <textarea name="" id="detail" rows="5"></textarea>
            <button type="submit" class="submit-FAQ">Submit</button>
        </form>
        `;

        $('.add-FAQ-container').html(formHTML).css('display', 'flex');
    });

    $(document).on('click', 'form .x-btn, button.cancel', function(event) {
        event.stopPropagation();

        $(this).closest('.add-FAQ-container').css('display', 'none');
    });

    $(document).on('submit', '#add-FAQ-form', function(event) {
        event.preventDefault();

        showConfirm('Xác nhận thêm câu hỏi mới', function(result) {
            if(result) {
                const FAQ = {
                    title: $('#title').val(),
                    detail: $('#detail').val()
                }

                createFAQ(FAQ);
            }
        });
    });

    $(document).on('click', '.edit-btn', function(event) {
        event.stopPropagation();

        const FAQ_id = $(this).data('faqid');
        const title = $(this).closest('li.row-table').find('.title span').text();
        const detail = $(this).closest('li.row-table').find('.detail p').text();

        const formHTML = `
        <form id="edit-FAQ-form" class="col" data-faqid="${FAQ_id}">
            <h3>Chỉnh sửa câu hỏi</h3>
            <button type="button" class="x-btn"><i class="fa-solid fa-xmark"></i></button>
            <label for="title">Câu hỏi</label>
            <input type="text" name="" id="title" value="${title}">
            <label for="detail">Giải đáp</label>
            <textarea name="" id="detail" rows="5">${detail}</textarea>
            <div class="action">
                <button type="button" class="cancel">Cancel</button>
                <button type="submit" class="submit-FAQ">Submit</button>
            </div>
        </form>
        `;

        $('.add-FAQ-container').html(formHTML).css('display', 'flex');

    });

    $(document).on('submit', '#edit-FAQ-form', function(event) {
        event.preventDefault();

        const FAQ_id = $(this).data('faqid');

        showConfirm('Xác nhận cập nhật nội dung câu hỏi', function(result) {
            if(result) {
                const FAQ = {
                    FAQ_id: FAQ_id,
                    title: $('#title').val(),
                    detail: $('#detail').val()
                }

                updateFAQ(FAQ);
            }
        });
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();

        const FAQ_id = $(this).data('faqid');

        showConfirm('Xác nhận xóa câu hỏi này', function(result) {
            if (result) {
                deleteFAQ(FAQ_id);
            }
        })
    });
});

function search() {
    const access_token = localStorage.getItem('access_token');
    loading = true;
    renderLoading();
    fetch(`/api/${ language }/FAQs?keyword=${ keyword }`, {
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
                showNotification(result.message);
                throw new Error('Network response was not ok');
            }
            return result;
        });
    })
    .then(result => {
        showFAQs(result.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showFAQs(data) {
    $('.FAQ-items').empty();

    if (!data.length) {
        if (page == 1) {
            const noResultHTML = `<div class="no-result">
                <h2>Không có câu hỏi nào phù hợp</h2>
                <span>Vui lòng thử tìm kiếm khác</span> 
            </div>`;

            $('.FAQs-items').append(noResultHTML);
        }

        return
    }
 
    for (let i = 0; i < data.length; i++) {
        let FAQHTML = `
            <li class="row-table FAQ-item" data-FAQid="${data[i].FAQ_id}" style="display: none">
                <div class="FAQ row">
                    <i class="fa-solid fa-caret-down"></i>
                    <div class="title center">
                        <span>${data[i].title}  </span>
                    </div>
                    <div class="toggle-status center">
                        <input type="checkbox" id="status_${data[i].FAQ_id}" checked/>
                        <label for="status_${data[i].FAQ_id}">Toggle</label>
                    </div>
                </div>
                <ul class="sub-FAQ">
                    <li class="detail"><p>${data[i].detail}</p></li>
                    <li class="extra-info"><p>Tạo bởi <strong>${data[i].admin_name}</strong> lúc "${formatDateTime(data[i].updated_at)}"</p></li>
                    ${ data[i].updated_by ? '<li class="extra-info"><p class="updated-by">Cập nhật bởi <strong>' + data[i].updated_by_name + '</strong> lúc "' + formatDateTime(data[i].updated_at) + '"</p></li>' : '<li class="extra-info"><p class="updated-by"></p></li>' }
                    <li>
                        <div class="action">
                            <button class="edit-btn row center" type="button" data-FAQid="${data[i].FAQ_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                            <button class="delete-btn row center" type="button" data-FAQid="${data[i].FAQ_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </li>    
                </ul>
            </li>
        `;

        let $FAQHTML = $(FAQHTML);
        $('.FAQ-items').append($FAQHTML);
        $FAQHTML.slideDown();
    }

    loading = false;
}

function createFAQ(FAQ) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/FAQ`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ FAQ: FAQ })
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

        let FAQHTML = `
        <li class="row-table FAQ-item" data-FAQid="${data.FAQ.FAQ_id}" style="display: none">
                <div class="FAQ row">
                    <i class="fa-solid fa-caret-down"></i>
                    <div class="title center">
                        <span>${data.FAQ.title}  </span>
                    </div>
                    <div class="toggle-status center">
                        <input type="checkbox" id="status_${data.FAQ_id}" checked/>
                        <label for="status_${data.FAQ.FAQ_id}">Toggle</label>
                    </div>
                </div>
                <ul class="sub-FAQ">
                    <li><p>${data.FAQ.detail}</p></li>
                    <li class="extra-info"><p>Tạo bởi <strong>${data.FAQ.admin_name}</strong> lúc "${formatDateTime(data.FAQ.updated_at)}"</p></li>
                    <li>
                        <div class="action">
                            <button class="edit-btn row center" type="button" data-FAQid="${data.FAQ.FAQ_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                            <button class="delete-btn row center" type="button" data-FAQid="${data.FAQ.FAQ_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </li>    
                </ul>
            </li>
        `

        let $FAQHTML = $(FAQHTML);
        $('.FAQ-items').prepend($FAQHTML);
        $FAQHTML.slideDown();

        $('.add-FAQ-container').html('').css('display', 'none');
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function updateFAQ(newDataFAQ) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/FAQ`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ newDataFAQ: newDataFAQ })
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

        var $FAQItem = $(`li[data-FAQid='${newDataFAQ.FAQ_id}']`);

        $FAQItem.find('.title span').html(newDataFAQ.title);
        $FAQItem.find('.updated-by').html(`Cập nhật bởi <strong>${data.FAQ.updated_by_name}</strong> lúc "${formatDateTime(data.FAQ.updated_at)}"`);

        $FAQItem.addClass('highlight-green');

        var newPosition = $FAQItem.offset().top - 100;

        $('main').animate({ scrollTop: newPosition }, 1000, function() {
            setTimeout(function() {
                $FAQItem.removeClass('highlight-green');
            }, 2000); 
        });

        $('.add-FAQ-container').css('display', 'none');
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function deleteFAQ(FAQ_id) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/FAQ`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ FAQ_id: FAQ_id })
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

        var $FAQItem = $(`li[data-FAQid='${FAQ_id}']`);
        $FAQItem.remove();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}