$(function() {
	
    /* Search bar */
    var $searchBar = $('#Search');
    var $btn = $('.btn');

    $btn.show();
    $searchBar.hide();

    $btn.on('click', function(e) {
        $(this).fadeOut(200);
        $searchBar.fadeIn(400);
        $searchBar.focus();
    });
    $searchBar.on('focusout', function(e) {
        $(this).fadeOut(300);
        $btn.fadeIn(200);
        $searchBar.val('');

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
