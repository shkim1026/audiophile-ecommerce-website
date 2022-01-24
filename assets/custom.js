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

// Gives non-carousel images (on the bottom of each Product page) a unique class for styling
let nonCarouselImage = $('.extraImg');
for (i = 0; i < nonCarouselImage.length; i++) {
    $('.extraImg').eq(i).addClass(`additionalImg-${i}`)
};


// Initializes 'Swiper' for Product images
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'vertical',
    loop: true,
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
});