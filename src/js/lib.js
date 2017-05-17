'use strict';

let Portfolio = {
    namespace (name) {
        let parts = name.split('.');
        let ns = this;

        for (let i = 0, len = parts.length; i < len; i++) {
            ns[parts[i]] = ns[parts[i]] || {};
            ns = ns[parts[i]];
        }

        return ns;
    }
};


Portfolio.namespace('Utils').cookies = (function() {

    /**
     * Get the specified cookie from its name of undefined
     * @param  {string}   name An optional cookie's name
     * @return {string || undefined}  Returns the value of the intended cookie
     *                      or undefined
     */

    const get = function(name) {

        let decodedCookie = decodeURIComponent(document.cookie);
        let cookies = decodedCookie.split(';');

        let cookiesMap = cookies.reduce((map, curr) => {

            let parts = curr.split('=');

            map.set(parts[0].trim(), parts[1]);

            return map;

        }, new Map());


        return cookiesMap.get(name);
    };


    return {
        get: get
    };
})();

Portfolio.namespace('Utils').Obj = (function() {

    /**
     * Check if the provided argument is a Function
     * @param  {Function}   func A function
     * @return {Boolean}      true if the argument passed in is a Function
     *                        false otherwise
     */

    const isFunc = func => typeof( func ) === 'function';


    /**
     * Convert an Object List to an Array
     * @param  {Object}   list An Object list
     * @return {Array}
     */

    const toArr = list => Array.from( list );


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

    const getBody = function() {
        let body;
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
     * @param  {String}   parent   An optional parent Node
     * @return {Node}      An HTML node element
     */

    const $ = (selector, parent) => (parent || document).querySelector(selector);


    /**
     * A shorthand of the document.querySelectorAll method
     * @param  {String}   selector A valid CSS selector
     * @param  {String}   parent   An optional parent Node
     * @return {Node}      An HTML node List
     */

    const $$ = (selector, parent) => (parent || document).querySelectorAll(selector);

    /**
     * Get the closest matching element up the DOM tree.
     * @param  {Element} elem     Starting element
     * @param  {String}  selector Selector to match notwithstanding
     * @return {Boolean|Element}  Returns null if not match found
     */
    const getClosest = function ( elem, selector ) {

        // When elem is a Text node, get its parent node
        if (elem.nodeType === 3) {
            elem = elem.parentNode;
        }

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (i >= 0 && matches.item(i) !== this) {
                        --i;
                    }
                    return i > -1;
                };
        }

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) {
                return elem;
            }
        }

        return null;

    };

    /**
     * Get an element's distance from the top of the page
     * @param  {Node}   elem The element
     * @return {Number}      Distance from the of the page
     */
    const getElemDistance = function( elem ) {
        let location = 0;
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
    const getComputed = element => property => {
        return window.getComputedStyle(element, null).getPropertyValue(property);
    };


    return {
        getBody: getBody,
        $: $,
        $$: $$,
        getClosest: getClosest,
        getElemDistance: getElemDistance,
        getComputed: getComputed
    };
})();

Portfolio.namespace('Utils').Window = (function() {

    /**
     * Give ViewPort Info (height and width)
     * @param {Object}
     */

    function getViewPortInfo() {

        let body = Portfolio.namespace('Utils').Dom.getBody();
        let w = Math.max(body.clientWidth, window.innerWidth || 0);
        let h = Math.max(body.clientHeight, window.innerHeight || 0);

        return {
            width: w,
            height: h
        };
    }

    return {
        viewPort: getViewPortInfo
    };
})();

Portfolio.namespace('Animation').easings = (() => {

    let easings = {
        'linear': t => {
            return t;
        },
        'easeInQuad': t => {
            return t * t;
        },
        'easeOutQuad': t => {
            return t * (2 - t);
        },
        'easeInOutQuad': t => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        'easeInCubic': t => {
            return t * t * t;
        },
        'easeOutCubic': t => {
            return (--t) * t * t + 1;
        },
        'easeInOutCubic': t => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        'easeInQuart': t => {
            return t * t * t * t;
        },
        'easeOutQuart': t => {
            return 1 - (--t) * t * t * t;
        },
        'easeInOutQuart': t => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        'easeInQuint': t => {
            return t * t * t * t * t;
        },
        'easeOutQuint': t => {
            return 1 + (--t) * t * t * t * t;
        },
        'easeInOutQuint': t => {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };

    /**
     * Get an easing function
     * @param  {String}   The easing function's name you are looking for
     * @return {Function} The easing function (if any) or linear (default)
     */

    const getEasing = (easing = 'linear') => easings[easing];


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

    let scrollTo = function( element, options, callback ) {
        options = options || {};
        const obj = Portfolio.namespace('Utils').Obj;
        const dom = Portfolio.namespace('Utils').Dom;
        const easings = Portfolio.namespace('Animation').easings;

        let body = dom.getBody();
        let start = body.scrollTop;
        let startTime = Date.now();
        let destination = dom.getElemDistance( element );
        let easing = options.ease;
        let duration = options.duration || 200;


        function scroll() {
            let now = Date.now();
            let time = Math.min(1, ((now - startTime) / duration));
            let timeFunction = easings(easing)(time);

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