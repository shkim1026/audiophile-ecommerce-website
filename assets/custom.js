//Shows Dropdown box for 'Availability' for DESKTOP
$(".filter__label").click(function(){
    const filterActiveContainer = $(this).parent().find('.filter__activeContainer');
    filterActiveContainer.toggleClass("display-block");
});

//Shows Menu for 'Filter and Sort' for MOBILE
$(".filterAndSortBy__label").click(function(){
    $(this).next().find(".activeContainer").toggleClass("display-block");
    $('.filterAndSortBy__backgroundCover').toggleClass("display-block");
});

// Hides Menu when 'Back' is clicked for MOBILE
$(".activeContainer__backContainer").click(function(){
    $(".activeContainer").toggleClass("display-block");
    $('.filterAndSortBy__backgroundCover').toggleClass("display-block");
})

// Hides Menu container when user clicks outside of container for DESKTOP and MOBILE
$(document).mouseup(function(e){
    // Desktop Filter
    const container = $(".filter__activeContainer");
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.removeClass("display-block");
    }
    // Mobile Menu
    const mobileContainer = $(".filterAndSortBy__activeContainer");
    if (!mobileContainer.is(e.target) && mobileContainer.has(e.target).length === 0) 
    {
        mobileContainer.removeClass("display-block");
        $(".filterAndSortBy__backgroundCover").removeClass("display-block");
    }
});

// Shows 'Availability' sub-menu for MOBILE and adjusts chevron accordingly
$(".availability-label").click(function(){
    $(this).parent().find(".filter__listContainer--mobile").toggleClass("display-block");
    $(this).find(".chevron").toggleClass("display-none");
});

// Unchecks all 'availability' filter when RESET is clicked
$(".filter__reset-label").click(function(){
    $(".filter__input").prop("checked", false);
});


// Adds or Subtracts 1 from Order Quantity on Product page when user clicks on '+' or '-'. Minimum quantity is '1'
$(".product__quantity p").click(function(){
    let currentQuantityInt = parseInt($('#orderQuantity').val());
    if ($(this).hasClass('add')) {
        if (currentQuantityInt >= 99) {
            currentQuantityInt = 99;
        } else {
            currentQuantityInt++
        }
    } else if (currentQuantityInt <= 1) {
        currentQuantityInt = 1;
    } else {
        currentQuantityInt--
    }
    $('#orderQuantity').val(currentQuantityInt);
});

// Limits order quantity number input to 2 digits
$("#orderQuantity").keydown(function(){
    if (this.value.length > 1) {
        this.value = this.value.slice(0,1);
    }
});

function resetForm() {
    $('.addToCartBtn').text('ADD TO CART');
    $('#orderQuantity').val('1');
}

//GET cart object and append data to 'cart' icon in navbar
function updateCart() {
    $.ajax({
        url: '/cart.js',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $(`<div class='cart-count-bubble'>
                <span aria-hidden="true">${data.item_count}</span>
                <span class="visually-hidden">${data.item_count} items</span>
            </div>`)
            .appendTo("#cart-icon-bubble");
        },
        error: function(error) {
            console.log('error', error)
        }
    });
}

// Display loader on product form submission
function displayButtonLoader() {
    $('.buttonload').show();
    $('.addToCartBtn').hide();
}
// Hide loader on product form after form submission
function hideButtonLoader() {
    $('.addToCartBtn').show();
    $('.buttonload').hide();
    $('.addToCartBtn').text('ADDED!') //Changes button text to 'Added!'
}

//POST product data when 'Add to cart' is clicked
$('.product-form').on('submit', function(e) {
    e.preventDefault();
    displayButtonLoader()
    $.ajax({
        url: '/cart/add.js',
        type: 'POST', // GET, POST, PUT, DELETE (CRUD): Create, Read, Update, Delete
        dataType: 'json',
        data: $('.product-form').serialize(), // === {quantity: 1}
        success: function() {
            hideButtonLoader();
            setTimeout(resetForm, 2000);
            updateCart();
        },
        error: function(error) {
            console.log('error', error)
        }
    })
})

