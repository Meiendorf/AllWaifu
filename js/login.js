$(document).ready(function () {
    /* SETCUSTOMVALIDITY БПАН */ 
});
loginForm = $(".login_form").clone();
registForm = $(".regist_form").clone();
loginForm.hide();
registForm.hide();
$(".regist_form").remove();

$("#logToRegBut").click(LogToRegClick);
$("#regToLogBut").click(RegToLogClick);

function LogToRegClick() {
    $(".login_form").remove();
    newForm = registForm.clone();
    newForm.find("#regToLogBut").click(RegToLogClick);
    newForm.find("#RegRepeatPass").change(PassRepeatClick);
    newForm.find("#RegLogin").blur(IsLoginInBaseBlur);
    newForm.find("#RegEmail").blur(IsEmailInBaseBlur);
    $(".cool_content").after(newForm);
    $(".regist_form").fadeIn();
}
function IsLoginInBaseBlur() {
    AllWaifu.AjaxHelper.IsLoginInBase($("#RegLogin")[0].value,
        OnLoginValidationComplete, OnLoginValidationError);
}
function IsEmailInBaseBlur() {
    AllWaifu.AjaxHelper.IsEmailInBase($("#RegEmail")[0].value,
        OnEmailValidationComplete, OnLoginValidationError);
}
function OnEmailValidationComplete(result) {
    if (result) {
        $get("RegEmail").setCustomValidity("Эта почта уже занята!");
    }
    else {
        $get("RegEmail").setCustomValidity('');
    }
}
function OnLoginValidationComplete(result) {
    if (result) {
        $get("RegLogin").setCustomValidity("Этот логин уже занят!");
    }
    else {
        $get("RegLogin").setCustomValidity('');
    }
}
function OnLoginValidationError(error){
    $get("RegLogin").setCustomValidity("Этот логин уже занят!");
}
function OnLoginValidationError(error) {
    $get("RegEmail").setCustomValidity("Эта почта уже занята!");
}
function PassRepeatClick(){
    if ($("#RegPass")[0].value != $("#RegRepeatPass")[0].value) {
        $get("RegRepeatPass").setCustomValidity('Пароли не совпадают');
    }
    else {
        $get("RegRepeatPass").setCustomValidity('');
    }
}
function RegToLogClick() {
    $(".regist_form").remove();
    newForm = loginForm.clone();
    newForm.find("#logToRegBut").click(LogToRegClick);
    $(".cool_content").after(newForm);
    $(".login_form").fadeIn();
}