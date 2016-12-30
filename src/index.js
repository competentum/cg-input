'use strict';

import './common.less';

import Spinner from './spinner';
import EventEmitter from 'events';
import utils from 'cg-component-utils';
import merge from 'merge';
import templates from './templates';

const INPUT_CLASS = 'cg-input';
const KEYCODE = {
  ARROW: {
    UP: 38,
    DOWN: 40
  }
};

class CgInput extends EventEmitter {

  /**
   *
   * @returns {*}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        label: false,
        placeholder: false,
        disabled: false,
        spinner: false,
        value: false,
        required: false,
        preset: 'text',
        restrict: '.',
        formatter: function (v) {
          return v;
        },
        unformatter: function (v) {
          return v;
        },
        validate: function(v){
          return typeof v !== 'undefined';
        }
      };
    }
    return this._DEFAULT_SETTINGS;
  }

  static get EVENTS() {
    if (!this._EVENTS) {
      this._EVENTS = {
        FOCUS: 'focus',
        CHANGE: 'change',
        INPUT: 'input',
        BLUR: 'blur'
      };
    }
    return this._EVENTS;
  }

  constructor(settings) {
    super();

    this.settings = merge.recursive(true, templates[settings.preset], settings);
    this.settings = merge.recursive(true, this.SETTINGS, this.settings);

    this._render();
    this._init();
  }

  get SETTINGS() {
    return this.constructor.DEFAULT_SETTINGS;
  }

  /**
   * return value of the input Element
   * @returns {String}
   */
  get value() {
    return this._value;
  }

  /**
   *
   * @param {*} value
   */
  set value(value) {
    this._value = value;
  }

  /**
   *
   * @param label
   */
  set label(label){
    this.settings.label = label;
    this._elementLabel.innerHTML = label;
  }

  get label(){
    return this.settings.label;
  }

  /**
   *
   * @param value
   */
  set placeholder(value){
    this.settings.placeholder = value;
    this._element.placeholder = value;
  }

  get placeholder(){
    return this.settings.placeholder;
  }

  /**
   *
   * @param disable
   */
  set disabled(disable){
    this.settings.disabled = disable;
    this._element.disabled = disable;

    let changeClass;

    changeClass = disable ? utils.addClass : utils.removeClass;
    changeClass(this.container, 'disabled');
  }

  get disabled(){
    return this.settings.disabled;
  }

  /**
   *
   * @param value
   */
  set restrict(value){
    if(typeof value === 'string'){
      this.settings.restrict = value;
    }
  }

  get restrict(){
    return this.settings.restrict;
  }

  /**
   * Set value into the input element
   * @param {String} value
   * @param {Boolean} [format] - use formatting or no
   */
  setValue(value, format){
    let currentValue = this._element.value;
    let diff;
    let start;

    // calculate differences between input and transformed value
    diff = currentValue.length - value.length;

    // write selection start position
    start = this._element.selectionStart;
    start = isNaN(start) ? currentValue.length : start;
    start = (diff !== 0) ? start - diff : start;

    value = format ? this._format() : value;

    this._element.value = value;
    this._element.oldValue = value;
    this._element.selectionStart = start;
    this._element.selectionEnd = start;
  }

  /**
   * Handle the entered value
   * @private
   */
  _input() {
    let value = this._element.value;
    let transformedValue;
    let unformatted;
    let valid;

    // cut unnecessary characters
    transformedValue = this._restrict(value);
    unformatted =      this._unformat(transformedValue);
    valid =            this._validate(unformatted);

    this.setValue(transformedValue, false);

    // update model value
    if (valid && this.value !== unformatted) {
      this.value = unformatted;
    }

    this.emit(this.constructor.EVENTS.INPUT);
  }

  _compare(){
    return this.value == this._element.value;
  }

  _restrict(value, pattern) {
    pattern = pattern || this.settings.restrict;

    // create new regexp and find matches
    let regex = new RegExp(pattern, 'g');
    let matches = value.match(regex) || [];

    return matches.join('');
  }

  /**
   *
   * @param value
   * @returns {*}
   * @private
   */
  _validate(value){
    return this.settings.validate(value);
  }

