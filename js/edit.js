$(document).ready(function () {
    $("#UserName").blur(LoginOnBlur);
    $("#UserName")[0].value = userName;
    $("#UserEmail")[0].value = email;
    $("#UserUrl")[0].value = url;
    $("#UserRName")[0].value = name;
    $("#UserEmail").blur(EmailOnBlur);
    $("#OldPass").blur(PasswordOnBlur);
    $("#RegRepeatPass").change(PassRepeatValidation);
    $("#wcomments")[0].value = description;

    var genSign = generateSignature;

    $("#LoadImage").click(function () {
        cloudinary.openUploadWidget({
            cloud_name: 'shingami322', upload_preset: 'superusers', cropping: 'server',
            cropping_aspect_ratio: 1, multiple: false, min_image_height: 200, min_image_width: 200,
            folder: 'users', public_id: id, cropping_show_dimensions: 'true', thumbnails : '.edit_img',
            sources: ["local", "url", "image_search"], api_key: '245454634769229', 
            google_api_key: "AIzaSyD8DZ42GEobNYL_lKlLFhKvwJ2GaQzkdKI", upload_signature: genSign
        },
            function (error, result) {/*console.log(error, result)*/ });
    });

    $(document).on('cloudinarywidgetsuccess', function (e, data) {
        $("#ThumbImage")[0].src = data[0].url;
        $get("ImageSrc").value = data[0].url;
        //console.log(data);
    });
    
});


function generateSignature(callback, params) {
    AllWaifu.AjaxHelper.CreateCloudinarySignature(params,
        function (result) {
            callback(result);
        },
        function (error) {
            console.log(error);
        });
}

function PassRepeatValidation()
{
    var one = $("#RegPass")[0].value;
    var two = $("#RegRepeatPass")[0].value;
    if (one != two) {
        $get("RegRepeatPass").setCustomValidity("Пароли не совпадают!")
    }
    else {
        $get("RegRepeatPass").setCustomValidity("");
    }
}
function LoginOnBlur() {
    var id = "UserName";
    var msg = "Этот логин уже занят!";
    var temp = $("#"+id)[0].value;
    if (temp != userName) {
        AllWaifu.AjaxHelper.IsLoginInBase(temp,
            function (result) {
                OnValidityComplete(result, msg, id);
            },
            function (error) {
                OnValidityError(msg, id);
            }
        );
    }
    else {
        $get(id).setCustomValidity("");
    }
}
function EmailOnBlur()
{
    var id = "UserEmail";
    var msg = "Эта почта занята!";
    var temp = $("#" + id)[0].value;
    if (temp != email) {
        AllWaifu.AjaxHelper.IsEmailInBase(temp,
            function (result) {
                OnValidityComplete(result, msg, id);
            },
            function (error) {
                OnValidityError(msg, id);
            }
        );
    }
    else {
        $get(id).setCustomValidity("");
    }
}
function PasswordOnBlur(){
    var temp = $("#OldPass")[0].value;
    if (temp != "") {
        AllWaifu.AjaxHelper.IsPassCorrect(userName, temp,
            function (result) {
                OnValidityComplete(result, "Неверный пароль!", "OldPass");
            },
            function (error) {
                OnValidityError("Неверный пароль!", "OldPass");
            }
        );
        $("#RegPass")[0].required = true;
        $("#RegRepeatPass")[0].required = true;
    }
    else {
        $("#RegPass")[0].required = false;
        $("#RegRepeatPass")[0].required = false;
        $get("OldPass").setCustomValidity('');
    }
}
function OnValidityComplete(result, msg, id) {
    if (result) {
        $get(id).setCustomValidity(msg);
    }
    else {
        $get(id).setCustomValidity("");
    }
}
function OnValidityError(msg, id) {
    $get(id).setCustomValidity(msg);
}
