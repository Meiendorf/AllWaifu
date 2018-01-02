$(document).ready(function() {
    
});

$("#logToRegBut").click(function(){
    $(".login_form").hide();
    $(".regist_form").fadeIn();
});
$("#regToLogBut").click(function(){
    $(".regist_form").hide();
    $(".login_form").fadeIn();
});