$(document).ready(function() {
    $(document).on('click', '.product-categories-container ul li', function(event) {
        event.stopPropagation();
        
        if ($(this).hasClass('active')) return;

        var container = $(this).closest('.container');
        const product_category_id = $(this).data('product-category-id');
        const language = $('header').data('language');

        var query = `/api/${ language }/products?keyword=`;

        if (product_category_id) {
            query = `/api/${ language }/products?product_category_id=${ product_category_id }`
        }

        fetch(query, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    // showNotification(data.message);
                    throw new Error('Network response was not ok');
                }
                return data;
            });
        })
        .then(result => {
            const products = result.data;

            var productsHTML = ``
            for (let i = 0; i < products.length; i++) {
                productsHTML += `
                <li class="col" data-productid="${ products[i].product_id }">
                    <a href="${ language == 'vn' ? '' : ('/' + language) }/product/${ products[i].product_name }" class="full-width"><img src="${ products[i].src }" alt="" srcset="" class="full-width"></a>
                    <div class="product-info flex-box row">
                        <span>${ products[i].quantity_cell } cell</span>
                        <span>${ products[i].power_output_range }</span>
                    </div>
                    <span>${ products[i].product_name }</span>
                </li>
                `
            }

            container.find('.products-container ul').empty().append(productsHTML);
            container.find('.product-categories-container ul li').removeClass('active');
            $(this).addClass('active');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    });

    $(document).on('click', '.next', function() {
        const items = $('.certifications .slide .item');
        $('.certifications .slide').append(items[0]);
    });

    $(document).on('click', '.pre', function() {
        const items = $('.certifications .slide .item');
        $('.certifications .slide').prepend(items[items.length - 1]);
    });
})