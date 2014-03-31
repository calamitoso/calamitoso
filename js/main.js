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
            'panels'            : $('.panel'),
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
                return _isHome;
            },
            _resetMainNavItem = function(hash){
                //turn off currently selected item
                _cache.mainNavLinks.removeClass('main-nav-link-pseudo-hover');
                //turn on requested menu item
                _selectedItem = $('#main-nav-item-' + hash).children('.main-nav-link');
                _selectedItem.addClass('main-nav-link-pseudo-hover');
            },
            _selectedItem,
            _browserTriggeredScroll = false;

        //public members
        _ns.mainNav = {};

        _ns.mainNav.onItemSelection = function(e){

            _selectedItem = $(this);
            //is selected item a link?

            var _hash = _selectedItem[0].hash.replace('#', '');

            _browserTriggeredScroll = true;
            _resetMainNavItem(_hash);

            if( calamitoso.ui.getTouchEnabled() ){
                e.preventDefault();
                //hover simulation
                setTimeout(function(){
                    _resetHomeMode(_hash);
                    document.location.hash = _selectedItem[0].hash;
                }, 750);
            }else{
                _resetHomeMode(_hash);
            }
        };

        //expose nav init
        _ns.mainNav.init = function(){

            var _lastId,
                _documentTitle = document.title;

            //attach event listeners to buttons
            _cache.mainNavLinks.on('click', calamitoso.ui.mainNav.onItemSelection );

            //register scroll listener
            $(window).scroll( function(e){

                //if the scroll event is triggered by a natural link action, exit
                if(_browserTriggeredScroll){
                    _browserTriggeredScroll = false;
                    return;
                }

                var fromTop = $(this).scrollTop();

                var cur = _cache.panels.map(function(){
                    if ($(this).offset().top <= fromTop) return this;
                });

                var id = cur.last().attr('id');
                if( id != _lastId ){
                    _lastId = id;
                    _resetMainNavItem(_lastId);
                    //reset browser history
                    window.history.pushState({'id': id}, id, '#' + id);
                }

            });

            //set initial main nav state
            var hash = document.location.hash.replace('#', '') || 'home';
            _selectedItem = $('#main-nav-item-' + hash).children('.main-nav-link');
            _selectedItem.trigger('click');

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