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
        max: 100,
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

    this.settings = merge.recursive(true, this.SETTINGS, settings);

    this._render();
  }

  get SETTINGS(){
    return this.constructor.DEFAULT_SETTINGS;
  }

  get step(){
    return this.settings.step;
  }

  set step(value){
    this.settings.step = value;
  }

  get max(){
    return this.settings.max;
  }

  set max(value){
    this.settings.max = value;
  }

  get min(){
    return this.settings.min;
  }

  set min(value){
    this.settings.min = value;
  }

  increase(){
    this.value = this.input.value + this.step;
    this._update();
  }

  decrease(){
    this.value = this.input.value - this.step;
    this._update();
  }

  _update(){
    this.value = isNaN(this.value) ? 0 : this.value;
    this.value = Math.max(this.min, this.value);
    this.value = Math.min(this.max, this.value);

    this.input.value = this.value;
    this.input._element.value = this.value;
  }

  _render(){
    let parent = this.input._element.parentNode;

    let spinnerIncrease = '<a><span></span></a>';
    let spinnerDecrease = '<a><span></span></a>';

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
    this._spinnerIncrease.addEventListener('mousedown', this.increase.bind(this));
    this._spinnerDecrease.addEventListener('mousedown', this.decrease.bind(this));
  }
}


module.exports = Spinner;