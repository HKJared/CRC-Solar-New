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

function formatDate(dateString) {
    // Tạo một đối tượng Date từ chuỗi dateString
    const date = new Date(dateString);

    // Lấy ngày, tháng và năm từ đối tượng Date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
    const year = date.getFullYear();

    // Định dạng lại thành chuỗi ngày tháng năm
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate;
}
