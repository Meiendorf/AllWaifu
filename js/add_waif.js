public_id = null;
$(document).ready(function () {
    if (rofl != "")
    {
        RestorePage();
    }
    waif = new waifFacade();
    //"Violet_amazed_swtwqk";
    waifImage = "images/none.png";
    var genSign = generateSignature;
    
    $("#LoadImage").click(function () {
        if (public_id != null) {
            cloudinary.openUploadWidget({
                cloud_name: 'shingami322', upload_preset: 'waifu', cropping: 'server',
                cropping_aspect_ratio: 16 / 9, multiple: false, min_image_height: 576, min_image_width: 1024,
                folder: 'waifu', public_id: public_id, cropping_show_dimensions: 'true', thumbnails: '.load_image',
                sources: ["local", "url", "image_search"], api_key: '245454634769229',
                google_api_key: "AIzaSyD8DZ42GEobNYL_lKlLFhKvwJ2GaQzkdKI", upload_signature: genSign
            },
                function (error, result) {/*console.log(error, result)*/ });
        }
        else {
            cloudinary.openUploadWidget({
                cloud_name: 'shingami322', upload_preset: 'waifu', cropping: 'server',
                cropping_aspect_ratio: 16 / 9, multiple: false, min_image_height: 576, min_image_width: 1024,
                folder: 'waifu', cropping_show_dimensions: 'true', thumbnails: '.load_image',
                sources: ["local", "url", "image_search"], api_key: '245454634769229',
                google_api_key: "AIzaSyD8DZ42GEobNYL_lKlLFhKvwJ2GaQzkdKI", upload_signature: genSign
            },
                function (error, result) {/*console.log(error, result)*/ });
        }
    });

    $(document).on('cloudinarywidgetsuccess', function (e, data) {
        $("#ThumbImage")[0].src = data[0].url;
        public_id = data[0].public_id.slice(6);
        waifImage = data[0].url;
        AddUrlToCache(data[0].url);
    });

});
function AddUrlToCache(url) {
    var surl = url.slice(url.lastIndexOf("/") + 1, -4);
    //console.log(surl);
    AllWaifu.AjaxHelper.AddUrlToCache(surl,
        function (result) {/* console.log(result) */}, function (error) {/*console.log(error)*/ });
}
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

fieldChapterExample = $(".description_chapter").eq(0).parent().clone();
textChapterExample = $(".description_chapter").eq(1).parent().clone();

$(".men_but").click(function(){
    $(".desk_menu").slideToggle();
});

function fclick() {
    var lastRow = $(this).parent().parent().parent().find('.desc_field_row').eq(-1);
    var newRow = lastRow.clone();
    newRow.find('.desc_field_text').val('');
    newRow.find('.field_input').val('');
    newRow.find(".delete_el_but").click(deleteButtonClick)
    lastRow.after(newRow);
}
$('.field_but').click(fclick);


$('.delete_el_but').click(deleteButtonClick);


function waifField(name, value) {
    this.name = name;
    this.value = value;
}
function waifChapter(name, type) {
    this.name = name;
    this.type = type;
    this.fields = [];
    this.add = function (name, value) {
        this.fields.push(new waifField(name, value));
    }
}
function waifFacade() {
    this.id = -1;
    this.confirmed = "-1";
    this.name = "";
    this.author = "";
    this.anime = "";
    this.chapters = [];
    this.tags = "";
    this.imageName = "";
    this.addChapter = function (chapter) {
        this.chapters.push(chapter);
    }
}
function sendWaifToServer() {
    if (waif != null) {
        AllWaifu.AjaxHelper.AddWaifToBase(waif,
            function (result) {
                console.log(result);
            },
            function (error) {
                console.log(error);
            });
    }
}
function parsePageToWaifuXml() {
    var all = $(".description_chapter");
    waif = new waifFacade();
    if (rofl != "")
    {
        waif.id = rofl.Id;
        waif.confirmed = rofl.Confirmed;
    }
    waif.imageName = waifImage;
    waif.author = userName;
    waif.name = $("#WaifName")[0].value;
    waif.anime = $("#AnimeName")[0].value;
    var i;
    for (i = 0; i < all.length-1; i++){
        var val = all.eq(i);

        var title = val.find(".desc_title");
        var select = title.find(".desc_select")[0].value;
        var name = title.find(".field_input")[0].value;
        var chapter = new waifChapter(name, select);

        var rows = val.find(".desc_field_row");
        for (var j = 0; j < rows.length; j++) {
            var row = rows.eq(j);
            var _field = row.find(".field_input");
            var field = "";
            if (_field.length > 0) {
                field = _field[0].value;
            }
            var text = row.find(".desc_field_text")[0].value;
            chapter.add(field, text);
        }
        waif.addChapter(chapter);
        
    }
    var tags = all.eq(i).find(".desc_field_text")[0].value;
    waif.tags = tags;
    waif.imageName = $("#ThumbImage")[0].src;
    if (waif.imageName.slice(-8) == "none.png")
    {
        waif.imageName = "images/none.png";
    }
}
function acceptWaifu()
{
    parsePageToWaifuXml();
    waif.confirmed = "1";
    sendWaifToServer();
}

