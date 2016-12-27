'use strict';

import './common.less';

import Spinner from './spinner';
import EventEmitter from 'events';
import utils from 'cg-component-utils';
import merge from 'merge';
import templates from './templates';

const INPUT_CLASS = 'cg-input';

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
        spinner: false,
        value: false,
        preset: 'text',
        restrict: '.',
        formatter: function (v) {
          return v;
        },
        unformatter: function (v){
          return v;
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

    this.settings = merge.recursive(true, this.SETTINGS, settings);
    this.settings = merge.recursive(true, this.settings, templates[this.settings.preset]);

    this._render();
    this._init();
  }

  get SETTINGS(){
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
    this._change();
  }

  setInputValue(value){
    this._input(value);
  }

  /**
   * Handle the entered value
   * @private
   */
  _input(){
    let value = this._element.value;
    let transformedValue;
    let start;
    let diff;

    // cut unnecessary characters
    transformedValue = this._restrict(value);

    // calculate differense between input and transformed value
    diff = value.length - transformedValue.length;

    // write selection start position
    start = this._element.selectionStart;
    start = isNaN(start) ? value.length : start;
    start = (diff !== 0) ? start - diff : start;

    this._element.value = transformedValue;
    this._element.selectionStart = start;
    this._element.selectionEnd = start;

    if(this.value != transformedValue){
      this.value = this._unformat(transformedValue);
    }

    this.emit(this.constructor.EVENTS.INPUT);
  }

  _restrict(value, pattern){
    pattern = pattern || this.settings.restrict;

    // create new regexp and find matches
    let regex = new RegExp(pattern, 'g');
    let matches = value.match(regex) || [];

    return matches.join('');
  }

  _unformat(value){
    return this.settings.unformatter(value);
  }

  _format() {
    return this.settings.formatter(this.value);
  }

  update(){

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
    this.emit(this.constructor.EVENTS.BLUR);
  }

  /**
   * Disable formatting input
   */
  disable() {
    if(this.disabled) return;

    this.disabled = true;
    this._element.disabled = true;

    utils.addClass(this.container, 'disabled');
  }

  /**
   * Enable formatting input
   */
  enable() {
    if(!this.disabled) return;

    this.disabled = false;
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

    this.on(this.constructor.EVENTS.INPUT, this.update.bind(this));

    // if user don't pass container in the settings
    if(typeof this.container === 'undefined'){
      this.container = utils.createHTML('<div></div>');
    }

    this.container.appendChild(this._elementLabel);
    this.container.appendChild(this._element);

    utils.addClass(this.container, INPUT_CLASS);
  }

  _init() {
    if(this.settings.label){
      this._elementLabel.innerHTML = this.settings.label;
    }

    if(this.settings.spinner){
      this.spinner = new Spinner(this, this.settings.spinner);
    }
  }
}

module.exports = CgInput;