//Number to currency formatter
const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Adds or Subtracts 1 from Item Quantity on Cart page when user clicks on '+' or '-'. Minimum quantity is '1'
$(".item__quantity p").click(function(){
    let itemQuantityInput = $(this).closest('.quantity-input').find('.itemQuantityInput');
    let variantId = $(this).closest('.quantity-container').find('.variant-id').val();
    let totalPrice = $(this).closest('.line-item').find('.final-price');
    let currentQuantityInt = parseInt(itemQuantityInput.val());
    let $this = $(this)
    // Display loader when item quantity is changed on cart page
    $(this).closest('.line-item').find('.cartload').show();
    $(this).closest('.line-item').find('.final-price').hide();

    function removeCartLoader() {
        $this.closest('.line-item').find('.final-price').show();
        $this.closest('.line-item').find('.cartload').hide(); //Hides loader
    }

    if ($(this).hasClass('add')) {
        if (currentQuantityInt >= 99) {
            currentQuantityInt = 99;
        } else {
            currentQuantityInt++
        }
    } else if (currentQuantityInt <= 1) {
        currentQuantityInt = 1;
    } else {
        currentQuantityInt--
    }
    itemQuantityInput.val(currentQuantityInt);

    let data = {
        quantity: currentQuantityInt,
        id: variantId
    }

    $.ajax({
        url: '/cart/change.js',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                if (cartData.items[i].id == variantId) {
                    let dataPrice = cartData.items[i].final_line_price.toString(); //Converts line item price integer to string
                    let dataPriceFormat = dataPrice.substring(0,dataPrice.length-2)+"."+dataPrice.substring(dataPrice.length-2); //Formats line item string to account for cents
                    let totalLinePrice = currency.format(dataPriceFormat); //Formats line item string to currency
                    totalPrice.html(totalLinePrice);
                    $('.total-quantity').html(cartData.item_count);
                    let dataTotalPrice = cartData.items_subtotal_price.toString(); //Converts total order price integer to string
                    let dataTotalPriceFormat = dataTotalPrice.substring(0,dataTotalPrice.length-2)+"."+dataTotalPrice.substring(dataTotalPrice.length-2); //Formats total order string to account for cents
                    let totalOrderPrice = currency.format(dataTotalPriceFormat); //Formats total order string to currency
                    $('.total-price').html(totalOrderPrice);
                }
            }
            removeCartLoader();
            updateCart();
        },
        error: function(error) {
            console.log('error', error);
        }
    })
});

//Limits Cart Quantity input to 2 digits
$(".itemQuantityInput").keydown(function(){
    if (this.value.length > 1) {
        this.value = this.value.slice(0,1);
    }
});

//Removes item from cart when 'Remove' is clicked
$('.remove').click(function(){
    let variantId = $(this).closest('.quantity-container').find('.variant-id').val();
    let itemRow = $(this).closest('.line-item');
    
    let data = {
        quantity: 0,
        id: variantId
    }
    console.log('data', data);
    $.ajax({
        url: '/cart/change.js',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(cartData) {
            itemRow.next().remove(); //Deletes <hr> for line item
            itemRow.remove();
            updateCart();
            $('.total-quantity').html(cartData.item_count);
            let dataTotalPrice = cartData.items_subtotal_price.toString(); //Converts total order price integer to string
            let dataTotalPriceFormat = dataTotalPrice.substring(0,dataTotalPrice.length-2)+"."+dataTotalPrice.substring(dataTotalPrice.length-2); //Formats total order string to account for cents
            let totalOrderPrice = currency.format(dataTotalPriceFormat); //Formats total order string to currency
            $('.total-price').html(totalOrderPrice);
            //If cart is empty: display 'Your cart is empty!'
            if (cartData.item_count == 0) {
                $('.cart-heading').remove();
                $('.total-container').remove();
                $(`<div class="emptyCart">
                    <h2>Your cart is empty!</h2>
                    <a href="/collections/all">Continue Shopping</a>
                </div>`)
                .appendTo('#shopify-section-cart-items-custom')
            }
        },
        error: function(error) {
            console.log('error', error);
        }
    })
});


