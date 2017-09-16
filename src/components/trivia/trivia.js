'use strict';

import { Portfolio, lib } from '../../lib';

const {maybe, maybeValid, activateLoading, deactivateLoading, $http, tail} = lib;

const _$ = Portfolio.Utils.Dom.$;

const startLoadingAnimation = maybe(item => activateLoading(item));
const stopLoadingAnimation  = maybe(item => deactivateLoading(item));

/**
 * Defines what makes an item valid when a user clicks it
 * @type  {HTMLNode} activeItem  The current active tab item
 * @type  {HTMLNode} clickedItem  The tab label that was clicked by the user
 * @returns {Bool} True if the clicked item is valid, False if not
 */
const predicate = maybe(item =>  item.nodeName === 'I');

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

function init() {
  apiReq()
        .get()
        .then(callback.success)
        .catch(callback.error);
}

const click = maybe(function(target) {
  let icon = startLoadingAnimation(target);

  apiReq()
        .get()
        .then(callback.success)
        .catch(callback.error)
        .then(stopLoadingAnimation(icon));
});

function handler(e) {
  click(maybeValid(predicate)(e.target));
}

export default {
  init,
  handler
};