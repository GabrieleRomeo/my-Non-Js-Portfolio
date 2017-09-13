'use strict';

import { Portfolio, lib } from '../../lib';

const {rcompose, cloneNode, replaceNode} = lib;
const {DOM} = Portfolio;

/**
 * Takes the node having the '.c-card' class
 *
 * @param      {Event}  e  The click Event
 * @return     {HTMLNode}  The card component
 */
const takeTheCard = e => e.target === e.currentTarget ?
                         e.target :
                         DOM.getClosest(e.target, '.c-card');

/**
 * Takes the trigger of the Card flip animation
 *
 * @param      {HTMLNode}  c    The card component
 * @return     {HTMLInputElement}  The input element used as trigger
 */
const takeTheTrigger = c => c.querySelector('.c-businessCard__input--trigger');

/**
 * Changes the current status of the trigger
 *
 * @param      {HTMLInputElement}  i   The input used as a trigger
 * @return     {Object}  An object containing the old input and its clone
 */
const switchTriggerStatus = i => {
  const clone = cloneNode(i);
  // Invert the status
  clone.checked = !!clone.checked;
  return {
    prevTrigger: i,
    newTrigger: clone
  };
};

/**
 * Replaces an existing Node with a new Node
 *
 * @param      {Object}  o  An Object containing the triggers
 */
const replaceTrigger = function(o) { replaceNode(o.prevTrigger, o.newTrigger); };

/**
 * Event handler
 *
 * @param      {Event}  e       The click event
 */
function cardComponent(e) {
  const run = rcompose(
              takeTheCard,
              takeTheTrigger,
              switchTriggerStatus,
              replaceTrigger);
  run(e);
}

export default cardComponent;