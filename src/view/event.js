import dayjs from "dayjs";
import Abstract from "./abstract.js";

const createEventTemplate = (event) => {
  const {pointRoute, nameRoute, price, isFavorite, dateFrom, dateTo, offers} = event;

  const returnRangeDate = (dueFromDate, dueToDate) => {
    const SECONDS_IN_MINUTES = 60;
    const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTES;
    const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

    const dateFinish = dayjs(dueToDate);
    const diffSeconds = dateFinish.diff(dayjs(dueFromDate), `second`);

    const diffDays = Math.floor(diffSeconds / SECONDS_IN_DAY);
    const diffHours = Math.floor((diffSeconds - diffDays * SECONDS_IN_DAY) / SECONDS_IN_HOUR);
    const diffMinutes = Math.floor((diffSeconds - diffHours * SECONDS_IN_HOUR - diffDays * SECONDS_IN_DAY) / SECONDS_IN_MINUTES);

    let result = ``;
    result += diffDays ? `${diffDays.toString().padStart(2, `0`)}D ` : `''`;
    result += diffHours || diffDays ? `${diffHours.toString().padStart(2, `0`)}H ` : `''`;
    result += `${diffMinutes.toString().padStart(2, `0`)}M`;

    return result;
  };

  const createOfferTemplate = (title, price) => {
    return (`
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`);
  };

  const createOffersTemplate = () => {
    let result = offers.reduce(function (layot, offer) {
      const {title, price} = offer;
      return layot + createOfferTemplate(title, price);
    }, ``);

    return result;
  };

  const favoriteClassName = isFavorite ? `event__favorite-btn--active` : ``;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(dateFrom).format()}">${dayjs(dateFrom).format(`MMM D`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${pointRoute}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${pointRoute} ${nameRoute}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(dateFrom).format()}">${dayjs(dateFrom).format(`hh:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(dateTo).format()}">${dayjs(dateTo).format(`hh:mm`)}</time>
        </p>
        <p class="event__duration">${returnRangeDate(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersTemplate()}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Event extends Abstract {
  constructor(event) {
    super();

    this._event = event;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _getTemplate() {
    return createEventTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickOpenForm(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }
}