//Display Footer sub-menu when footer menu is clicked
$('.footer__links-heading').click(function(){
    const chevron = $(this).find('.fa-chevron-down');
    const submenu = $(this).next();
    const scrollHeight = submenu.prop('scrollHeight');
    const expandedHeight = scrollHeight + "px";
    const mediaQuery = window.matchMedia('(max-width: 767px)'); //Allows footer menu heading to be clicked ONLY on mobile viewports
    if (mediaQuery.matches) {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            submenu.css('maxHeight', expandedHeight);
            chevron.css('transform', 'rotateX(180deg)');
        } else {
            submenu.css('maxHeight', '0')
            chevron.css('transform', 'rotateX(0deg)');
        }
    }
});


function resizeThumbsContainer() {
    let thumbsContainer = $('.gallery__thumbs');
    let productImg = $('.product__img');
    thumbsContainer.height(`${productImg.height()}px`);
};

//Product thumbnail container and Collections image remains same height as product image on window resize
$(window).resize(() => {
    $('.product__imgContainer').flickity('resize');
    resizeThumbsContainer();
    $('.featured-image').height('auto');
    $('.featured-image').width('auto');
});

//Ensures first thumbnail has solid opacity on window load
$(document).ready(function() {
    resizeThumbsContainer();
    checkEmailOrDismissal();
});

//Switches to corresponding slide when thumbnail image is clicked
$('.thumbnail-cell').click(function(){
    let galleryCell = $('.gallery__cell');
    let thumbnailIndex = $(this).find('.thumbnail__image').data('index');
    $('.thumbnail-cell').removeClass('is-nav-selected');
    $(this).addClass('is-nav-selected');
    galleryCell.each(function(){
        let galleryIndex = $(this).find('.product__img').data('index');
        if (galleryIndex == thumbnailIndex) {
            $('.product__imgContainer').flickity('selectCell', galleryIndex);
        }
    });
});

//Switches to corresponding thumbnail when slide is changed
$('.product__imgContainer').on( 'change.flickity', function(event, index) {
    let productIndex = index;
    $('.thumbnail-cell').removeClass('is-nav-selected');
    $('.thumbnail__image').each(function(){
        let thumbIndex = $(this).data('index');
        if (thumbIndex == productIndex) {
            $(this).parents('.thumbnail-cell').addClass('is-nav-selected');
        }
    });
});

//Initializes flicker API for Product Thumbnails
$('.product__imgContainer').flickity({
    pageDots: false,
    contain: true,
    cellAlign: 'center',
    imagesLoaded: true,
});

//Limits scrolling on thumbnails
let number = 0;
const arrowDown = $('.slide-down');
const arrowUp = $('.slide-up');
const thumbnails = $('.thumbnail-cell');
const noOfClicks = thumbnails.length - 4;
const stopScrollPercentage = noOfClicks * -100 + '%';
arrowUp.hide();
if (thumbnails.length <= 4) {
    arrowDown.hide();
};
arrowDown.click(function(){
    number = number + -100;
    let percentage = number + '%';
    thumbnails.css('transform',  `translateY(${percentage})`);
    if (number == 0) {
        arrowUp.hide();
    } else if (percentage == stopScrollPercentage){
        arrowDown.hide();
        arrowUp.show();
    } else {
        arrowUp.show();
    }
});
arrowUp.click(function(){
    number = number + 100;
    let percentage = number + '%';
    thumbnails.css('transform', `translateY(${percentage})`);
    if (number == 0) {
        arrowUp.hide();
        arrowDown.show();
    } else {
        arrowUp.show();
    }
});


//Shows second collection image on hover
// $('.product-grid__list-item').each(function(){
//     $(this).hover(
//         function(){
//             if ($(this).children('#hovered-image').val() != "") {
//                 let ftImageHeight = $(this).find('.featured-image').height();
//                 let ftImageWidth = $(this).find('.featured-image').width();
//                 let hoveredImage = $(this).find('#hovered-image');
//                 $(this).find('.featured-image').attr('src', `${hoveredImage.val()}`);
//                 $(this).find('.featured-image').height(`${ftImageHeight}px`);
//                 $(this).find('.featured-image').width(`${ftImageWidth}px`);
//             }
//         },
//         function(){
//             let initialImage = $(this).find('#initial-image');
//             $(this).find('.featured-image').attr('src', `${initialImage.val()}`);
//         }
//     );
// });

