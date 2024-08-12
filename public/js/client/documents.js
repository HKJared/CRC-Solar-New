var keyword = '';
var loading = false;
var page = 1;

$(document).ready(function() {
    document.title = "CRC GROUP - Tài liệu";
    search();
});

$(document).ready(function() {
    $(document).on('click', '.show-more-btn', function(event) {
        event.stopPropagation();

        page++;

        search();
    })
});

function search() {
    const language = $('header').data('language');
    
    renderLoading();
    fetch(`/api/${language}/documents?keyword=${ keyword }&page=${ page }`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                removeLoading();
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(data => {
        showDocuments(data.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showDocuments(documents) {
    if (page == 1) {
        $('.document-items').empty();
    }

    for (let i = 0; i < documents.length; i++) {
        let document_item = `
        <div class="document-item row full-width flex-box">    
            <div class="document-name">
                <span>${documents[i].document_name}</span>
            </div>
            <div class="src">
                <a href="${documents[i].src}" download="${documents[i].document_name}" title="Download"><i class="fa-solid fa-download"></i></a>
            </div>
        </div>
        `;

        $('.document-items').append(document_item)
    }
}