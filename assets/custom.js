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