$('.product-grid__list-item').each(function(){
    if ($(this).find('input').length) {
        $(this).hover(
            function(){
                let ftImageHeight = $(this).find('.featured-image').height();
                let ftImageWidth = $(this).find('.featured-image').width();
                let hoveredImage = $(this).find('#hovered-image');
                $(this).find('.featured-image').attr('src', `${hoveredImage.val()}`);
                $(this).find('.featured-image').height(`${ftImageHeight}px`);
                $(this).find('.featured-image').width(`${ftImageWidth}px`);
            },
            function(){
                let initialImage = $(this).find('#initial-image');
                $(this).find('.featured-image').attr('src', `${initialImage.val()}`);
            }
        );
    }
});

//Initializes flicker API for Announcement Bar
$('.announcement__container').flickity({
    pageDots: false,
    contain: true,
    cellAlign: 'center',
});



//Opens modal
function openModal() {
    $('.modal').show();
}

//Closes modal when user clicks on 'X' or outside of modal content
$('.close-modal').click(function(){
    $('.modal').hide();
    sessionStorage.setItem('dismiss', 'dismiss');
});

//Closes modal when user clicks outside of modal box
$('.modal').click(function() {
    $(this).hide();
    sessionStorage.setItem('dismiss', 'dismiss');
});

//Disables bubbling to modal content's parent elements
$('.modal-content').click(function(e) {
    e.stopPropagation();
});

//Clears value of 'email*' when user clicks/focuses on input of modal
$('.form__input').focus(function(){
    $('.form__input').val("");
    $('.form__input').css('color', 'black');
});

//If value of input is blank, replace with text 'Email*'
$('.form__input').focusout(function(){
    if ($(this).val() == "") {
        $(this).val('Email*')
        $('.form__input').css('color', 'gray');
    }
});

//Saves email to local storage
function saveEmail() {
    let email = $('.form__input').val();
    localStorage.setItem('email', email);
}

//Retrieves email from local storage. If no email is available: open modal
function checkEmailOrDismissal() {
    if (!localStorage.getItem('email') && !sessionStorage.getItem('dismiss')) {
        setTimeout(openModal, 5000);
    }
}

//On user email submission; save email to local storage;
$('.modal__form').submit(function(){
    saveEmail();
});

// On search icon click; display input form
$('.modal__toggle-open').click(function(){
    $('.search-form').removeClass('display-none');
    $('.modal__toggle-open').hide();
    $('.modal__toggle-close').show();
});

// On close icon click; hide input form
$('.modal__toggle-close').click(function(){
    $('.search-form').addClass('display-none');
    $('.modal__toggle-open').show();
    $('.modal__toggle-close').hide();
});

//Hides search results when user clicks outside of search results
$(document).mouseup(function(e){
    const predictiveSearchContainer = $('#predictive-search');
 
    if(!predictiveSearchContainer.is(e.target) && predictiveSearchContainer.has(e.target).length === 0){
        predictiveSearchContainer.hide();
    }
});

//Display and hides mega-menu on hover
$('.header__menu-item').hover(
    function(){
        $(this).siblings('.header__menu-dropdown').removeClass('display-none')
    }, 
    function(){
        $(this).siblings('.header__menu-dropdown').addClass('display-none');
    }
);
$('.header__menu-dropdown').hover(
    function(){
        $(this).removeClass('display-none')
    }, 
    function(){
        $(this).addClass('display-none');
    }
);


// Display cart side-drawer
$('.header__icon--cart').click(function(){
    if ($('.mini-cart-modal').hasClass('display-none')) {
        $('.mini-cart-modal').removeClass('display-none');
        $('body').addClass('overflow-hidden');
        $('.mini-cart__list').load(location.href + " .mini-cart__list"); //Refreshes mini-cart side drawer
    } else {
        $('.mini-cart-modal').addClass('display-none');
        $('body').removeClass('overflow-hidden');
    }
});

//Disables bubbling to modal content's parent elements for cart side drawer
$('.mini-cart').click(function(e) {
    e.stopPropagation();
});

