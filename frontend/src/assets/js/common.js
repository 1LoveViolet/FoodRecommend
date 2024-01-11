$(document).ready(function () {
  var url = window.location.href;
  var url1;
  $(".nav a").each(function () {
    url1 = $(this).attr("href");
    console.log(url1);
    console.log(url);
    console.log($(".nav a"));
    if (url.indexOf(url1.slice(2, url1.length)) != -1) {
      $(this).addClass("active");
    }
    if (url.indexOf("settled-enterprise.html") != -1) {
      console.log("入驻企业");
      $(".nav a").eq(0).addClass("active");
    }
    if (url.indexOf("settled-enterprise-details.html") != -1) {
      console.log("入驻企业");
      $(".nav a").eq(0).addClass("active");
    }
  });
});
var flag = true;
$(".switch").click(function () {
  if (flag) {
    $(".switch").addClass("active");
    $(".nav").show();
    flag = false;
  } else {
    $(".switch").removeClass("active");
    $(".nav").hide();
    flag = true;
  }
});

if ($(window).width() <= 720) {
  $(".nav").hide();
}

$(window).resize(function () {
  //   console.log($(window).width());
  if ($(window).width() <= 720) {
    $(".nav").hide();
  } else {
    $(".nav").show();
    $(".switch").removeClass("active");
  }
});
