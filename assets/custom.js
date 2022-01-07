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


// Adds or Subtracts 1 from Order Quantity on Product page when user clicks on '+' or '-'. Minimum quantity is '0'
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

$('.product-form').on('submit', function(e) {
    e.preventDefault();
    //
    $.ajax({
        url: '/cart.js',
        type: 'POST', // GET, POST, PUT, DELETE (CRUD): Create, Read, Update, Delete
        dataType: 'json',
        data: $('.product-form').serialize(), // === {quantity: 1}
        success: function(data, status) {
            console.log('data', data)
            // const cartCount = data.cart.items.length
            $('number element').text(cartCount)
            //open cart modal (future)
            // increase cart count in the top right icon
            // set quantity count back to 1
        },
        error: function(error, status) {
            console.log('error', err)
            //show error message
        }
    })
})