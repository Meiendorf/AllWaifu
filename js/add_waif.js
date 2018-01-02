$(document).ready(function() {
    
});
fieldChapterExample = $(".description_chapter").eq(0).parent().clone();
textChapterExample = $(".description_chapter").eq(1).parent().clone();

$(".men_but").click(function(){
    $(".desk_menu").slideToggle();
});

$('.field_but').click(function(){
    var lastRow = $(this).parent().parent().parent().find('.desc_field_row').eq(-1);
    var newRow = lastRow.clone();
    newRow.find('.desc_field_text').val('');
    newRow.find('.field_input').val('');
    newRow.find(".delete_el_but").click(deleteButtonClick)
    lastRow.after(newRow);
});


$('.delete_el_but').click(deleteButtonClick);


function deleteGrandGrandFather(el){
    el.parent().parent().parent().fadeOut(function(){
        $(this).remove();
    });
}
function addNewChapter(type){
    var newChapter = null;
    if(type=="field"){
        newChapter = fieldChapterExample.clone();
    }
    else{
        newChapter = textChapterExample.clone();
    }
    newChapter.find(".delete_el_but").click(deleteButtonClick);
    $(".description_chapter").eq(-2).parent().after(newChapter.fadeIn());
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