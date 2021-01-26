import Abstract from "./abstract.js";

const createPriceTripTemplate = () => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`;
};

export default class PriceTrip extends Abstract {
  _getTemplate() {
    return createPriceTripTemplate();
  }
}
