/* global calamitoso, jQuery, $ */

window.calamitoso = window.calamitoso || {};

(calamitoso.common = function(){
    var _ns = calamitoso.common || {};
    _ns.getQueryVariable = function(variable){
           var query = window.location.search.substring(1);
           var vars = query.split("&");
           for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){
                    return pair[1];
                }
           }
    };
    return _ns;
}());

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
        var _browserTriggeredScroll,
            _contentFolder,
            _currentSection,
            _loadedSections,
            _extractSectionId = function(source){
                var _sectionId = (source || '').replace('/', '') || 'home',
                    _indexOf = _sectionId.indexOf(_contentFolder);
                if( _indexOf !== -1 ){
                    _sectionId = _sectionId.substring(_indexOf + 8);
                }
                return _sectionId.substr(0, _sectionId.lastIndexOf('.')) || _sectionId;
            },
            _onItemSelection = function(e){

                //take over the link action
                e.preventDefault();

                //extract the requested page name from the link
                var _sectionId = _extractSectionId($(this)[0].pathname);
                console.log('button triggered', _sectionId);
                _loadSection(_sectionId);
            },
            _loadSection = function(sectionId, fromScroll){

                fromScroll = fromScroll || false;

                //turn off currently selected item
                _cache.mainNavLinks.removeClass('main-nav-link-pseudo-hover');

                //turn on requested menu item
                var _selectedItem = $('#main-nav-item-' + sectionId).children('.main-nav-link');
                _selectedItem.addClass('main-nav-link-pseudo-hover');

                //simulate hover on touch devices
                var timeout = ( calamitoso.ui.getTouchEnabled() && !fromScroll) ? 750 : 0;
                // console.log('-- sectionId', sectionId);
                // console.log('-- fromScroll', fromScroll);
                // console.log('-- timeout', timeout);

                //replace page title
                document.title = 'calamitoso.github.io | ' + sectionId;

                console.log('_loadSection', sectionId);

                setTimeout(function(){
                    if( sectionId === 'home' ){
                        //re write history
                        window.history.pushState({'sectionId': sectionId}, sectionId, '/');

                        //add main nav modal
                        _cache.mainNav.addClass('main-nav-is-home');
                    }else{
                        //re write history
                        window.history.pushState({'sectionId': sectionId}, sectionId, '/' + _contentFolder + sectionId + '.html');

                        //remove main nav modal
                        _cache.mainNav.removeClass('main-nav-is-home');

                        //switch off the scroll event listener
                        _browserTriggeredScroll = true;

                        //only load subpages once
                        if(!_loadedSections[sectionId]){
                            $.ajax({
                                url: '/' + _contentFolder + sectionId + '.html',
                                success: function(data){
                                    $('#' + sectionId).html( $(data).find('#' + sectionId).children() );
                                    _loadedSections[sectionId] = $('#' + sectionId);
                                }
                            });
                        }

                        //scroll section into view
                        $('html, body').animate(
                            {scrollTop: $('#' + sectionId).offset().top },
                            200,
                            function(){
                                //restore scroll event listener
                                _browserTriggeredScroll = false;
                            }
                        );
                    }
                }, timeout);
            },
            _onScroll = function(e){

                //if the scroll event is triggered by a natural link action, exit
                if(_browserTriggeredScroll){
                    console.log('ignored', e);
                    return;
                }

                var fromTop = $(this).scrollTop();

                var cur = _cache.panels.map(function(){
                    if ($(this).offset().top <= fromTop) return this;
                });

                var sectionId = cur.last().attr('id');
                if( sectionId !== _currentSection ){
                    _currentSection = sectionId;
                    console.log('scroll triggered', _currentSection);
                    _loadSection(_currentSection, true);
                }
            };

        //public members
        _ns.mainNav = {};

        //expose nav init
        _ns.mainNav.init = function(options){

            //initialize private vars
            _contentFolder  = options.contentFolder;
            _currentSection = _extractSectionId(options.section);
            _loadedSections = {};

            //load current section
            _loadSection(_currentSection);

            //register button event listener
            _cache.mainNavLinks.on('click', _onItemSelection );

            //register scroll listener
            $(window).on('scroll', _onScroll );

        };

    }());

    //app initialization module
    (function(){

        //expose app init
        _ns.init = function(options){

            //append touch capability
            var className = calamitoso.ui.getTouchEnabled() ? 'touch' : 'no-touch';
            $('html').addClass(className);

            //initialize 3rd party plugins
            FastClick.attach(document.body);

            //initialize main nav module
            calamitoso.ui.mainNav.init(options);

            //unregister init function after first use
            delete calamitoso.ui.init;
        };

    }());

    return _ns;

}(jQuery));


$(function() {

    'use strict';

    // touch-testing overwrite
    // calamitoso.ui.getTouchEnabled = function(){
    //     return true;
    // };

    calamitoso.ui.init({
        contentFolder: 'content/',
        section: calamitoso.common.getQueryVariable('section')
    });
    console.log(calamitoso);
});

//
