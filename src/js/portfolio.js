'use strict';


import { Portfolio } from './lib';
import documentReady from './document-ready';


function main() {

    const ANIM = Portfolio.Animation.scrolling;
    const DOM  = Portfolio.Utils.Dom;
    const COOKIES = Portfolio.Utils.cookies;
    const $  = DOM.$;
    const $$ = DOM.$$;

    let isScrolled = true;
    const throttleInterval = 500;
    let lastScrollTop = 0;
    const deltaScroll = 5;

    let isGraphFirstAnimation = true;

    const DOMcache = {
        header: $( '#header' ),
        main: $( ' [role="main"] '),
        backToTop: $( '#backToTop' ),
        sections:  $$( 'main .c-section' ),
        sideMenuMobile:  $( '.c-sideMenu' ),
        sideMenuMobileTrigger: $( '#hamburger__checkbox' ),
        sideMenuDesktop:  $( '.c-sideMenu--desktop' ),
        subMenuTrigger: $( '#subMenu--trigger-1' ),
        projects: $( '#projects' ),
        graphPaths: $$( '.graph__path--front' ),
        card: $( '.c-card' ),
        scrollButton: $( '.c-button--scroll' ),
        randomFactTrigger: $( '#random-fact__Icon'),
        randomFactMsg: $( '#random-fact__span' ),
        welcomeMsgElement: {
            1: $( '#welcomeMsg--1' ),
            2: $( '#welcomeMsg--2' ),
            3: $( '#welcomeMsg--3' ),
            4: $( '#welcomeMsg--4' ),
            5: $( '#welcomeMsg--5' )
        }
    };

    const isLoadingClass = 'is-loading';

    const welcomeMessages = {
        visit2: {
            part1: 'Welcome back',
            part2: '',
            part3: 'I feel like you believe in me...',
            part4: 'isn\'t it<i class="animation__info">?</i>',
            part5: 'That\'s a wonderful thing!'
        }
    };

    const TRIVIA = {
        url: 'https://numbersapi.p.mashape.com/',
        key:'cCRn3ndWPPmshXp3hZ6finUK92HIp10pB2sjsne4SUvAkUkoCz',
        defaultMsg:'I am glad you visited my Portfolio'
    };

    let headerHeight = parseInt(DOM.getComputed(DOMcache.header)('height'));
    let viewPort;
    let body;
    let isLessThanDesktop;



    function getSystemInformation() {
        body = DOM.getBody();
        viewPort = Portfolio.namespace('Utils').Window.viewPort();
        isLessThanDesktop = ( viewPort.width < '1024' ) ? true : false;
    }

    function handleClick(e) {

        let target = null;
        let classL = e.target.classList;
        let element;


        if ( classL.contains( 'c-navigation__link' ) ||
             classL.contains( 'c-sideMenu__link' )   ||
             classL.contains( 'c-scroll' )) {
            target = e.target;
        } else if (e.target.parentNode.classList.contains( 'c-scroll' )) {
            target = e.target.parentNode;
        }

        // Make sure an intended element was clicked
        if ( !target ) {
            return;
        }

        e.preventDefault();

        element = $( target.hash );

        ANIM.scrollTo(element, { ease: 'easeOutCubic', duration: 800 });
    }

    function mobileSideMenuClick(e) {

        e.stopPropagation();

        let targetSelector;
        let targetElement;

        if ( e.target.className === 'c-subMenu__label' ) {
            targetSelector = e.target.getAttribute( 'for' );
            targetElement = $( '.c-tab__label[for="' + targetSelector + '"]' );

            // close the subMenu
            DOMcache.subMenuTrigger.checked = false;
        } else if ( e.target.nodeName === 'A' ) {
            e.preventDefault();
            targetSelector = e.target.getAttribute( 'href' );
            targetElement = $( targetSelector );
        } else {
            return;
        }

        //When the user clicks on links or the Projects'label, close the menu
        if (e.target.nodeName === 'A' || e.target.className === 'c-subMenu__label') {
            DOMcache.sideMenuMobileTrigger.checked = false;
        }

        // Jump to the element
        let delay = window.setInterval( function() {
            Portfolio.Animation.scrolling.scrollTo( targetElement );
            window.clearInterval(delay);
        }, 300);
    }

    function handleCardClick(e) {

        let target = e.target;
        let card = target === DOMcache.card ? target :
                                              DOM.getClosest(target, '.c-card');

        let input = card && card.previousElementSibling || null;

        if (target.nodeName === 'A' || target.parentNode.nodeName === 'A' ) {
            return;
        }

        if ( input ) {
            input.checked = !!!input.checked;
        }

    }

    function showHideScrollUPButton() {

        let buttonVisibility = DOM.getComputed(DOMcache.backToTop)('visibility');
        let isVisible = buttonVisibility && ( buttonVisibility === 'visible' );
        let scrolledValue = body.scrollTop + headerHeight;

        // On mobiles do nothing
        if ( isLessThanDesktop && isVisible ) {
            DOMcache.backToTop.style.visibility = 'hidden';
        } else if ( isLessThanDesktop ) {
            return;
        }

        activateSideMenuItem(scrolledValue);

        /*
         * Prevent the system adds or removes the same classes when unnecessary
         * It does nothing when:
         *
         * The scrolled value is bigger than the Viewport's height and
         * the button is already visible
         *
         * The scrolled value is lower than the Viewport's height and
         * the button is already not visible
         *
         */
        if ( scrolledValue > viewPort.height && isVisible ) {
            return;
        } else if ( scrolledValue < viewPort.height && !isVisible ) {
            return;
        }

        if ( ( scrolledValue > viewPort.height ) ) {
            DOMcache.backToTop.style.visibility = 'visible';
        } else {
            DOMcache.backToTop.style.visibility = 'hidden';
        }
    }

    function showHideHeaderAndSideMenu() {

        let scrolledValue = Math.abs( lastScrollTop - body.scrollTop );
        const TARGETCLASS = 'c-header--isUp';

        // Make sure the scroll is more than delta
        if( scrolledValue <= deltaScroll ) {
            return;
        }

        // On Desktop it shows the header bar only when the viewport's height is
        // less than the amount of scroll minus the header's height
        if ( viewPort.height > viewPort.height + body.scrollTop - headerHeight ) {
            DOMcache.header.classList.remove(TARGETCLASS);
            hideSideMenu();
            return;
        }

        if ( body.scrollTop > lastScrollTop && body.scrollTop > headerHeight ){
            // Scroll Down
            DOMcache.header.classList.add(TARGETCLASS);
            showSideMenu();
        } else {
            // Scroll Up

            // On device less wider tha Desktop it shows the header bar each
            //time the user srolls up the page
            if (( viewPort.height <= viewPort.height + body.scrollTop ) &&
                  isLessThanDesktop ) {
                DOMcache.header.classList.remove(TARGETCLASS);
            }
        }

        // Update lastScrollTop
        lastScrollTop = body.scrollTop;
    }

    function showSideMenu() {
        DOMcache.sideMenuDesktop.style.visibility = 'visible';
        DOMcache.sideMenuDesktop.style.opacity = 1;
    }

    function hideSideMenu() {
        DOMcache.sideMenuDesktop.style.visibility = 'hidden';
        DOMcache.sideMenuDesktop.style.opacity = 0;
        // Set the first item
        setCurrentSideMenuItem('about');
    }

    function activateSideMenuItem( position ) {

        let coords = Array.from( DOMcache.sections ).map(section => {
            return {
                id: section.id,
                coord: DOM.getElemDistance(section)
            };
        }).filter(section => section.coord <= position);

        let id = coords[coords.length -1].id;

        handleGraphAnimation( id );
        setCurrentSideMenuItem( id );
    }

    function setCurrentSideMenuItem( id ) {

        let link = $('.c-sideMenu__link[href="#' + id +'"]');
        let dotNav;
        let classN;
        let classL;
        let currentLink;
        let currentNav;

        if (!link) {
            return;
        }

        dotNav = link.parentNode.previousElementSibling.firstElementChild;
        classN = dotNav.classList[0] + '--current';
        classL = link.classList[0]   + '--current';

        currentLink = $( '.' + classL );
        currentNav  = $( '.' + classN );

        if ( currentLink ) {
            currentLink.classList.remove(classL);
        }

        if ( currentNav ) {
            currentNav.classList.remove(classN);
        }

        link.classList.add( classL );
        dotNav.classList.add( classN );

    }


    function handleGraphAnimation( id ) {
        if ( isGraphFirstAnimation && id === 'skills' ) {
            Array.from( DOMcache.graphPaths ).forEach(path => {

                let circle = DOM.getClosest( path, '.c-circle' );

                path.setAttribute('style', `stroke-dasharray: 629;
                                            -webkit-animation: load 6s;
                                            animation: load 6s;`);
                circle.setAttribute('style', `-webkit-animation: fadeIN 10s;
                                             animation: fadeIN 10s;`);
            });
            isGraphFirstAnimation = false;
        }
    }


    function handleScroll() {
        isScrolled = true;
    }

    function loadRandomFact(event) {

        if (event.target.nodeName === 'I') {
            DOMcache.randomFactTrigger.classList.add(isLoadingClass);
        }

        let msg = new Promise(function(resolve, reject){

            let rnd = Math.floor(Math.random() * 200);
            let xhr = new XMLHttpRequest();
            let url = TRIVIA.url + rnd;

            xhr.onload = () => resolve(xhr.response);

            xhr.onerror = () => reject();

            xhr.open('GET', url);
            xhr.setRequestHeader('X-Mashape-Authorization', TRIVIA.key);
            xhr.send();

        });

        msg.then(
            function(result) {
                let msg = result.substr(1, result.length - 2);
                DOMcache.randomFactMsg.innerHTML = msg;
                DOMcache.randomFactTrigger.classList.remove(isLoadingClass);
            },
            function() {
                DOMcache.randomFactMsg.innerHTML = TRIVIA.defaultMSG;
                DOMcache.randomFactTrigger.classList.remove(isLoadingClass);
            });

    }

    function setCookie() {

        let now = new Date();
        let oneWeek = 1000 * 60 * 60 * 24 * 7;
        let counter = COOKIES.get('counter');
        let count = 0;

        if (!counter || Number.isNaN(parseInt(counter))) {
            count = 0;
        } else {
            count = parseInt(counter) + 1;
        }

        updateWelcomeMsg(count);

        now.setTime(now.getTime() + oneWeek);

        document.cookie = 'counter=' + count +';expires=' + now.toUTCString();
    }

    function updateWelcomeMsg(counter) {

        let msgObj;

        if (counter === 0) {
            return;
        }

        // Check if a specific welcome msg exists
        if (welcomeMessages['visit' + counter]) {
            msgObj = welcomeMessages['visit' + counter];
        } else {
            msgObj = welcomeMessages['visit2'];
        }

        DOMcache.welcomeMsgElement[1].innerHTML = msgObj['part1'];
        DOMcache.welcomeMsgElement[2].innerHTML = msgObj['part2'];
        DOMcache.welcomeMsgElement[3].innerHTML = msgObj['part3'];
        DOMcache.welcomeMsgElement[4].innerHTML = msgObj['part4'];
        DOMcache.welcomeMsgElement[5].innerHTML = msgObj['part5'];

    }

    window.setInterval( function() {
        // Check if the page has been scrolled
        if ( isScrolled ) {
            getSystemInformation();
            showHideScrollUPButton();
            showHideHeaderAndSideMenu();
            isScrolled = false;
        }
    }, throttleInterval );


    // Event Listeners
    document.addEventListener('scroll', handleScroll, false);
    DOMcache.header.addEventListener('click', handleClick, false);
    DOMcache.scrollButton.addEventListener('click', handleClick, false);
    DOMcache.sideMenuDesktop.addEventListener('click', handleClick, false);
    DOMcache.sideMenuMobile.addEventListener('click', mobileSideMenuClick, false);

    DOMcache.card.addEventListener('click', handleCardClick, false);
    DOMcache.randomFactTrigger.addEventListener('click', loadRandomFact, false);


    document.addEventListener('DOMContentLoaded', function() {
        loadRandomFact();
        setCookie();
    });

}

documentReady(
    main
);