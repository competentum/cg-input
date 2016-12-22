'use strict';

import './common.less';

import Spinner from './spinner';

import EventEmitter from 'events';
import utils from 'cg-component-utils';
import merge from 'merge';

const INPUT_CLASS = 'cg-input';

class CgInput extends EventEmitter {

  /**
   *
   * @returns {TemplateComponentSettings}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        label: false,
        placeholder: false,
        spinner: false,
        formatter: function (v) {
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
        BLUR: 'blur'
      };
    }
    return this._EVENTS;
  }

  constructor(settings) {
    super();

    this.settings = merge.recursive(true, this.constructor.DEFAULT_SETTINGS, (settings || {}));

    this._render();
    this._init();
  }

  /**
   * return value of the input Element
   * @returns {String}
   */
  get value() {
    return this._value;
  }

  /**
   * Set value to the input Element
   * @param {*} value
   */
  set value(value) {
    this._value = value;

    if(this.value){
      this._element.value = this.format();
    }
  }

  /**
   * Focus callback
   */
  focus() {
    // insert don't formatted value
    if(this.value){
      this._element.value = this.value;
    }

    this.emit(this.constructor.EVENTS.FOCUS);
  }

  /**
   * Change callback
   */
  change() {
    this.emit(this.constructor.EVENTS.CHANGE);
  }

  /**
   * Blur callback
   */
  blur() {
    // update value
    this.value = this._element.value;

    this.emit(this.constructor.EVENTS.BLUR);
  }

  format() {
    return this.settings.formatter(this.value);
  }

  /**
   * Disable formatting input
   */
  disable() {
    this._element.disabled = true;
    utils.addClass(this.container, 'disabled');
  }

  /**
   * Enable formatting input
   */
  enable() {
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
    this._element.addEventListener('focus', this.focus.bind(this));
    this._element.addEventListener('blur', this.blur.bind(this));
    this._element.addEventListener('input', this.change.bind(this));

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