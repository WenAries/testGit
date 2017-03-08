$(document).ready(function () {
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        // console.log(scrollTop);
        $('#header').css('opacity', scrollTop / 200);
    });
    $('#show_table').on('click', function () {
        $('#weather_table').slideToggle();
    });
    $('#show_kqTable').on('click', function () {
        $('#kq_table').slideToggle();
    });
});

