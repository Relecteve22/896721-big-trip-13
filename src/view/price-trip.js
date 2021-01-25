import {createElement} from "../utils.js";

const createPriceTripTemplate = () => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`;
};

export default class PriceTrip {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createPriceTripTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
