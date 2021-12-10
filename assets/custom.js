//Shows dropdown box for 'Availability' for desktop
$(".filter__container").click(function(){
    const filter__activeContainer = $(this).children().last();
    filter__activeContainer.toggleClass("display-block");
});

//Shows Menu for mobile when 'Filter and Sort' is clicked
$(".filterAndSortBy__label").click(function(){
    $(this).next().find(".activeContainer").toggleClass("display-block");
    $('.filterAndSortBy__backgroundCover').toggleClass("display-block");
});

// Hides Menu for mobile when 'Back' is clicked
$(".activeContainer__backContainer").click(function(){
    $(".activeContainer").toggleClass("display-block");
    $('.filterAndSortBy__backgroundCover').toggleClass("display-block");
})

// Shows 'availablity' drop down for mobile
$(".availability-label").click(function(){
    $(this).next().toggleClass("display-block");
});