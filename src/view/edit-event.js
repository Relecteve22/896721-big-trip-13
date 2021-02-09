import flatpickr from "flatpickr";
import he from "he";
import Abstract from "./abstract.js";
import {formatDate} from "../utils/common.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createDestinationTemplate = (destination) => {
  const createPicturesTemplate = () => {
    let result = destination.pictures.reduce(function (layout, picture) {
      const {src, description} = picture;
      return layout + `<img class="event__photo" src="${src}" alt="${description}">`;
    }, ``);

    return result;
  };

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">
      ${destination.description}
    </p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPicturesTemplate()}
      </div>
    </div>
  </section>`;
};

const createNamesEventTemplate = (namesDestinations) => {
  let result = namesDestinations.reduce(function (layout, name) {
    return layout + `<option value="${name}"></option>`;
  }, ``);

  return result;
};

const createTypesEventTemplate = (pointsRoute) => {
  const createTypeTemplate = (type) => {
    return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input visually-hidden" data-type="${type}" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  };

  let result = pointsRoute.reduce(function (layout, type) {
    return layout + createTypeTemplate(type);
  }, ``);

  return result;
};

const isCheckedOffer = (offers, title) => {
  const index = offers.findIndex((offer) => offer.title === title);
  return index !== -1 ? `checked` : ``;
};

const createSectionOffersTemplate = (offers, indexOffersInArr, offersData) => {
  const createOfferTemplate = (title, price, i) => {
    return (`<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${i}" data-index="${i}" type="checkbox" name="event-offer-luggage" ${isCheckedOffer(offers, title)}>
    <label class="event__offer-label" for="event-offer-luggage-${i}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`);
  };

  const createOffersTemplate = () => {
    let result = offersData[indexOffersInArr].offers.reduce(function (layout, offer, i) {
      const {title, price} = offer;
      return layout + createOfferTemplate(title, price, i);
    }, ``);

    return result;
  };

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${createOffersTemplate()}
  </div>
</section>`;
};

const createEditEventTemplate = (data, indexOffersInArr, offersData, pointsRoute, citysDestination) => {
  const {pointRoute, price, dateFrom, dateTo, offers: offersEvent, destination} = data;

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
            ${createTypesEventTemplate(pointsRoute)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${pointRoute}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createNamesEventTemplate(citysDestination)}
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
    ${offersData[indexOffersInArr].offers.length !== 0 ? createSectionOffersTemplate(offersEvent, indexOffersInArr, offersData) : ``}
    ${destination.description ? createDestinationTemplate(destination) : ``}
    </section>
  </form>
</li>`;
};

export default class EditEvent extends Abstract {
  constructor(event, offersInfo, pointsRoute, offerIndexByTypePoint, destinations, citysDestination) {
    super();

    this._event = event;
    this._destinations = destinations;
    this._citysDestination = citysDestination;
    this._offersInfo = offersInfo;
    this._pointsRoute = pointsRoute;
    this._offerIndexByTypePoint = offerIndexByTypePoint;

    this._datepicker = {};

    this._bindHandler();
  }

  _getTemplate() {
    return createEditEventTemplate(this._event, this._offerIndexByTypePoint, this._offersInfo, this._pointsRoute, this._citysDestination);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._event);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    evt.target.value = evt.target.value.replace(/[^\+\d]/g, ``);

    this._callback.price(evt);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._event);
  }

  _startTimeRouteChangeHandler([userDate]) {
    this._userDateTime = userDate;
    this._callback.dateFrom(this._userDateTime);
  }

  _finishTimeRouteChangeHandler([userDate]) {
    this._userDateTime = userDate;
    this._callback.dateTo(this._userDateTime);
  }

  _typesEventChangeHandler(evt) {
    evt.preventDefault();
    this._callback.typesChange(evt);
  }

  _valueNameChangeHandler(evt) {
    evt.preventDefault();
    for (let nameDestinations of this._citysDestination) {
      if (evt.target.value === nameDestinations) {
        const indexNamesInArr = this._destinations.findIndex((destination) => destination.name === evt.target.value);
        this._callback.valuesNameChange(indexNamesInArr);
        break;
      }
    }
  }

  _offersActiveChangeHandler(evt) {
    evt.preventDefault();
    const dataOfferChange = this._offersInfo[this._offerIndexByTypePoint].offers[evt.target.dataset.index];

    if (evt.target.checked) {
      this._callback.offerChecked(dataOfferChange);
      return;
    }

    this._callback.offerUnChecked(dataOfferChange);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.dateTo.destroy();
      this._datepicker.dateFrom.destroy();
      this._datepicker = {};
    }
  }

  setOffersChangeHandler(callbackChecked, callbackUnChecked) {
    this._callback.offerChecked = callbackChecked;
    this._callback.offerUnChecked = callbackUnChecked;
    this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._offersActiveChangeHandler);
  }

  setValuesNameChangeHandler(callback) {
    this._callback.valuesNameChange = callback;
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._valueNameChangeHandler);
  }

  setTypesEventChangeHandler(callback) {
    this._callback.typesChange = callback;
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._typesEventChangeHandler);
  }

  setDateFromPicker(callback) {
    this._callback.dateFrom = callback;
    if (this._datepicker.dateFrom) {
      this._datepicker.dateFrom.destroy();
      this._datepicker.dateFrom = null;
    }

    this._datepicker.dateFrom = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          "maxDate": this._event.dateTo,
          "enableTime": true,
          "time_24hr": true,
          "dateFormat": `d/m/y H:i`,
          "defaultDate": this._event.dateFrom,
          "onChange": this._startTimeRouteChangeHandler
        }
    );
  }

  setDateToPicker(callback) {
    this._callback.dateTo = callback;
    if (this._datepicker.dateTo) {
      this._datepicker.dateTo.destroy();
      this._datepicker.dateTo = null;
    }

    this._datepicker.dateTo = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          "minDate": this._event.dateFrom,
          "enableTime": true,
          "time_24hr": true,
          "dateFormat": `d/m/y H:i`,
          "defaultDate": this._event.dateTo,
          "onChange": this._finishTimeRouteChangeHandler
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

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setPriceChangeHandler(callback) {
    this._callback.price = callback;
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
  }

  _bindHandler() {
    this._clickHandler = this._clickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startTimeRouteChangeHandler = this._startTimeRouteChangeHandler.bind(this);
    this._finishTimeRouteChangeHandler = this._finishTimeRouteChangeHandler.bind(this);
    this._offersActiveChangeHandler = this._offersActiveChangeHandler.bind(this);
    this._typesEventChangeHandler = this._typesEventChangeHandler.bind(this);
    this._valueNameChangeHandler = this._valueNameChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
  }
}
