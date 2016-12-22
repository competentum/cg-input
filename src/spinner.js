import utils from 'cg-component-utils';
import merge from 'merge';

const SPINNER_CLASS = 'cg-spinner';
const INCREASE_CLASS = `${SPINNER_CLASS}-increase`;
const DECREASE_CLASS = `${SPINNER_CLASS}-decrease`;

class Spinner {
  static get DEFAULT_SETTINGS(){
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        min: 0,
        max: 7,
        step: 1
      };
    }
    return this._DEFAULT_SETTINGS;
  }

  /**
   *
   * @param {Object} input
   * @param {Object} [settings]
   */
  constructor(input, settings){
    this.input = input;
    this.settings = merge.recursive(true, this.constructor.DEFAULT_SETTINGS, (settings || {}));

    this._render();
  }

  get step(){
    return this.settings.step;
  }

  increase(){
    this.input.value = parseInt(this.input.value, 10) + this.step;
  }

  decrease(){
    this.input.value -= this.step;
  }

  _render(){
    let parent = this.input._element.parentNode;

    let spinnerIncrease = `<a><span></span></a>`;
    let spinnerDecrease = `<a><span></span></a>`;

    this._spinnerIncrease = utils.createHTML(spinnerIncrease);
    this._spinnerDecrease = utils.createHTML(spinnerDecrease);

    this._spinnerIncrease.className = INCREASE_CLASS;
    this._spinnerDecrease.className = DECREASE_CLASS;

    if(parent){
      utils.addClass(parent, SPINNER_CLASS);

      parent.appendChild(this._spinnerIncrease);
      parent.appendChild(this._spinnerDecrease);
    }

    // Attach events
    this._spinnerIncrease.addEventListener('click', this.increase.bind(this));
    this._spinnerDecrease.addEventListener('click', this.decrease.bind(this));
  }
}


module.exports = Spinner;