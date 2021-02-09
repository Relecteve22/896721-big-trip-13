export default class Offers {
  constructor() {
    this._offers = [];
    this._pointRoute = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  setPointsRoute(pointRoute) {
    this._pointRoute = pointRoute.slice();
  }

  getOffers() {
    return this._offers;
  }

  getPointsRoute() {
    return this._pointRoute;
  }

  getOfferIndexByTypePoint(pointChoosen) {
    return this._offers.findIndex((offer) => offer.type === pointChoosen);
  }
}
