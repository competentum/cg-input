'use strict';

import './common.less';

import EventEmitter from 'events';
import utils from 'cg-component-utils';

// todo: describe settings properties here
/**
 * Slider's customizing settings
 * @typedef {Object} TemplateComponentSettings
 * @property {Element|string} container - DOM Element or element id in which slider should be rendered.
 *                                        This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
 */

class CgTemplateComponent extends EventEmitter {

  /**
   *
   * @returns {TemplateComponentSettings}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        // todo: add defaults here
      };
    }
    return this._DEFAULT_SETTINGS;
  }

  static get EVENTS() {
    if (!this._EVENTS) {
      this._EVENTS = {
        CHANGE: 'change'
      };
    }
    return this._EVENTS;
  }

  /**
   *
   * @param {TemplateComponentSettings} settings
   */
  constructor(settings) {
    super();

    //todo: initialization
    this.settings = settings;
  }

  /**
   * @private
   */
  _render() {
    //todo: draw here
    var elementHTML = `
      <div></div>
    `;
    utils.createHTML(elementHTML);
  }

}

module.exports = CgTemplateComponent;