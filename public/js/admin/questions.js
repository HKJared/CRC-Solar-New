var keyword = '';
var loading = false;
const language = $('header').data('language');

$(document).ready(function() {
    document.title = "CRC Solar - Admin - Hỏi đáp";

    search();

    $(document).on('click', '.row-table', function() {
        var subquestion = $(this).find('.sub-question');
        var icon = $(this).find('.question > i');
        
        if (subquestion.is(':visible')) {
            subquestion.slideUp();
            icon.removeClass('rotate-180');
        } else {
            subquestion.slideDown();
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

    $(document).on('click', '.add-question', function(event) {
        event.stopPropagation();

        const formHTML = `
        <form id="add-question-form" class="col">
            <h3>Thêm câu hỏi</h3>
            <button type="button" class="x-btn"><i class="fa-solid fa-xmark"></i></button>
            <label for="title">Câu hỏi</label>
            <input type="text" name="" id="title">
            <label for="detail">Giải đáp</label>
            <textarea name="" id="detail" rows="5"></textarea>
            <button type="submit" class="submit-question">Submit</button>
        </form>
        `;

        $('.add-question-container').html(formHTML).css('display', 'flex');
    });

    $(document).on('click', 'form .x-btn', function(event) {
        event.stopPropagation();

        $(this).closest('.add-question-container').css('display', 'none');
    });

    $(document).on('submit', '#add-question-form', function(event) {
        event.preventDefault();

        showConfirm('Xác nhận thêm câu hỏi mới', function(result) {
            if(result) {
                const question = {
                    title: $('#title').val(),
                    detail: $('#detail').val()
                }

                createQuestion(question);
            }
        });
    });
});

function search() {
    const access_token = localStorage.getItem('access_token');
    loading = true;
    renderLoading();
    fetch(`/api/${ language }/questions?keyword=${ keyword }`, {
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
        showQuestions(result.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showQuestions(data) {
    $('.question-items').empty();

    if (!data.length) {
        if (page == 1) {
            const noResultHTML = `<div class="no-result">
                <h2>Không có câu hỏi nào phù hợp</h2>
                <span>Vui lòng thử tìm kiếm khác</span> 
            </div>`;

            $('.questions-items').append(noResultHTML);
        }

        return
    }
 
    for (let i = 0; i < data.length; i++) {
        let questionHTML = `
            <li class="row-table question-item" data-questionid="${data[i].question_id}" style="display: none">
                <div class="question row">
                    <i class="fa-solid fa-caret-down"></i>
                    <div class="title center">
                        <span>${data[i].title}  </span>
                    </div>
                    <div class="toggle-status center">
                        <input type="checkbox" id="status_${data[i].question_id}" checked/>
                        <label for="status_${data[i].question_id}">Toggle</label>
                    </div>
                </div>
                <ul class="sub-question">
                    <li><p>${data[i].detail}</p></li>
                    <li class="extra-info"><p>Tạo bởi <strong>${data[i].admin_name}</strong> lúc "${formatDateTime(data[i].updated_at)}"</p></li>
                    ${ data[i].updated_by ? '<li class="extra-info"><p>Cập nhật bởi <strong>' + data[i].updated_by_name + '</strong> lúc "' + formatDateTime(data[i].updated_at) + '"</p></li>' : '' }
                    <li>
                        <div class="action">
                            <button class="edit-btn row center" type="button" data-questionid="${data[i].question_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                            <button class="delete-btn row center" type="button" data-questionid="${data[i].question_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </li>    
                </ul>
            </li>
        `;

        let $questionHTML = $(questionHTML);
        $('.question-items').append($questionHTML);
        $questionHTML.slideDown();
    }

    loading = false;
}

function createQuestion(question) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ question: question })
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

        let questionHTML = `
        <li class="row-table question-item" data-questionid="${data.question.question_id}" style="display: none">
                <div class="question row">
                    <i class="fa-solid fa-caret-down"></i>
                    <div class="title center">
                        <span>${data.question.title}  </span>
                    </div>
                    <div class="toggle-status center">
                        <input type="checkbox" id="status_${data.question_id}" checked/>
                        <label for="status_${data.question.question_id}">Toggle</label>
                    </div>
                </div>
                <ul class="sub-question">
                    <li><p>${data.question.detail}</p></li>
                    <li class="extra-info"><p>Tạo bởi <strong>${data.question.admin_name}</strong> lúc "${formatDateTime(data.question.updated_at)}"</p></li>
                    <li>
                        <div class="action">
                            <button class="edit-btn row center" type="button" data-questionid="${data.question.question_id}"><i class="fa-solid fa-pen"></i> Edit</button>
                            <button class="delete-btn row center" type="button" data-questionid="${data.question.question_id}"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </li>    
                </ul>
            </li>
        `

        let $questionHTML = $(questionHTML);
        $('.question-items').prepend($questionHTML);
        $questionHTML.slideDown();

        $('.add-question-container').html('').css('display', 'none');
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function updateQuestion(question_id) {
    const access_token = localStorage.getItem('access_token');

    renderLoading();
    fetch(`/api/${language}/question`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authentication': access_token
        },
        body: JSON.stringify({ question_id: question_id })
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

        var $questionItem = $(`li[data-questionid='${question_id}']`);

        $questionItem.find('.status').removeClass('yellow').addClass('green').find('span').html('Đã xử lí');

        $questionItem.find('.change-status').remove();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}