function changeTitle(newTitle) {
    document.title = newTitle;
}

function getBaseUrl(url) {
    // Tạo một đối tượng URL từ đường dẫn đầy đủ
    var fullUrl = new URL(url);

    // Xây dựng đường dẫn cơ bản chỉ bao gồm giao thức và hostname
    var baseUrl = `${fullUrl.protocol}//${fullUrl.hostname}`;

    return baseUrl;
}

function showNotification(message) {
    $('#notificationText').text(message);
    $('#notification').show();
    setTimeout(() => {
        setTimeout(() => {
            $('#notification').addClass('right-slide');
        }, 10);
    }, 10);
    setTimeout(() => {
        $('#notification').removeClass('right-slide'); 
        setTimeout(() => {
            $('#notification').hide(); 
        }, 500);
    }, 3000); 
}

function showConfirm(message, callback) {
    $('#confirmText').text(message);
    $('.confirm-container').css('display', 'flex');
    
    $('.confirm-btn').off('click').on('click', function() {
        $('.confirm-container').css('display', 'none');
        if (callback) callback(true); // Người dùng nhấp vào Confirm
    });

    $('.cancel-btn').off('click').on('click', function() {
        $('.confirm-container').css('display', 'none');
        if (callback) callback(false); // Người dùng nhấp vào Cancel
    });
}


function getLanguageUrl(url) {
    const pathArray = url.split('/');
    const languageCode = pathArray[3];
    var language = '';

    switch (languageCode) {
        case 'en':
        case 'cn':
            language = languageCode;
            break;
        default:
            language = 'vn';
    }

    return language;
}

function formatDate(datetimeString) {
    const date = new Date(datetimeString);

    const day = date.getUTCDate(); // Get the day of the month (1-31)
    const month = date.getUTCMonth() + 1; // Months are zero-indexed, so add 1
    const year = date.getUTCFullYear(); // Get the four-digit year

    // Pad single digit day and month with leading zero if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
}

function setLanguage(language) {
    if (language == 'vn') return;
     
    $.getJSON(`/js/languages/${language}.json`, function(data) {
        $("[data-translate]").each(function() {
            const key = $(this).data("translate");
            if ($(this).attr("placeholder") !== undefined) {
                $(this).attr("placeholder", data[key]);
            } else {
                $(this).text(data[key]);
            }
        });
    });
}

function renderLoading() {
    let loadingHTML = `
    <div class="loading-container">
        <div class="loading-wrapper">
            <div class="loading set_1"></div>
            <div class="loading set_2"></div>
            <div class="loading set_3"></div>
        </div>
    </div>
    `;

    $('html > body').append(loadingHTML)
}

function removeLoading() {
    $('.loading-container').remove();
}

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}