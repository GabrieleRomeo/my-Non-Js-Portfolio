'use strict';

import { Portfolio, lib } from '../../js/lib';

const {maybe, maybeValid, activateLoading, deactivateLoading, $http, tail} = lib;
const _$ = Portfolio.Utils.Dom.$;

/**
 * Starts the loading animation by adding a specific CSS class on the item
 * @param       {HTMLNode} item The item to be animated
 * @returns     {Promise} Returns a Promise which, in turns, returns a new
 *                        HTMLNode having the animation class
 */
const startLoadingAnimation = maybe(item => activateLoading(item));

/**
 * Stops the loading animation by removing a specific CSS class on the item
 * @param       {HTMLNode} item The animated item
 * @returns     {Promise} Returns a Promise which, in turns, returns a new
 *                        HTMLNode without the animation class
 */
const stopLoadingAnimation  = maybe(item => deactivateLoading(item));

/**
 * Defines what makes an item to be valid when a user clicks it
 * @param  {HTMLNode} item  The item that was clicked by a user
 * @returns {Bool} True if the clicked item is valid, False if not
 */
const predicate = maybe(item =>  item.nodeName === 'I');

/**
 * Generates a random integer
 *
 * @return     {Integer}  A random integer between 0 and 200
 */
const randomInteger = () => Math.floor(Math.random() * 200);

const apiReq = function() {
  return $http({
    url: 'https://numbersapi.p.mashape.com/' + randomInteger(),
    header: 'X-Mashape-Authorization',
    headerValue: 'cCRn3ndWPPmshXp3hZ6finUK92HIp10pB2sjsne4SUvAkUkoCz'
  });
};

const callback = {
  success: function(data) {
    const parts = data.substr(0, data.length - 1).split(' ');
    let msg = `Did you know that
              <span class="c-random-fact__number">${parts[0]}</span>
              ${tail(parts).join(' ')} ?`;
    _$('.c-random-fact__paragraph').innerHTML = msg;
  },
  error: function() {
    _$('.c-random-fact__paragraph').innerHTML = `Trivia is temporarily unavailable.
                                                 I'm Sorry.`;
  }
};

/**
 * Retrieves a random fact through an initial API request
 */
function init() {
  apiReq()
        .get()
        .then(callback.success)
        .catch(callback.error);
}

/**
 * Handles clicks only when the clicked item satisfies the Trivia's predicate
 *
 * @type       {HTMLNode} target The clicked item must be the loading icon
 */
const handleClick = maybe(function(target) {
  startLoadingAnimation(target).then(function(node) {
    apiReq()
          .get()
          .then(callback.success)
          .catch(callback.error)
          .then(function() {
            stopLoadingAnimation(node);
          });
  });
});

/**
 * Handles click events on the Trivia component.
 * The clicked item must satisfy the Trivia's predicate otherwise the event
 * is discarded.
 *
 * @param      {Event}  e       A click event
 */
function handler(e) {
  handleClick(maybeValid(predicate)(e.target));
}

export default {
  init,
  handler
};