(function() {
    'use strict';

    var anim = Portfolio.namespace('Animation').scrolling;
    var dom = Portfolio.namespace('Utils').Dom;
    var $ = dom.$;

    var backToTop = $('#backToTop');
    var toolBarHeight = parseInt(dom.getComputed($('#header'))('height'));

    function handleClick(e) {

        var target = null;
        var element;

        if ( e.target.classList.contains( 'c-navigation__link' ) ||
             e.target.classList.contains( 'c-scroll' )) {
            target = e.target;
        } else if (e.target.parentNode.classList.contains( 'c-scroll' )) {
            target = e.target.parentNode;
        }

        // Make sure a .c-navigation__link or .link--scroll was clicked
        if ( !target ) {
            return;
        }

        e.preventDefault();

        element = $( target.hash );

        anim.scrollTo(element, { ease: 'easeOutCubic', duration: 800 });
    }

    function handleScroll() {

        var viewPort = Portfolio.namespace('Utils').Window.viewPort();
        var body = dom.getBody();
        var isVisible = dom.getComputed(backToTop)('visibility') === true;


        if ( ( body.scrollTop + toolBarHeight > viewPort.height ) &&
                                                       !isVisible &&
                                                    viewPort.width >= '768') {
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.visibility = 'hidden';
        }
    }

    document.addEventListener('scroll', handleScroll, false);

    document.addEventListener('click', handleClick, false);

})();