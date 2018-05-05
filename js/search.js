$(document).ready(function () {
    /*Global*/
    dir = "DESC";
    by = "Id";
    count = 6;
    offset = 0;
    type = $("#QueryType")[0].value;
    template = $(".search_el").eq(0).clone();
    $(".search_el")[0].remove();
    AddContent();
    $(".infinite_scroll_but")[0].formAction = "";
    /*Global*/
});

function AddContent()
{
    AllWaifu.AjaxHelper.Search(type, count, offset, by, dir,
        function (result) {
            var elements = JSON.parse(result);
            if ((elements.length == 0) && (offset == 0))
            {
                $(location).attr('href', 'Error.aspx?error=NotFound');
            }
            elements.forEach(function (el, i, elements) {
                formated = FillTemplate(el);
                $(".search_els")[0].append(formated[0]);
            });
            offset += elements.length;
            if (elements.length == 0)
            {
                $(".infinite_scroll_but").hide();
            }
        },
        function (error) {
             console.log(error);
        });
}
function Sort(t = "")
{
    
    if ($("#PopularRadio" + t)[0].checked)
    {
        by = "Popularity";
    }
    if ($("#NewRadio" + t)[0].checked) {
        by = "New";
    }
    if ($("#AlphRadio" + t)[0].checked) {
        by = "Name";
    }
    if ($("#AscRadio" + t)[0].checked) {
        dir = "ASC";
    }
    if ($("#DescRadio" + t)[0].checked) {
        dir = "DESC";
    }
    $(".search_el").toArray().forEach(function (el, i) { el.remove(); });
    offset = 0;
    AddContent();
}
function FillTemplate(el) {
    temp = template.clone();
    temp.find(".search_el_img img")[0].src = el["Image"];
    temp.find(".search_el_img a")[0].href = "Waif.aspx?id=" + el["Id"];
    temp.find(".search_el_type")[0].innerText = el["Type"];
    temp.find(".search_el_name span")[0].dataset.hover = el["Name"];
    temp.find(".search_el_name span")[0].innerText = el["Name"];
    temp.find(".search_el_name")[0].href = "Waif.aspx?id=" + el["Id"];
    return temp;
}