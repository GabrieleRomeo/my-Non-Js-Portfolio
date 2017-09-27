'use strict';

import { Portfolio, lib } from './lib';
import sideMenu from '../components/sideMenu/sideMenu';
import tabHandler from '../components/tab/tab';
import cardHandler from '../components/card/card';
import email from '../components/email/email';
import trivia from '../components/trivia/trivia';
import documentReady from './document-ready';

const { rcompose } = lib;

function main() {
  const ANIM = Portfolio.Animation.scrolling;
  const DOM  = Portfolio.Utils.Dom;
  const COOKIES = Portfolio.Utils.cookies;
  const $  = DOM.$;
  const $$ = DOM.$$;

  const throttleInterval = 500;
  let isScrolled = true;
  let lastScrollTop = 0;

  const DOMcache = {
    animation: $( '.animation '),
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
    tab: $( '.c-tab' ),
    scrollButton: $( '.c-button--scroll' ),
    randomFactTrigger: $( '.c-random-fact' ),
    emailButton: $( '#button--contact' )
  };

  function getSystemInformation() {
    const viewPort = Portfolio.namespace('Utils').Window.viewPort();
    const body = DOM.getBody();
    const headerHeight = parseInt(DOM.getComputed(DOMcache.header)('height'));
    return {
      isLessThanDesktop: ( viewPort.width < '1024' ) ? true : false,
      totalScroll: body.scrollTop + headerHeight,
      VPST: viewPort.height + body.scrollTop,
      VH: viewPort.height + body.scrollTop - headerHeight,
      viewPort,
      body,
      headerHeight
    };
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

    // Make sure that an intended element was clicked
    if ( !target ) {
      return;
    }

    element = $(target.hash);

    ANIM.scrollTo(element, { ease: 'easeOutCubic', duration: 800 });
  }

  function setSideMenuItem(sysInfo) {
    sideMenu.setCurrentItemByPosition(sysInfo.totalScroll);
    return sysInfo;
  }

  function handleGOUpButton(sysInfo) {
    let buttonVisibility = DOM.getComputed(DOMcache.backToTop)('visibility');
    let isVisible = buttonVisibility && ( buttonVisibility === 'visible' );

    // On mobiles do nothing
    if ( sysInfo.isLessThanDesktop && isVisible ) {
      DOMcache.backToTop.style.visibility = 'hidden';
    } else if ( sysInfo.isLessThanDesktop ) {
      return;
    }

    /*
     * Prevents the system to add or remove the same classes when unnecessary
     * It does nothing when:
     *
     * The scrolled value is bigger than the Viewport's height and
     * the button is already visible
     *
     * The scrolled value is lower than the Viewport's height and
     * the button is already not visible
     *
     */
    if ( sysInfo.totalScroll > sysInfo.viewPort.height && isVisible ) {
        return;
    } else if ( sysInfo.totalScroll < sysInfo.viewPort.height && !isVisible ) {
        return;
    }

    if ( ( sysInfo.totalScroll > sysInfo.viewPort.height ) ) {
      DOMcache.backToTop.style.visibility = 'visible';
    } else {
      DOMcache.backToTop.style.visibility = 'hidden';
    }
  }

  function handleHeaderANDSideMenu(sysInfo) {
    const ISUP = 'is-up';
    const ISVISIBLE = 'is-visible';

    // On Desktop it shows the header bar only when the viewport's height is
    // lesser than the scrolling value minus the header's height
    if ( sysInfo.viewPort.height > sysInfo.VH ) {
      DOMcache.header.classList.remove(ISUP);
      DOMcache.sideMenuDesktop.classList.remove(ISVISIBLE);
      //return;
    }

    if ( sysInfo.body.scrollTop > lastScrollTop       &&
         sysInfo.body.scrollTop > sysInfo.headerHeight ) {
        // Scroll Down
      DOMcache.header.classList.add(ISUP);
      DOMcache.sideMenuDesktop.classList.add(ISVISIBLE);
    } else {
      // Scroll Up
      // On device less wider than Desktop it shows the header bar each
      // time the user srolls up the page
      if ( sysInfo.isLessThanDesktop === true &&
           sysInfo.viewPort.height <= sysInfo.VPST ) {
        DOMcache.header.classList.remove(ISUP);
      }
    }

    // Update lastScrollTop
    lastScrollTop = sysInfo.body.scrollTop;
    return sysInfo;
  }

  function handleScroll() {
    isScrolled = true;
  }

  function setCookie() {
    const now = new Date();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const counter = COOKIES.get('counter');
    let count = 0;

    if (!counter || Number.isNaN(parseInt(counter))) {
      count = 0;
    } else {
      count = parseInt(counter) + 1;
    }

    now.setTime(now.getTime() + oneWeek);

    document.cookie = 'counter=' + count +';expires=' + now.toUTCString();
  }

  const runSystem = rcompose(
    handleHeaderANDSideMenu,
    setSideMenuItem,
    handleGOUpButton
  );

  window.setInterval( function() {
    // Check if the page has been scrolled
    if ( isScrolled ) {
      const sysInfo = getSystemInformation();
      runSystem(sysInfo);
      isScrolled = false;
    }
  }, throttleInterval );


  // Start custom actions
  requestAnimationFrame(function() {
    email.init();
    trivia.init();
    setCookie();
  });


  /***************************************************************************
   *
   *                         Events listeners
   *
   ***************************************************************************/

  document.addEventListener('scroll', handleScroll, false);

  DOMcache.header.addEventListener('click', handleClick, false);
  DOMcache.scrollButton.addEventListener('click', handleClick, false);
  DOMcache.sideMenuDesktop.addEventListener('click', handleClick, false);

  DOMcache.sideMenuMobile.addEventListener('click', sideMenu.mobileClickHandler, false);

  DOMcache.card.addEventListener('click', cardHandler, false);
  DOMcache.emailButton.addEventListener('click', email.handleEmail, false);
  DOMcache.tab.addEventListener('click', tabHandler, false);

  DOMcache.randomFactTrigger.addEventListener('click', trivia.handler, false);
}

// When DOM is ready, call the main function
documentReady(
    main
);