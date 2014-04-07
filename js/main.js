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
        var _contentFolder,
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
                _loadSection(_sectionId);
            },
            _loadSection = function(sectionId, fromScroll){

                var _scrollToItem = function(sectionId){
                    //switch off the scroll event listener
                    $(window).off('scroll', _onScroll );
                    //scroll section into view
                    $('body').animate(
                        {scrollTop: $('#' + sectionId).offset().top },
                        250,
                        function(){
                            //restore scroll event listener
                            //todo: why a timeout 
                            setTimeout(function(){
                                $(window).on('scroll', _onScroll );
                            }, 100);
                        }
                    );
                };

                //sanitize params
                fromScroll = fromScroll || false;

                // console.log('--- currentSection', _currentSection);
                // console.log('--- sectionId', sectionId);
                // console.log('--- fromScroll', fromScroll);

                //track current section
                if(_currentSection === sectionId){
                    if(!fromScroll) _scrollToItem(sectionId);
                    return;
                }else{
                    _currentSection = sectionId;
                }

                console.log('*** _loadSection currentSection', _currentSection);

                //turn off currently selected item
                _cache.mainNavLinks.removeClass('main-nav-link-pseudo-hover');

                //turn on requested menu item
                var _selectedItem = $('#main-nav-item-' + sectionId).children('.main-nav-link');
                _selectedItem.addClass('main-nav-link-pseudo-hover');

                //simulate hover on touch devices
                var timeout = ( calamitoso.ui.getTouchEnabled() && !fromScroll) ? 750 : 0;

                //replace page title
                document.title = 'calamitoso.github.io | ' + sectionId;

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

                        if(!fromScroll) _scrollToItem(sectionId);
                    }
                }, timeout);
            },
            _onScroll = function(e){
                var _offsetFromTop = $(this).scrollTop(),
                    _panels = _cache.panels.map(function(){
                        if ($(this).offset().top <= _offsetFromTop) return this;
                    }),
                    _lastSectionId = _panels.last().attr('id');

                _loadSection(_lastSectionId, true);
            };

        //public members
        _ns.mainNav = {};

        //expose nav init
        _ns.mainNav.init = function(options){

            //initialize private vars
            _contentFolder  = options.contentFolder;
            _loadedSections = {};

            //load current section
            _loadSection(_extractSectionId(options.section));

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