// Hide cart side-drawer 
$('.mini-cart__close').click(function(){
    $('.mini-cart-modal').addClass('display-none');
    $('body').removeClass('overflow-hidden');
});
$('.mini-cart-modal').click(function(){
    $('.mini-cart-modal').addClass('display-none');
    $('body').removeClass('overflow-hidden');
});

// Adds or Subtracts 1 from Item Quantity on Cart page when user clicks on '+' or '-'. Minimum quantity is '1'
$(".line-item__qty-btn").click(function(){
    let itemQuantityInput = $(this).closest('.line-item__info--secondary').find('.line-item__itemQuantityInput');
    let variantId = $(this).closest('.line-item__info').find('.variant-id').val();
    let totalPrice = $(this).closest('.line-item__info').find('.line-item__price');
    let currentQuantityInt = parseInt(itemQuantityInput.val());
    let $this = $(this)
    // Display loader when item quantity is changed on cart page
    $(this).closest('.line-item__info--secondary').find('.mini-cartload').show();
    $(this).closest('.line-item__info--secondary').find('.line-item__price').hide();

    function removeCartLoader() {
        $this.closest('.line-item__info--secondary').find('.line-item__price').show();
        $this.closest('.line-item__info--secondary').find('.mini-cartload').hide(); //Hides loader
    }

    if ($(this).hasClass('add')) {
        if (currentQuantityInt >= 99) {
            currentQuantityInt = 99;
        } else {
            currentQuantityInt++
        }
    } else if (currentQuantityInt <= 1) {
        currentQuantityInt = 1;
    } else {
        currentQuantityInt--
    }
    itemQuantityInput.val(currentQuantityInt);

    let data = {
        quantity: currentQuantityInt,
        id: variantId
    }

    $.ajax({
        url: '/cart/change.js',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(cartData) {
            for (i = 0; i < cartData.items.length; i++) {
                if (cartData.items[i].id == variantId) {
                    let dataPrice = cartData.items[i].final_line_price.toString(); //Converts line item price integer to string
                    let dataPriceFormat = dataPrice.substring(0,dataPrice.length-2)+"."+dataPrice.substring(dataPrice.length-2); //Formats line item string to account for cents
                    let totalLinePrice = currency.format(dataPriceFormat); //Formats line item string to currency
                    totalPrice.html(totalLinePrice);
                    $('.mini-cart__cart-quantity').html(cartData.item_count);
                    let dataTotalPrice = cartData.items_subtotal_price.toString(); //Converts total order price integer to string
                    let dataTotalPriceFormat = dataTotalPrice.substring(0,dataTotalPrice.length-2)+"."+dataTotalPrice.substring(dataTotalPrice.length-2); //Formats total order string to account for cents
                    let totalOrderPrice = currency.format(dataTotalPriceFormat); //Formats total order string to currency
                    $('.mini-cart__subtotal').html(totalOrderPrice);
                }
            }
            removeCartLoader();
            updateCart();
        },
        error: function(error) {
            console.log('error', error);
        }
    })
});

//Removes item from cart when 'Remove' is clicked
$('.mini-cart__remove-item').click(function(){
    let variantId = $(this).closest('.line-item__info').find('.variant-id').val();
    let itemRow = $(this).closest('.mini-cart__list-item');
    
    let data = {
        quantity: 0,
        id: variantId
    }
    console.log('data', data);
    $.ajax({
        url: '/cart/change.js',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(cartData) {
            itemRow.next().remove(); //Deletes <hr> for line item
            itemRow.remove();
            updateCart();
            $('.mini-cart__cart-quantity').html(cartData.item_count);
            let dataTotalPrice = cartData.items_subtotal_price.toString(); //Converts total order price integer to string
            let dataTotalPriceFormat = dataTotalPrice.substring(0,dataTotalPrice.length-2)+"."+dataTotalPrice.substring(dataTotalPrice.length-2); //Formats total order string to account for cents
            let totalOrderPrice = currency.format(dataTotalPriceFormat); //Formats total order string to currency
            $('.mini-cart__subtotal').html(totalOrderPrice);
            //If cart is empty: display 'Your cart is empty!'
            if (cartData.item_count == 0) {
                $('.mini-cart__empty').appendTo('.mini-cart__list');
            }
        },
        error: function(error) {
            console.log('error', error);
        }
    })
});