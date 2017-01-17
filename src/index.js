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
   * @property {string} label
   * @property {string} placeholder
   * @property {string} preset          - input component has some presets for quick setup
   * @property {string} restrict        - uses regular expressions syntax to filter the input data
   * @property {boolean} disabled
   * @property {boolean|object} spinner - settings for spinner
   * @property {string|number} value    - initial value
   * @property {boolean} required       - input check
   * @property {function} formatter     - this setting allows you to edit the value visible
   * @property {function} unformatter   - oppositely formatter setting
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        container: null,
        label: '',
        placeholder: '',
        value: '',
        required: false,
        disabled: false,
        spinner: false,
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

  /**
   * Types of listeners
   * @returns {{
   *   FOCUS: string,
   *   CHANGE: string,
   *   INPUT: string,
   *   BLUR: string
   * }}
   * @constructor
   */
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

  /**
   *
   * @param {object} settings
   */
  constructor(settings) {
    super();

    this._render();
    this._applySettings(settings);
    this._init();
  }

  get SETTINGS() {
    return this.constructor.DEFAULT_SETTINGS;
  }

  /**
   *
   * @param {*} value
   */
  set value(value) {
    this._value = value;
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
   * @param label
   */
  set label(label){
    this._settings.label = label;
    this._elementLabel.innerHTML = label;
  }

  get label(){
    return this._settings.label;
  }

  /**
   * Setter placeholder
   * @param {string|boolean} value
   */
  set placeholder(value){
    this._settings.placeholder = value;
    this._element.placeholder = value;
  }

  /**
   * Getter placeholder
   * @returns {string|boolean}
   */
  get placeholder(){
    return this._settings.placeholder;
  }

  /**
   * Disable input
   * @param {boolean} disable
   */
  set disabled(disable){
    this._settings.disabled = disable;
    this._element.disabled = disable;

    let changeClass;

    changeClass = disable ? utils.addClass : utils.removeClass;
    changeClass(this.container, 'disabled');
  }

  /**
   * Getter disabled
   * @returns {boolean}
   */
  get disabled(){
    return this._settings.disabled;
  }

  /**
   *
   * @param value
   */
  set restrict(value){
    this._settings.restrict = this.constructor._fixSetting('restrict', value);
  }

  get restrict(){
    return this._settings.restrict;
  }

  /**
   * Setter container
   * @param {string|element} container
   */
  set container(container){
    this._container = this.constructor._fixSetting('container', container);
    this._container.appendChild(this._rootElement);
  }

  /**
   * Getter container
   * @returns {*}
   */
  get container(){
    return this._container;
  }

  /**
   *
   * @param settings
   */
  set spinner(settings){
    settings = this.constructor._fixSetting('spinner', settings);

    if(settings){
      if(!this._spinner){
        this._spinner = new Spinner(this, settings);
      }

      //this._spinner.applySettings(settings);
    } else {
      // need to hide/remove spinner
    }
  }

  get spinner(){
    return this._spinner;
  }

  set formatter(formatter){
    this._formatter = this.constructor._fixSetting('format', formatter);
  }

  get formatter(){
    return this._formatter;
  }

  set unformatter(unformatter){
    this._unformatter = this.constructor._fixSetting('format', unformatter);
  }

  get unformatter(){
    return this._unformatter;
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

  /**
   *
   * @param value
   * @param {string} pattern
   * @returns {string}
   * @private
   */
  _restrict(value, pattern) {
    pattern = pattern || this._settings.restrict;

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
    return this._settings.validate(value);
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

    return value ? this._settings.unformatter(value) : '';
  }

  /**
   * format the data using formatter from settings
   * @returns {*}
   * @private
   */
  _format() {
    if(this.value){
      return this._settings.formatter(this.value);
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
    if (!this._settings.disabled) return;

    this._settings.disabled = true;
    this._element.disabled = true;

    utils.addClass(this.container, 'disabled');
  }

  /**
   * Enable formatting input
   */
  enable() {
    if (this._settings.disabled) return;

    this._settings.disabled = false;
    this._element.disabled = false;

    utils.removeClass(this.container, 'disabled');
  }

  /**
   * @private
   */
  _render() {
    this._rootElement = document.createElement('div');
    this._element = document.createElement('input');
    this._elementLabel = document.createElement('label');

    // attach events
    this._element.addEventListener('focus', this._focus.bind(this));
    this._element.addEventListener('blur', this._blur.bind(this));
    this._element.addEventListener('input', this._input.bind(this));

    this._rootElement.appendChild(this._elementLabel);
    this._rootElement.appendChild(this._element);

    utils.addClass(this._rootElement, INPUT_CLASS);
  }

  _init() {
    this._element.addEventListener('keydown', (e) => {
      if(this._spinner){
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
      }
    });
  }

  /**
   *
   * @param name
   * @param setting
   * @private
   */
  static _fixSetting(name, setting) {
    switch(name){
      // string part
      case 'label':
      case 'placeholder':
      case 'preset':
      case 'restrict':
        if(typeof setting !== 'string'){
          setting = '';
        }
        break;
      case 'container':
        if(!(setting instanceof HTMLElement)){
          if(typeof setting === 'string'){
            let element = document.querySelector(setting);

            if(element){
              setting = element;
            }
          } else {
            setting = null;
          }
        }
        break;
      case 'disabled':
        if(typeof setting !== 'boolean'){
          return false;
        }
        break;
      case 'required':
        break;
      case 'spinner':
        if(typeof setting !== 'object'){
          setting = false;
        }
        break;
      case 'value':
        break;
      case 'formatter':
      case 'unformatter':
        if(typeof setting !== 'function'){
          setting = this.formatter || this.SETTINGS.formatter;
        }
        break;
    }

    return setting;
  }

  /**
   *
   * @param settings
   * @private
   */
  static _fixSettings(settings) {
    let name;

    for(name in settings){
      if(settings.hasOwnProperty(name)){
        settings[name] = this._fixSetting(name, settings[name]);
      }
    }

    return settings;
  }

  _applySettings(settings){
    let template = templates[settings.preset];

    if(typeof template !== 'undefined'){
      settings = merge.recursive(true, template, settings);
    }

    this._settings = merge.recursive(true, this.SETTINGS, settings);
    this._settings = this.constructor._fixSettings(settings);

    // call setters for settings which defined in DEFAULT_SETTINGS only
    for (let key in this.SETTINGS) {
      if (this.SETTINGS.hasOwnProperty(key)) {
        this[key] = settings[key];
      }
    }
  }
}

module.exports = CgInput;