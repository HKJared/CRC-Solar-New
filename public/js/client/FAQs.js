var keyword = '';

$(document).ready(function() {
    document.title = "CRC GROUP - Hỏi đáp";

    search();
});

$(document).ready(function() {
    $(document).on('click', '.nav-faqs a', function(e) {
        e.preventDefault();
    
        // Lấy ID của phần tử được liên kết
        var targetId = $(this).attr('href').substring(1);
        var targetElement = $('#' + targetId);
    
        if (targetElement.length) {
            var offsetTop = targetElement.offset().top - 120; // Điều chỉnh vị trí scroll bù đắp phần header
            $('html, body').animate({
                scrollTop: offsetTop
            }, 'slow');
        }
    });
    
    $(document).on('click', '.answer-container', function() {
        var answer = $(this).find('.answer');
    
        // Kiểm tra trạng thái hiện tại của answer
        if (answer.is(':visible')) {
            // Nếu đang hiển thị, ẩn đi
            answer.slideUp();
        } else {
            // Nếu đang ẩn, hiển thị lên
            answer.slideDown();
        }
    });
});

function search() {
    const language = $('header').data('language');
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
 
    var data_nav = ``;
    var data_container = ``;

    const data_length = data.length;
    for (let i = 0; i < data_length; i++) {
        data_nav += `<li><a href="#faqs${ i }">${ data[i].title }</a></li>`;

        data_container += `
        <div id="faqs${ i }">
            <ul>
                <li class="answer-container">
                    <h3>${ data[i].title }</h3>
                    <div class="answer">
                        <p><strong>${ data[i].title }</strong> <br><br>
                        ${ data[i].detail }</p>
                    </div>
                </li>
            </ul>
        </div>
        `;
    }

    $('.faq-items').append(data_nav);
    $('.faqs-container .right').append(data_container)
}