$(function(){

  // chat page - calc fluid height layout
  setInterval(function(){
    var
      windowHeight = $(window).innerHeight(),
      boardHeaderHeight = $(".boardHeader").innerHeight(),
      boardFooterHeight = $(".boardFooter").innerHeight(),
      boardMessagesHeight = windowHeight - boardHeaderHeight - boardFooterHeight;
    $(".boardMessages").innerHeight(boardMessagesHeight);
  }, 50);

  // autoselect searchbox content when clicked
  $(".search-container input").on("click", function () {
    $(this).select();
  });

  // autoselect link when clicked
  $(".link-container input").on("click", function () {
    $(this).select();
  });

  // submenu panel togglers
  $("[for-panel]").click(function(){
    var target = $(this).attr("for-panel");
    $(".gui-slidePanel").removeClass("active");
    $(target).addClass("active").slideDown();

    // temporarily hide bottom bar
    $(".boardFooter").height(0);
  });

  // auto close panel when user clicks outside
  $(document).mouseup(function (e){
    var container = $(".gui-slidePanel.active");
    if (!container.is(e.target)
    && container.has(e.target).length === 0) {
      container.removeClass("active");

      // restore bottom bar
      $(".boardFooter").css("height","auto");
    }
  });

});
