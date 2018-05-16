$(document).ready(function () {
    var genSign = generateSignature;
    $("#LoadImage").click(function () {
        cloudinary.openUploadWidget({
            cloud_name: 'shingami322', upload_preset: 'anime', cropping: 'server',
            cropping_aspect_ratio: 16 / 9, multiple: false, min_image_height: 576, min_image_width: 1024,
            folder: 'waifu', cropping_show_dimensions: 'true', thumbnails: '.profile_popup_thumb img',
            sources: ["local", "url", "image_search"], api_key: '245454634769229',
            google_api_key: "AIzaSyD8DZ42GEobNYL_lKlLFhKvwJ2GaQzkdKI", upload_signature: genSign
        },
            function (error, result) {/*console.log(error, result)*/ });
    });
    $(document).on('cloudinarywidgetsuccess', function (e, data) {
        $(".profile_popup_thumb img")[0].src = data[0].url;
        AddUrlToCache(data[0].url);
    });
});

ned_close = true;
anime = null;
anime_suc = true;
profile_copy = $(".profile_anime_popup").clone();

$("#AnimeTitle").blur(CheckAnime);
function generateSignature(callback, params) {
    //console.log(params);
    AllWaifu.AjaxHelper.CreateCloudinarySignature(params,
        function (result) {
            //console.log(result);
            callback(result);
        },
        function (error) {
            // console.log(error);
        });
}
function AddUrlToCache(url) {
    var surl = url.slice(url.lastIndexOf("/") + 1, -4);
    //console.log(surl);
    AllWaifu.AjaxHelper.AddUrlToCache(surl,
        function (result) {/* console.log(result) */ }, function (error) {/*console.log(error)*/ });
}

$(".profile_anime_popup").click(function () {
    if (ned_close) {
        $(".profile_anime_cont").fadeOut();
    }
    ned_close = true;
}).children().click(function() { ned_close = false;});

function AnimeEl()
{
    this.image = "images/none2.png";
    this.name = "";
    this.url = "";
    this.description = "";
}
function CheckPopupValidity()
{
    var res = true;
    $(".profile_anime_cont").find("textarea").toArray().forEach(
        function (i) {
            res = i.checkValidity();
        }
    );
    return res && anime_suc;
}
function CheckAnime()
{
    AllWaifu.AjaxHelper.AnimeExist($("#AnimeTitle")[0].value,
        function (res) {
            if (res) { $("#AnimeTitle")[0].setCustomValidity("Это аниме уже есть!"); anime_suc = false;} else
            { $("#AnimeTitle")[0].setCustomValidity(""); anime_suc = true; }
        }, function (err) { console.log(err); }
    );
}
function SendAnime()
{
    if (CheckPopupValidity() && anime_suc) {
        anime = new AnimeEl();
        anime.name = $("#AnimeTitle")[0].value;
        anime.image = $(".profile_popup_thumb img")[0].src;
        anime.url = $("#AnimeUrl")[0].value;
        anime.description = $("#AnimeDesc")[0].value;
        AllWaifu.AjaxHelper.AddAnimeToBase(anime,
            function (res) { console.log(res) }, function (err) { console.log(err) }
        );
        $(".profile_anime_cont").fadeOut();
    }
}
/**************************************************************************
Submit off, remember please*/
$("form").submit(function (e) {
    e.preventDefault();
});
/***************************************************************************/