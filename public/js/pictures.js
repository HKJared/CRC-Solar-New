var keyword = '';
var loading = false;
var page = 1;

$(document).ready(function() {
    document.title = "CRC GROUP - Thư viện ảnh";
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
    renderLoading();
    fetch(`/api/${language}/pictures?keyword=${ keyword }&page=${ page }`, {
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
        showPictures(data.data);
        removeLoading();
    })
    .catch(error => {
        removeLoading();
        console.error('There was a problem with the fetch operation:', error);
    });
}

function showPictures(pictures) {
    if (page == 1) {
        $('.picture-items').empty();
    }

    for (let i = 0; i < pictures.length; i++) {
        let picture_item = `
        <div class="${ pictures[i].size }">    
            <img src="${ pictures[i].src }" class="picture" alt="">
        </div>
        `;

        $('.picture-items').append(picture_item)
    }
}