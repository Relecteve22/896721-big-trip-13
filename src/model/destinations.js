export default class Destinations {
  constructor() {
    this._destinations = [];
    this._citysDestination = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  setCitysDestination(destinations) {
    this._citysDestination = Array(destinations.length).fill(null).map((element, i) => {
      return this._destinations[i].name;
    });
  }

  getDestinations() {
    return this._destinations;
  }

  getCitysDestination() {
    return this._citysDestination;
  }
}
