/* global calamitoso, jQuery, $ */

window.calamitoso = window.calamitoso || {};

(calamitoso.ui = function($){

    'use strict';

    //private members
    var _ns      = calamitoso.ui || {},
        _cache   = {
            'mainNav'           : $('.main-nav'),
            'mainNavLinks'      : $('.main-nav-link')
        },
        _touchEnabled = ( 'ontouchstart' in window || 'onmsgesturechange' in window );

    //public members
    _ns.getTouchEnabled = function(){
        return _touchEnabled;
    };

    //main navigation module
    (function(){

        //private members
        var _isHome,
            _setHomeMode = function(value){
                _isHome = value;
                if(_isHome){
                    //send to center
                    _cache.mainNav.addClass('main-nav-is-home');
                }else{
                    //park on the side
                    _cache.mainNav.removeClass('main-nav-is-home');
                }
            },
            _parseLink = function(link){
                var hash = link.hash.replace('#','');
                if(_isHome || hash === 'home'){
                    _setHomeMode(!_isHome);
                }
            };

        //public members
        _ns.mainNav = {};

        //expose nav init
        _ns.mainNav.init = function(){

            //set initial main nav state
            _setHomeMode(true);

            //attach event listeners to buttons
            _cache.mainNavLinks.on('click', function(e){

                var trigger = $(this);

                if( calamitoso.ui.getTouchEnabled() ){
                    //hijack hover actions
                    trigger.addClass('main-nav-link-pseudo-hover');
                    setTimeout(function(){
                        trigger.removeClass('main-nav-link-pseudo-hover');
                        _parseLink(trigger[0]);
                    }, 500);
                }else{
                    _parseLink(trigger[0]);
                }

            });

        };

    }());

    //app initialization module
    (function(){

        //expose app init
        _ns.init = function(){
            //append capabilities
            var className = calamitoso.ui.getTouchEnabled() ? 'touch' : 'no-touch';
            $('html').addClass(className);
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

    //touch testing overwrite
    // calamitoso.ui.getTouchEnabled = function(){
    //     return true;
    // };

    calamitoso.ui.init();
    console.log(calamitoso);
});


