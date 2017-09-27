/*global emailjs UIProgressButton*/
'use strict';

import { Portfolio, lib } from '../../js/lib';

const {getParent} = lib;
const FORM = Portfolio.Utils.Forms;
const DOM = Portfolio.Utils.Dom;

const emailForm = DOM.$( '.c-form[name="concact"]' );

const successHTML = `<div class="c-form__result">
                      <img src="img/sent_icon.png" title="Sent Icon" />
                      <p>Thank you for contanct me</p>
                      <p>I will replay as soon as possible</p>
                    </div>`;

const errorHTML = err => {
  const message = JSON.parse(err.text);
  return `<div class="c-form__result">
            <img src="img/opss_icon.png" title="Sent Icon" />
            <p>Opss something went wrong!</p>
            <p>The Server says:</p>
            <p class="error">${message.error}</p>
            <p>Please try again</p>
          </div>`;
};

let validator = null;
let _interval;
let _submitButton;

const setFieldAsInvalid = field => {
  field.classList.add('is-invalid');
};

const setFieldAsValid = field => {
  field.classList.remove('is-invalid');
};

/**
 * Generates an unordered list containing all the catched errors
 * @param      {(Array)}  errors  An Array of errors
 * @returns   {String}            A string representation
 */
const generateErrorsList = errors => {
  let list = '<ul>';
  errors.forEach(error => list += `<li>${error}</li>`);
  list += '</ul>';
  return list;
};

/**
 * Handles the result of the validation
 * @param      {(Array)}  fields  An Array of objects
 * @returns   {Promise}            A promise
 */
const handleValidation = fields => {
  return new Promise((resolve, reject) => {
    let count = 0;
    fields.forEach(field => {
      const parent = getParent(field.input);
      const list = parent.firstElementChild;
      const errors = field.errors;
      if (errors.length > 0) {
        setFieldAsInvalid(parent);
        list.innerHTML = generateErrorsList(errors);
        count += errors.length;
      } else {
        // Remove invalid fields (if necessary)
        setFieldAsValid(parent);
        list.innerHTML = '';
      }
    });

    if (count > 0) {
      reject();
    } else {
      resolve();
    }
  });
};

const clearResultMessage = () => {
  window.setTimeout( function() {
    DOM.$( '.c-form__result',  emailForm).remove();
  }, 4000 );
};


/**
 * Sends an email when inputs are valid
 * @returns   {void 0}
 */
const sendEmail = () => {
  _submitButton.getInstance()._submit();
  emailjs.sendForm('default_service', 'template_ctNudcMa', 'contact-form')
    .then(function(response) {
      _submitButton.getInstance().stop(1);
      emailForm.insertAdjacentHTML('afterbegin', successHTML);
      emailForm.reset();
    }, function(err) {
      _submitButton.getInstance().stop(-1);
      emailForm.insertAdjacentHTML('afterbegin', errorHTML(err));
    }).then(function() {
      clearInterval(_interval);
      clearResultMessage();
    });
};

/**
 * A handler function to prevent default submission and run our custom script.
 * @param  {Event} event  the submit event triggered by the user
 * @return {void}
 */
const handleEmail = event => {

  event.preventDefault();

  const fields = validator.validateAll();

  handleValidation(fields)
                      .then(sendEmail)
                      .catch(function() {
                        _submitButton.getInstance().stop(-1);
                      });
};

/**
 * Initialises the Validator for the contact form
 * @returns   {void 0}
 */
const init = () => {
  emailjs.init('user_aUOPsQzuTNdTRPcxZ6pXS');
  const emailButton = getParent(DOM.$('#button--contact'));
  const name    = emailForm.elements.name;
  const email   = emailForm.elements.email;
  const message = emailForm.elements.message;
  validator = new FORM.Validator();
  validator.setValidators(name, FORM.NotEmpty);
  validator.setValidators(email, FORM.Email);
  validator.setValidators(message, FORM.NotEmpty);
  _submitButton = new UIProgressButton(emailButton, {
    callback: function(instance) {
      var progress = 0;
      _interval = window.setInterval( function() {
        progress = Math.min( progress + Math.random() * 0.1, 1 );
        instance.setProgress( progress );
        if ( progress === 1 ) {
          // Restart the progression
          progress = 0;
        }
      }, 150 );
    }
  });
};

export default {
  init,
  handleEmail
};
