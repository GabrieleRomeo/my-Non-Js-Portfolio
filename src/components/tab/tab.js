'use strict';

import { lib } from '../../lib';

const {not, curry, maybe, maybeValid, deactivateItem, activateItem, getParent} = lib;

/**
 * Defines what makes an item valid when a user clicks it
 * @type  {HTMLNode} activeItem  The current active tab item
 * @type  {HTMLNode} clickedItem  The tab label that was clicked by the user
 * @returns {Bool} True if the clicked item is valid, False if not
 */
const predicate = curry((activeItem, clickedItem) =>  {
  return clickedItem.classList.contains('c-tab__label') &&
        not(clickedItem.classList.contains('c-tab__label--sticket')) &&
        clickedItem !== activeItem;
});

/**
 * Define what System does when a user clicks on a valid tab item
 * @type  {HTMLNode} target  The item that was just clicked
 * @type  {HTMLNode} activeItem  The active item
 * @returns {void 0}
 */
const clickItem = maybe(function(target, activeItem) {
  const tabItem = getParent(target);
  deactivateItem(activeItem);
  activateItem(tabItem);
});

/**
 * Defines the Tab event handler
 */
function tabComponent(e) {
  const activeLabel = e.currentTarget.querySelector('.is-active .c-tab__label');
  const activeItem  = getParent(activeLabel);
  const target      = maybeValid(predicate(activeLabel))(e.target);
  clickItem(target, activeItem);
}

export default tabComponent;