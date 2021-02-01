import dayjs from "dayjs";
import flatpickr from "flatpickr";
import Smart from "./smart.js";
import {offersData, destinationsData} from "../const.js";
import {POINTS_ROUTE} from "../const.js"
import {formatDate} from "../utils/common.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createDestinationTemplate = (destination, isDestination) => {
  const createPicturesTemplate = () => {
    let result = destination.pictures.reduce(function (layot, picture) {
      const {src, description} = picture;
      return layot + `<img class="event__photo" src="${src}" alt="${description}">`;
    }, ``);

    return result;
  };

  return isDestination ? `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">
      ${destination.description}
    </p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPicturesTemplate()}
      </div>
    </div>
  </section>`: ``;
};

const createNamesEventTemplate = (namesDestinations) => {
  let result = namesDestinations.reduce(function (layot, name) {
    return layot + `<option value="${name}"></option>`;
  }, ``);

  return result;
};

const createTypesEventTemplate = () => {
  const createTypeTemplate = (type) => {
    return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  };

  let result = POINTS_ROUTE.reduce(function (layot, type) {
    return layot + createTypeTemplate(type);
  }, ``);

  return result;
};

const isCheckedOffer = (offers, title) => {
  let index = offers.findIndex((offer) => offer.title === title);
  return index !== -1 ? `checked` : ``;
}
const createSectionOffersTemplate = (offers, point, isOffers) => {
  const createOfferTemplate = (title, price, i) => {
    return (`<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${i}" type="checkbox" name="event-offer-luggage" ${isCheckedOffer(offers, title)}>
    <label class="event__offer-label" for="event-offer-luggage-${i}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`);
  };

  const createOffersTemplate = () => {
    let index = offersData.findIndex((offer) => offer.type === point);

    let result = offersData[index].offers.reduce(function (layot, offer, i) {
      const {title, price} = offer;
      return layot + createOfferTemplate(title, price, i);
    }, ``);

    return result;
  };

  return isOffers ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${createOffersTemplate()}
  </div>
</section>` : ``;
};

const createEditEventTemplate = (data) => {
  const {pointRoute, nameRoute, price, dateFrom, dateTo, offers: offersEvent, destination, isDestination, isOffers} = data;

  const namesDestinationsData = Array(destinationsData.length).fill().map((element, i) => {return destinationsData[i].name});

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${pointRoute}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypesEventTemplate()}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${pointRoute}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${nameRoute}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createNamesEventTemplate(namesDestinationsData)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
    ${createSectionOffersTemplate(offersEvent, pointRoute, isOffers)}
    ${createDestinationTemplate(destination, isDestination)}
    </section>
  </form>
</li>`;
};

export default class EditEvent extends Smart {
  constructor(event) {
    super();

    this._data = EditEvent.parseEventToData(event);
    this._datepicker = {};

    this._clickHandler = this._clickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startTimeRouteChangeHandler = this._startTimeRouteChangeHandler.bind(this);
    this._finishTimeRouteChangeHandler = this._finishTimeRouteChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  _getTemplate() {
    return createEditEventTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitEvent(this._callback.submit);
  }

  _setInnerHandlers() {
    this._setDateFromPicker();
    this._setDateToPicker();
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceChangeHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EditEvent.parseDataToEvent(this._data));
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    evt.target.value = evt.target.value.replace (/[^\+\d]/g, '');
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _startTimeRouteChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate
    }, true);
    this._setDateToPicker();
  }

  _finishTimeRouteChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate
    }, true);
    this._setDateFromPicker();
  }

  _setDateFromPicker() {
    if (this._datepicker.dateFrom) {
      this._datepicker.dateFrom.destroy();
      this._datepicker.dateFrom = null;
    }

    this._datepicker.dateFrom = flatpickr(
      this.getElement().querySelector(`#event-start-time-1`),
        {
          maxDate: this._data.dateTo,
          enableTime: true,
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.dateFrom,
          onChange: this._startTimeRouteChangeHandler
        }
    );
  }

  _setDateToPicker() {
    if (this._datepicker.dateTo) {
      this._datepicker.dateTo.destroy();
      this._datepicker.dateTo = null;
    }

    this._datepicker.dateTo = flatpickr(
      this.getElement().querySelector(`#event-end-time-1`),
        {
          minDate: this._data.dateFrom,
          enableTime: true,
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.dateTo,
          onChange: this._finishTimeRouteChangeHandler
        }
    );
  }

  setClickOpenEvent(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  setSubmitEvent(callback) {
    this._callback.submit = callback;

    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDestination: event.destination.description !== null,
          isOffers: event.offers.length !== 0
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDestination;
    delete data.isOffers;

    return data;
  }
}
