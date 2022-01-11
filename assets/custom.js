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
$(".product__quantity p").click(function(e){
    let currentQuantityInt = parseInt($('#orderQuantity').val());
    if ($(e.target).hasClass('add')) {
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

//POST product data when 'Add to cart' is clicked
$('.product-form').on('submit', function(e) {
    e.preventDefault();
    console.log('$(this).serialize()', $(this).serialize());
    $('.addToCartBtn').text('ADDED!') //Changes button text to 'Added!'
    $.ajax({
        url: '/cart/add.js',
        type: 'POST', // GET, POST, PUT, DELETE (CRUD): Create, Read, Update, Delete
        dataType: 'json',
        data: $('.product-form').serialize(), // === {quantity: 1}
        success: function() {
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
$(".item__quantity p").click(function(e){
    let itemQuantityInput = $(this).closest('.quantity-input').find('.itemQuantityInput');
    let variantId = $(this).closest('.quantity-container').find('.variant-id').val();
    let totalPrice = $(this).closest('.line-item').find('.final-price');
    let currentQuantityInt = parseInt(itemQuantityInput.val());
    if ($(e.target).hasClass('add')) {
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
        success: function(itemData) {
            for (i = 0; i < itemData.items.length; i++) {
                if (itemData.items[i].id == variantId) {
                    let dataPrice = itemData.items[i].final_line_price.toString(); //Converts integer to string
                    let dataPriceFormat = dataPrice.substring(0,dataPrice.length-2)+"."+dataPrice.substring(dataPrice.length-2); //Formats string to account for cents
                    let totalLinePrice = currency.format(dataPriceFormat); //Formats string to currency
                    totalPrice.html(totalLinePrice);
                }
            }
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
    console.log('remove')
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
        success: function() {
            itemRow.remove();
            updateCart();
        },
        error: function(error) {
            console.log('error', error);
        }
    })
});

// Trash can on click
// let quantity = get quantity from html
// let variant id = get variant id from html
// form data object (let data = {"quantity": quantity, "id": variantid})
// POSt call to /cart/changes.js 
// After success: update Total price, update cart quantity count in header, remove the product row