function checkFormValidation() {
    var res = true;
    $.each($("textarea"), function (i, val) {
        if (!val.checkValidity()) {
            res = false;
            return;
        }
    });
    if (res) {
        $.each($("input"), function (i, val) {
            if (!val.checkValidity()) {
                res = false;
                return;
            }
        });
    }
    return res;
}
function deleteGrandGrandFather(el){
    el.parent().parent().parent().fadeOut(function(){
        $(this).remove();
    });
}
function addNewChapter(type){
    var newChapter = null;
    if(type=="field"){
        newChapter = fieldChapterExample.clone();
        newChapter.find(".field_add_but").click(fclick);
    }
    else{
        newChapter = textChapterExample.clone();
    }
    newChapter.find(".delete_el_but").click(deleteButtonClick);
    $(".description_chapter").eq(-2).parent().after(newChapter.fadeIn());
}
function RestorePage() {
    $("#WaifName")[0].value = rofl.Name;
    $("#AnimeName")[0].value = rofl.Anime;
    $("#ThumbImage")[0].src = rofl.Image;
    if (rofl.Image != "images/none.png")
    {
        var img = rofl.Image;
        var ind = img.lastIndexOf('/') + 1;
        if (ind == - 1)
        {
            ind = 0;
        }
        public_id = img.slice(ind, -4);
        //console.log(public_id);
    }
    var bioExm = textChapterExample.clone();
    var fieExm = fieldChapterExample.clone();
    fieExm.find(".desc_field_row")[0].remove();
    fieExm.find(".desc_field_row")[0].remove();
    fieExm.find(".field_add_but").click(fclick);

    $(".description_chapter")[0].remove();
    var chapters = rofl.Chapters;
    rofl.Chapters.forEach(function (chapter, i, chapters) {
        chapt_ex = null;
        var type = "";
        if ((chapter.Elements.length == 1) && (chapter.Elements[0].Title == ""))
        {
            chapt_ex = bioExm.clone();
            type = "bio";
        }
        if (chapt_ex == null)
        {
            chapt_ex = fieExm.clone();
            chapt_ex.find(".field_add_but").click(fclick);
            type = "ex";
        }
        chapt_ex.find(".waif_cont_title").find(".field_input")[0].value = chapter.Title;
        var valie = 0;
        switch (chapter.SizeCssClass)
        {
            case "col-md-12":
                valie = 1;
                break;
            case "col-md-6":
                valie = 0.5;
                break;
            case "col-md-4":
                valie = 0.3;
                break;
        }
        chapt_ex.find(".desc_select")[0].value = valie;
        var elements = chapter.Elements;
        if (type == "ex"){
            elements.forEach(function (el, i, elements) {
                if (i != 0) {
                    chapt_ex.find(".field_add_but").trigger("click");
                }
                var first = chapt_ex.find(".desc_field_row").eq(-1);
               
                first.find(".desc_field_text")[0].value = el.Content.trim();
                first.find(".desc_field_title").eq(0).find(".field_input")[0].value = el.Title.trim();
            })
        }
        else
        {
            chapt_ex.find(".desc_field_text")[0].value = elements[0].Content.trim();
        }
        $(".description_chapter").eq(-2).parent().after(chapt_ex);
    });
    tags = "";
    rofl.FormatTags.forEach(function (el, i) {
        tags += el;
        if (i < rofl.FormatTags.length - 1)
        {
            tags += ", ";
        }
    });
    if (rofl.Confirmed != "1")
    {
        tags = rofl.Confirmed;
    }
    $("#TagsInp")[0].value = tags;
    $(".description_chapter")[0].remove();
}
function deleteButtonClick(){
    if($(this).parent()[0].className=="desc_field_content"){
        if ($(this).parent().parent().parent().parent().find('.desc_field_row').length > 1){
            deleteGrandGrandFather($(this));
        }
    }
    else{
        if($(".description_chapter").length > 2){
            deleteGrandGrandFather($(this));
        }
    }
}