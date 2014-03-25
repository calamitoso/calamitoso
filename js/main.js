
window.calamitoso = window.calamitoso || {};

calamitoso.ui = function(){

    'use strict';

    //private vars
    var ns      = calamitoso.ui || {},
        cache   = {
            'mainNav'       : $('.main-nav'),
            'mainNavItems'  : $('.main-nav-item')
        };

    //public vars
    ns.mainNav = {};

    //define functions
    ns.init = function(){

        calamitoso.ui.mainNav.isHome = true;

        cache.mainNavItems.on('click', function(e){
            calamitoso.ui.mainNav.toggle();
            e.preventDefault();
        });
    };

    ns.mainNav.toggle = function(){
        console.log('mainNav toggle');

        console.log(this);

        this.isHome = !this.isHome;

        if(this.isHome){
            //send to center
            cache.mainNav.removeClass('parked');
        }else{
            //park on the side
            cache.mainNav.addClass('parked');
        }

    };

    return ns;

}();


$(function() {
    // $('.main-nav-item').on('click', function(e){
    //     console.log($(this));
    //     e.preventDefault();
    // });
    calamitoso.ui.init();
    console.log(calamitoso);
});


