'use strict';

var Portfolio = {
    namespace: function (name) {
        var parts = name.split('.');
        var ns = this;

        for (var i = 0, len = parts.length; i < len; i++) {
            ns[parts[i]] = ns[parts[i]] || {};
            ns = ns[parts[i]];
        }

        return ns;
    }
};

Portfolio.namespace('Utils').Obj = (function() {

    /**
     * Check if the provided argument is a Function
     * @param  {Function}   func A function
     * @return {Boolean}      true if the argument passed in is a Function
     *                        false otherwise
     */

    var isFunc = function( func ) {
        return typeof( func ) === 'function';
    };

    /**
     * Convert an Object List to an Array
     * @param  {Object}   list An Object list
     * @return {Array}
     */

    var toArr = function ( list ) {
        return [].slice.call( list );
    };

    return {
        isFunc: isFunc,
        toArr: toArr
    };
})();

Portfolio.namespace('Utils').Dom = (function() {

    /**
     * Return document.documentElement for Chrome and Safari, document.body otherwise
     * @return {Node}      document.documentElement or document.body
     */

    var getBody = function() {
        var body;
        document.documentElement.scrollTop += 1;
        body = ( document.documentElement.scrollTop !== 0 ) ?
                                  document.documentElement  :
                                  document.body;
        document.documentElement.scrollTop -= 1;
        return body;
    };

    /**
     * A shorthand of the document.querySelector method
     * @param  {String}   selector A valid CSS selector
     * @return {Node}      An HTML node element
     */

    var $ = function( selector ) {
        return document.querySelector( selector );
    };

    /**
     * Get an element's distance from the top of the page
     * @param  {Node}   elem The element
     * @return {Number}      Distance from the of the page
     */
    var getElemDistance = function( elem ) {
        var location = 0;
        if ( elem.offsetParent ) {
            do {
                location += elem.offsetTop;
                elem = elem.offsetParent;
            } while ( elem );
        }
        return location >= 0 ? location : 0;
    };

    /**
     * Get  the values of all the CSS properties of an element after applying
     * the active stylesheets
     * @param  {Node}   element The element for which to get the computed style
     * @return {CSSStyleDeclaration }
     */
    var getComputed = function(element) {
        return function(property) {
            return window.getComputedStyle(element, null).getPropertyValue(property);
        };
    };

    return {
        getBody: getBody,
        $: $,
        getElemDistance: getElemDistance,
        getComputed: getComputed
    };
})();

Portfolio.namespace('Utils').Window = (function() {

    var body = Portfolio.namespace('Utils').Dom.getBody();
    var w = Math.max(body.clientWidth, window.innerWidth || 0);
    var h = Math.max(body.clientHeight, window.innerHeight || 0);

    return {
        viewPort: {
            width: w,
            height: h
        }
    };
})();

Portfolio.namespace('Animation').easings = (function() {

    var easings = {
        'linear': function(t) {
            return t;
        },
        'easeInQuad': function(t) {
            return t * t;
        },
        'easeOutQuad': function(t) {
            return t * (2 - t);
        },
        'easeInOutQuad': function(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        'easeInCubic': function(t) {
            return t * t * t;
        },
        'easeOutCubic': function(t) {
            return (--t) * t * t + 1;
        },
        'easeInOutCubic': function(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        'easeInQuart': function(t) {
            return t * t * t * t;
        },
        'easeOutQuart': function(t) {
            return 1 - (--t) * t * t * t;
        },
        'easeInOutQuart': function(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        'easeInQuint': function(t) {
            return t * t * t * t * t;
        },
        'easeOutQuint': function(t) {
            return 1 + (--t) * t * t * t * t;
        },
        'easeInOutQuint': function(t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };

    /**
     * Get an easing function
     * @param  {String}   The easing function's name you are looking for
     * @return {Function} The easing function (if any) or linear (default)
     */

    var getEasing = function(easing) {
        return easings[easing] ? easings[easing] : easings['linear'];
    };

    return getEasing;
})();

Portfolio.namespace('Animation').scrolling = (function() {

    /**
     * Scroll the window to the element position
     * @param  {Node}   element An HTML node towards which you wish to scroll
                                the window
     * @param  {Object}  options Animation's options (easing type and duration)
     * @param {Function} callback An optional callback
     */

    var scrollTo = function( element, options, callback ) {
        options = options || {};
        var obj = Portfolio.namespace('Utils').Obj;
        var dom = Portfolio.namespace('Utils').Dom;
        var easings = Portfolio.namespace('Animation').easings;
        var body = dom.getBody();
        var start = body.scrollTop;
        var startTime = Date.now();
        var destination = dom.getElemDistance( element );
        var easing = options.ease;
        var duration = options.duration || 200;


        function scroll() {
            var now = Date.now();
            var time = Math.min(1, ((now - startTime) / duration));
            var timeFunction = easings(easing)(time);

            body.scrollTop = ( timeFunction * (destination - start) ) + start;

            if ( Math.ceil(body.scrollTop) === destination ) {
                if ( obj.isFunc(callback) ) {
                    callback();
                }

                return;
            }
            requestAnimationFrame( scroll );
        }
        scroll();
    };

    return {
        scrollTo: scrollTo
    };
})();