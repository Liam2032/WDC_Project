$(function() {

    /* Search bar */

    var $searchBar = $('#Search');
    var $btn = $('.btn');

    $btn.show();
    $btn.on('click', function(e) {
        $btn.text('');
        $btn.animate({
            opacity: 0.2,
            left: '+=170'
        }, 300, function() {});
        $searchBar.animate({
            width: '+=190',
            opacity: 1.0,
        }, 300, function() {
            $searchBar.focus();
        });
    });
    $searchBar.on('keypress', function(e) {
        $(this).css("border-color", "rgba(255,255,255,0.9)");
    });

    $searchBar.on('focusout', function(e) {
        $btn.animate({
            opacity: 0.7,
            left: '-=170'
        }, 300, function() {
            $btn.text('Search');
        });
        $searchBar.animate({
            width: '-=190',
            opacity: 0.0,
        }, 300, function() {
            $(this).css("border-color", "rgba(255,255,255,0.3)");
            $searchBar.val('');
        });
    });

    /* Sliding Menu */

    var $menu = $('#side_menu');
    var $menu_toggle = $('#menu_toggle');
    var $menu_close = $('#close_menu');
    var $body = $('#calendar');

    $menu_toggle.on('click', function() {
        $menu.css("left", "0");
        $body.css("margin-left", "250px");
        $body.css("background-color", "rgba(0,0,0,0.5)");
    });
    $menu_close.on('click', function() {
        $menu.css("left", "-600px");
        $body.css("margin-left", "0");
        $body.css("background-color", "rgba(0,0,0,0)");
    });
});
