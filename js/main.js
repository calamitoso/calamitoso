
window.calamitoso = window.calamitoso || {};

calamitoso.ui = function($){

    'use strict';

    //private members
    var ns      = calamitoso.ui || {},
        cache   = {
            'mainNav'           : $('.main-nav'),
            'mainNavItems'      : $('.main-nav-item')
        },
        touchEnabled = ( 'ontouchstart' in window || 'onmsgesturechange' in window );

    //public members
    ns.getTouchEnabled = function(){
        return touchEnabled;
    };

    //main navigation module
    (function(){

        //private members
        var _isHome = false,
            toggle = function(){
                _isHome = !_isHome;

                if(_isHome){
                    //send to center
                    cache.mainNav.removeClass('main-nav-is-parked');
                }else{
                    //park on the side
                    cache.mainNav.addClass('main-nav-is-parked');
                }
            };

        //public members
        ns.mainNav = {};

        // ns.mainNav.setIsHome = function(value){
        //     _isHome = Boolean(value);
        //     return _isHome;
        // };

        // var onItemClick = function(e){
        //     calamitoso.ui.mainNav.toggle();
        //     e.preventDefault();
        // };

        //expose nav init
        ns.mainNav.init = function(){

            //set initial main nav state
            _isHome = true;

            //attach event listeners to buttons
            cache.mainNavItems.on('click', function(e){

                if( calamitoso.ui.getTouchEnabled() ){
                    //hijack hover actions
                   //$(this).addClass('main-nav-item-no-hover');
                }else{
                    toggle();
                }

                e.preventDefault();
            });


        }

        // ns.mainNav.toggle = function(){

        //     _isHome = !_isHome;

        //     if(_isHome){
        //         //send to center
        //         cache.mainNav.removeClass('main-nav-is-parked');
        //     }else{
        //         //park on the side
        //         cache.mainNav.addClass('main-nav-is-parked');
        //     }
        // };

    }());

    //app initialization module
    (function(){

        //private memebers
        var _init = function(){
            //append capabilities classes
            var className = calamitoso.ui.getTouchEnabled() ? 'touch' : 'no-touch';
            $('html').addClass(className);
            //initialize main nav module
            calamitoso.ui.mainNav.init();
            //unregister init function
            delete calamitoso.ui.init;
        }

        //public members
        //expose init method
        ns.init = function(){
            _init();
        };

    }());

    return ns;

}(jQuery);


$(function() {

    //testing overwrite
    // calamitoso.ui.getTouchEnabled = function(){
    //     return true;
    // };

    calamitoso.ui.init();
    console.log(calamitoso);
});


