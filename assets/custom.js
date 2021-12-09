$(".filter__container").click(function(){
    console.log("hello");
    $(this).children().last().toggleClass("display-block");
});