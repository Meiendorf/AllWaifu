$(document).ready(function() {

	comments = document.getElementById("wcomments");
	comments.onkeydown = function(){
		var el = this;
		setTimeout(function(){
			el.style.cssText = 'height:auto; padding:3px;';
			el.style.cssText = 'height:' + el.scrollHeight+ 'px';
		 },0);
	}
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
	//Таймер обратного отсчета
	//Документация: http://keith-wood.name/countdown.html
	//<div class="countdown" date-time="2015-01-07"></div>
	var austDay = new Date($(".countdown").attr("date-time"));
	$(".countdown").countdown({until: austDay, format: 'yowdHMS'});

	//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox();

	//Навигация по Landing Page
	//$(".top_mnu") - это верхняя панель со ссылками.
	//Ссылки вида <a href="#contacts">Контакты</a>
	$(".top_mnu").navigation();

	//Добавляет классы дочерним блокам .block для анимации
	//Документация: http://imakewebthings.com/jquery-waypoints/
	$(".block").waypoint(function(direction) {
		if (direction === "down") {
			$(".class").addClass("active");
		} else if (direction === "up") {
			$(".class").removeClass("deactive");
		};
	}, {offset: 100});

	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$("a.scroll").click(function() {
		$.scrollTo($(".div"), 800, {
			offset: -90
		});
	});

	//Каруселька
	//Документация: http://owlgraphic.com/owlcarousel/
	owl = $(".owl-carousel");
	owl.owlCarousel({
		items : 1,
		loop : true,
		autoHeight : true,
		//autoplay : true,
	});
	owl.on("mousewheel", ".owl-wrapper", function (e) {
		if (e.deltaY > 0) {
			owl.trigger("owl.prev");
		} else {
			owl.trigger("owl.next");
		}
		e.preventDefault();
	});
	$(".next_button").click(function(){
		owl.trigger("next.owl.carousel");
	});
	$(".prev_button").click(function(){
		owl.trigger("prev.owl.carousel");
	});

	//Кнопка "Наверх"
	//Документация:
	//http://api.jquery.com/scrolltop/
	//http://api.jquery.com/animate/
	$("#top").click(function () {
		$("body, html").animate({
			scrollTop: 0
		}, 800);
		return false;
	});
	
	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	/*$("form").submit(function() {
		$.ajax({
			type: "GET",
			url: "mail.php",
			data: $("form").serialize()
		}).done(function() {
			alert("Спасибо за заявку!");
			setTimeout(function() {
				$.fancybox.close();
			}, 1000);
		});
		return false;
	});*/

});
$(window).load(function() {
	owl.trigger("prev.owl.carousel");
	owl.trigger("next.owl.carousel");
	owl.trigger("resize.owl.carousel");
});