$(document).ready(function() {
    var language = $('.top-language');
    var lang1 = language.find('.lang1');

    // Hiệu ứng khi rê chuột vào ngôn ngữ
    language.on('mouseenter', function() {
        lang1.stop().slideDown();
    });

    // Hiệu ứng khi rê chuột ra khỏi ngôn ngữ
    language.on('mouseleave', function() {
        lang1.stop().slideUp();
    });

    // Hiệu ứng toggle khi click vào các nav-link
    $(document).on('click', '.nav-link', function(event) {
        event.stopPropagation(); // Ngăn không cho sự kiện lây lan lên cha
        var subMenu = $(this).find('.dropdown-sub-menu');
        var chevronIcon = $(this).find('.fa-chevron-down');
        var is_other_subMenu_show = $('.dropdown-sub-menu.active').not(subMenu).length;

        $('.dropdown-sub-menu').not(subMenu).slideUp().removeClass('active');
        $('body > *').not('header').removeClass('blur');
        $('.fa-chevron-down').not(chevronIcon).removeClass('fa-rotate-180');

        if (is_other_subMenu_show > 0) {
            setTimeout(function() {
                subMenu.stop().slideToggle().toggleClass('active');
                subMenu.css('display', 'flex');
                chevronIcon.toggleClass('fa-rotate-180');
            }, 400);
        } else {
            subMenu.stop().slideToggle().toggleClass('active');
            subMenu.css('display', 'flex');
            chevronIcon.toggleClass('fa-rotate-180');
        }

        // Thêm lớp blur nếu submenu hiện tại được hiển thị
        if (subMenu.hasClass('active')) {
            $('body > *').not('header').addClass('blur');
        } else {
            $('body > *').not('header').removeClass('blur');
        }
    });

    // Đóng submenu khi click bên ngoài
    $(document).on('click', function() {
        $('.dropdown-sub-menu.active').slideUp().removeClass('active');
        $('body > *').not('header').removeClass('blur');
        $('.fa-chevron-down').removeClass('fa-rotate-180'); // Xóa lớp khi đóng submenu
    });

    // Ngăn không cho submenu đóng khi click bên trong submenu
    $(document).on('click', '.dropdown-sub-menu', function(event) {
        event.stopPropagation();
    });
});

$(document).ready(function() {
    $(document).on('click', '.categories-container ul li', function(event) {
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
            const productsLength = products.length > 5 ? 5 : products.length;

            var productsHTML = ``
            for (let i = 0; i < productsLength; i++) {
                productsHTML += `
                <li class="col" data-productid="${ products[i].product_id }">
                    <a href="${ language == 'vn' ? '' : ('/' + language) }/product/${ products[i].product_name }" class="full-width"><img src="${ products[i].src }" alt="" srcset="" class="full-width"></a>
                    <span>${ products[i].product_name }</span>
                </li>
                `
            }

            container.find('.products-container ul').empty().append(productsHTML);
            container.find('.categories-container ul li').removeClass('active');
            $(this).addClass('active');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    })
})