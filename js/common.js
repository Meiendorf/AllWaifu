$(document).ready(function() {

    var slideout = new Slideout({
        'panel': document.getElementById('main_el'),
        'menu': document.getElementById('slideout_menu'),
        'padding': 256,
        'tolerance': 70
      });
    $(".slideout_button").click(function(){
        slideout.toggle();
    })
	try{
		document.getElementById("wcomments").onkeydown = function(){
			var el = this;
			setTimeout(function(){
				el.style.cssText = 'height:auto; padding:3px;';
				el.style.cssText = 'height:' + el.scrollHeight+ 'px';
			 },0);
		}
	}
	catch(e)
	{}

	$(".men_but").click(function(){
		$(".desk_menu").slideToggle();
	});

	var i = 0;
	var isPop = true;

	$(".f_var").click(function(){
		var remClass = "fa-heart-o"
		var addClass = "fa-heart"
		if (i == 1) {
			remClass = [addClass, addClass=remClass][0]
		}
		$(this).removeClass(remClass);
		$(this).addClass(addClass);
		if (i == 1){
			i = 0;
		} else {
			if (isPop){
				popRemove("pop_show", "pop_hide");
				isPop = false;
				setTimeout(popRemove, 2000, "pop_hide", "pop_show");
			}
			i = 1;
		}
	});

	function popRemove(add, remove){
		$(".pop_div").removeClass(remove);
		$(".pop_div").addClass(add);
		isPop = true;
    }
    try {
        $(".dd_menu")[0].style.display = "none";
    } catch(e){
    
    }
     
    $(document).on("click", function (e) {
        try {
            if ($(".dd_menu")[0] != null) {
                var el = e.toElement;
                if ((el.className == "user_dropdown") ||
                    (el.parentElement.className == "user_dropdown") ||
                    (el.parentElement.className == "dd_menu")) {
                    return;
                }
                if ($(".dd_menu")[0].style.display != "none") {
                    $(".dd_menu").fadeOut(200);
                }
            }
        }
        catch (e) {

        }
    });

    $(".user_dropdown").click(function(){
        var el = $(".dd_menu");
        if (el[0] != null) {
            if (el[0].style.display == "none") {
                el.fadeIn(200);
            }
            else {
                el.fadeOut(200);
            }
        }
    });


});
