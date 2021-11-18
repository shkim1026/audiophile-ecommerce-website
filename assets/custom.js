
// 'Collections list' on hover > 'shop' link changes color
$('.collection-container__inner').hover(function(){
    console.log('hello world');
    $(this).find('.inner__link-text').toggleClass('hover');
});