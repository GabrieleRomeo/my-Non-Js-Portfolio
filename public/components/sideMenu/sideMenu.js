'use strict';

import { Portfolio, lib } from '../../js/lib';

const {curry, rcompose, maybe, maybeValid, last, setCurrent, unsetCurrent} = lib;
const DOM = Portfolio.Utils.Dom;

const DOMCACHE = {
  sideMenuMobileTrigger:  DOM.$('#hamburger__checkbox')
};

/**
 * Starts the loading animation by adding a specific CSS class on the item
 * @param       {HTMLNode} item The item to be animated
 * @returns     {Promise} Returns a Promise which, in turns, returns a new
 *                        HTMLNode having the animation class
 */
const setAsCurrent = maybe(item => setCurrent(item));

/**
 * Stops the loading animation by removing a specific CSS class on the item
 * @param       {HTMLNode} item The animated item
 * @returns     {Promise} Returns a Promise which, in turns, returns a new
 *                        HTMLNode without the animation class
 */
const unsetAsCurrent  = maybe(item => unsetCurrent(item));

/**
 * Retrieves the coordinates of a HTMLNode
 * @param       {HTMLNode} item The node to be analyzed
 * @returns     {Object} Returns an object containing
 */
const getNodeCoords = node => {
  return {
    id: node.id,
    coords: DOM.getElemDistance(node)
  };
};

/**
 * Gets an item through its coordinates
 * @type  {HTMLNodeList} nodes  A list of HTML nodes
 * @type  {NUMBER} position  The position of the item you're looking for
 */
const getItemByPosition = curry((nodes, position) => {
  const list = Array.from(nodes)
                    .map(getNodeCoords)
                    .filter(node => node.coords <= position);
  return last(list);
});

/**
 * Gets the id property from an object
 * @type  {Object} o  The object containing an id property
 */
const getID = o => o.id;

/**
 * Gets a link through its unique identifier
 * @type  {STRING} id  The section's identifier
 */
const getLinkByID = id => DOM.$('.c-sideMenu__link[href="#' + id +'"]');

/**
 * Sets an item as the current one
 * @type  {HTMLNode} link  The '.c-sideMenu__link' where an item belongs
 */
const setCurrentItem = maybe(link => {
  const menuCard = DOM.getClosest(link, '.c-menucard');
  const dotNav = DOM.$('.c-dotNav', menuCard);
  const currentLink = DOM.$('.c-sideMenu__link.is-current');
  const currentNav = DOM.$('.c-dotNav.is-current');

  if (currentLink.textContent === link.textContent) {
    return;
  }

  unsetAsCurrent(currentLink).then(function() {
    setAsCurrent(link);
  });

  unsetAsCurrent(currentNav).then(function() {
    setAsCurrent(dotNav);
  });
});

/**
 * Defines to set an item through its position
 * @type  {Number} position  The item's position
 */
const setCurrentItemByPosition = position  => {
  const findItem = getItemByPosition(DOM.$$('main .c-section'));

  const run = rcompose(
      findItem,
      getID,
      getLinkByID,
      setCurrentItem
    );

  run(position);
};

/**
 * Defines what makes an item valid when a user clicks it
 * @type  {HTMLNode} clickedItem  The clicked link
 * @returns {Bool} True if the clicked item is valid, False if not
 */
const predicate = clickedItem =>  {
  return clickedItem.nodeName === 'A';
};

/**
 * Scrolls the Window to an HTML item
 * @type  {HTMLNode} elem  An HTML Node
 */
const scrollToElem = maybe(elem => {
  const delay = window.setInterval( function() {
    Portfolio.Animation.scrolling.scrollTo(elem);
    window.clearInterval(delay);
  }, 300);
});

/**
 * Handles the click to an intended HTML item
 * @type  {HTMLNode} target  An HTML Node
 */
const mobileClick = maybe(target => {
  const targetSelector = target.getAttribute( 'href' );
  const targetElement = DOM.$( targetSelector );
  //When a user clicks on a link, close the menu
  DOMCACHE.sideMenuMobileTrigger.checked = false;
  scrollToElem(targetElement);
});

/**
 * Handles the click event and runs the actions only if the clicked element
 * passes the predicate
 * @type  {Event} e  The click Event
 */
function mobileClickHandler(e) {
  e.stopPropagation();
  e.preventDefault();
  const target = maybeValid(predicate)(e.target);
  mobileClick(target);
}

export default {
  setCurrentItemByPosition,
  mobileClickHandler
};

