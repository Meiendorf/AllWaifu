$(document).ready(function(){
    
    /*for(var i = 0; i<5; i++){
        $(".search_el").after(s_el.clone());
    }
    */
    $('.mainp_els').owlCarousel({
        loop : true,
        nav : false,
        items : 5,
        responsive:{
            0:{
                items: 1
            },
            768 :{
                items : 4
            },
            1300 : {
                items : 5
            },
        }
    });
});