  /**
   *
   * @param {String} value
   * @returns {*}
   * @private
   */
  _unformat(value) {
    value = value || this._element.value;
    value = value.toString();

    return value ? this.settings.unformatter(value) : '';
  }

  /**
   * format the data using formatter from settings
   * @returns {*}
   * @private
   */
  _format() {
    if(this.value){
      return this.settings.formatter(this.value);
    }

    return this._element.value || '';
  }

  /**
   * Focus callback
   */
  _focus() {
    this.emit(this.constructor.EVENTS.FOCUS);
  }

  /**
   * Change callback
   */
  _change() {
    this.emit(this.constructor.EVENTS.CHANGE);
  }

  /**
   * Blur callback
   */
  _blur() {
    this._element.value = this._format();

    this.emit(this.constructor.EVENTS.BLUR);
  }

  /**
   * Disable formatting input
   */
  disable() {
    if (!this.settings.disabled) return;

    this.settings.disabled = true;
    this._element.disabled = true;

    utils.addClass(this.container, 'disabled');
  }

  /**
   * Enable formatting input
   */
  enable() {
    if (this.settings.disabled) return;

    this.settings.disabled = false;
    this._element.disabled = false;

    utils.removeClass(this.container, 'disabled');
  }

  /**
   * @private
   */
  _render() {
    // save container to short link
    this.container = this.settings.container;

    this._element = utils.createHTML('<input/>');
    this._elementLabel = utils.createHTML('<label></label>');

    // attach events
    this._element.addEventListener('focus', this._focus.bind(this));
    this._element.addEventListener('blur', this._blur.bind(this));
    this._element.addEventListener('input', this._input.bind(this));

    // if user don't pass container in the settings
    if (typeof this.container === 'undefined') {
      this.container = utils.createHTML('<div></div>');
    }

    this.container.appendChild(this._elementLabel);
    this.container.appendChild(this._element);

    utils.addClass(this.container, INPUT_CLASS);
  }

  _init() {
    this._elementLabel.innerHTML = this.settings.label || '';
    this._element.value = this.settings.value || '';

    this.disable();

    if (this.settings.spinner) {
      this.spinner = new Spinner(this, this.settings.spinner);

      this._element.addEventListener('keydown', (e) => {
        switch (e.which || e.keyCode) {
          case KEYCODE.ARROW.UP:
            this.spinner.increase();
            e.preventDefault();
            break;
          case KEYCODE.ARROW.DOWN:
            this.spinner.decrease();
            e.preventDefault();
            break;
        }
      });
    }
  }

  /*
   _input(){
   let oldValue = this._element.oldValue || '';
   let value = this._element.value;
   let shift = 0;
   let start;
   let diff;

   // slice numeric value
   let regex = /[0-9\-\.]+/g;
   let matches = value.match(regex);
   let transformed = matches ? matches.join('') : '';

   let minusMatches = (transformed.match(/[\-]/g) || []).length;
   let dotMatches = (transformed.match(/[\.]/g) || []).length;

   if(dotMatches > 1){
   var oldDotIndex = oldValue.indexOf('.');
   var dotIndex = transformed.indexOf('.');

   if(oldDotIndex === dotIndex){
   transformed = transformed.substring(0, oldDotIndex) +
   transformed.substring(oldDotIndex + 1);
   } else {
   shift++;
   transformed = transformed.substring(0, dotIndex) + '.' +
   transformed.substring(dotIndex + 1).replace(/[\.]/g, '');
   }
   }

   if(minusMatches){
   var sign = (minusMatches > 1) ? '' : '-';

   // placed minus in the beginning of the line
   transformed = sign + transformed.replace(/[-]/g, '');
   }

   // calculate differense between input and transformed value
   diff = value.length - transformed.length;

   // write selection start position
   start = this._element.selectionStart;
   start = isNaN(start) ? value.length : start + shift;
   start = (diff !== 0) ? start - diff : start;

   this._element.value = transformed;
   this._element.oldValue = transformed;

   this._element.selectionStart = start;
   this._element.selectionEnd = start;

   if(this.value != transformed){
   this.value = this._unformat(transformed);
   }
   }
   * */
}

module.exports = CgInput;