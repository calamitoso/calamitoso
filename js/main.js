/* global calamitoso, jQuery, $ */

// if ( !('parseHash' in String.prototype) ) {
//     String.prototype.parseHash = function(link){
//         return link.hash.replace('#', '');
//     }
// }

window.calamitoso = window.calamitoso || {};

(calamitoso.ui = function($){

    'use strict';

    //private members
    var _ns      = calamitoso.ui || {},
        _cache   = {
            'mainNav'           : $('.main-nav'),
            'mainNavLinks'      : $('.main-nav-link')
        },
        _touchEnabled = ( 'ontouchstart' in window || navigator.msMaxTouchPoints);

    //public members
    _ns.getTouchEnabled = function(){
        return _touchEnabled;
    };

    //main navigation module
    (function(){

        //private members
        var _isHome = false,
            _resetHomeMode = function(hash){
                _isHome = ( hash === 'home' ) ? !_isHome : false;
                if(_isHome){
                    //send to center
                    _cache.mainNav.addClass('main-nav-is-home');
                }else{
                    //park on the side
                    _cache.mainNav.removeClass('main-nav-is-home');
                }
            };

        //public members
        _ns.mainNav = {};

        _ns.mainNav.loadSection = function(e){

            var selectedItem = $(this);

            var hash = selectedItem[0].hash.replace('#', '');

             _cache.mainNavLinks.removeClass('main-nav-link-pseudo-hover');
             selectedItem.addClass('main-nav-link-pseudo-hover');

            if( calamitoso.ui.getTouchEnabled() ){
                e.preventDefault();
                //hover simulation
                setTimeout(function(){
                    _resetHomeMode(hash);
                    document.location.hash = selectedItem[0].hash;
                }, 750);
            }else{
                _resetHomeMode(hash);
            }
        }

        //expose nav init
        _ns.mainNav.init = function(){

            //attach event listeners to buttons
            _cache.mainNavLinks.on('click', calamitoso.ui.mainNav.loadSection );

            //set initial main nav state
            var hash = document.location.hash.replace('#', '') || 'home';
            $('#main-nav-item-' + hash).children('.main-nav-link').trigger('click');

        };

    }());

    //app initialization module
    (function(){

        //expose app init
        _ns.init = function(){

            //append touch capability
            var className = calamitoso.ui.getTouchEnabled() ? 'touch' : 'no-touch';
            $('html').addClass(className);

            //initialize 3rd party plugins
            FastClick.attach(document.body);

            //initialize main nav module
            calamitoso.ui.mainNav.init();

            //unregister init function after first use
            delete calamitoso.ui.init;
        };

    }());

    return _ns;

})(jQuery);


$(function() {

    'use strict';

    // touch testing overwrite
    // calamitoso.ui.getTouchEnabled = function(){
    //     return true;
    // };

    calamitoso.ui.init();
    console.log(calamitoso);
});


