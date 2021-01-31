import dayjs from "dayjs";
import Abstract from "./abstract.js";
import {offersData, destinationsData} from "../const.js";
import {POINTS_ROUTE} from "../const.js"

const createEditEventTemplate = (event) => {
  const {pointRoute, nameRoute, price, dateFrom, dateTo, offers: offersEvent, destination} = event;

  const namesDestinationsData = Array(destinationsData.length).fill().map((element, i) => {return destinationsData[i].name});

  const createDestinationTemplate = () => {
    const createPicturesTemplate = () => {
      let result = destination.pictures.reduce(function (layot, picture) {
        const {src, description} = picture;
        return layot + `<img class="event__photo" src="${src}" alt="${description}">`;
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
  // ------------------------- Города
  const createNamesEventTemplate = () => {
    let result = namesDestinationsData.reduce(function (layot, name) {
      return layot + `<option value="${name}"></option>`;
    }, ``);

    return result;
  };
  // --------------------------- ТИПЫ
  const createTypeTemplate = (type) => {
    return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  };

  const createTypesEventTemplate = () => {
    let result = POINTS_ROUTE.reduce(function (layot, type) {
      return layot + createTypeTemplate(type);
    }, ``);

    return result;
  };

  // --------------------- Доп. опции
  const isCheckedOffer = (title) => {
    let index = offersEvent.findIndex((offer) => offer.title === title);
    return index !== -1 ? `checked` : ``;
  }

  const createOfferTemplate = (title, price, i) => {
    return (`<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${i}" type="checkbox" name="event-offer-luggage" ${isCheckedOffer(title)}>
    <label class="event__offer-label" for="event-offer-luggage-${i}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`);
  };

  const createOffersTemplate = () => {
    let index = offersData.findIndex((offer) => offer.type === pointRoute);

    let result = offersData[index].offers.reduce(function (layot, offer, i) {
      const {title, price} = offer;
      return layot + createOfferTemplate(title, price, i);
    }, ``);

    return result;
  };

  const createSectionOffersTemplate = () => {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${createOffersTemplate()}
    </div>
  </section>`;
  };
  // --------------------

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
          ${createNamesEventTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format(`DD/MM/YY mm:ss`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format(`DD/MM/YY mm:ss`)}">
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
    ${offersEvent.length ? createSectionOffersTemplate() : ``}
    ${destination ? createDestinationTemplate() : ``}
    </section>
  </form>
</li>`;
};

export default class EditEvent extends Abstract {
  constructor(event) {
    super();

    this._event = event;
    this._clickHandler = this._clickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
  }

  _getTemplate() {
    return createEditEventTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickOpenEvent(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  _submitHandler(evt) {
    evt.preventDefault();

    this._callback.submit();
  }

  setSubmitEvent(callback) {
    this._callback.submit = callback;

    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
  }
}
