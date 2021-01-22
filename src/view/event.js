import dayjs from "dayjs";

export const createEventTemplate = (event) => {
  const {pointRoute, nameRoute, price, isFavorite, dateFrom, dateTo, offers} = event;
  console.log(event);

  const returnRangeDate = (dueFromDate, dueToDate) => {
    const dateFinish = dayjs(dueToDate);
    const range = dateFinish.diff(dayjs(dueFromDate));
    return dayjs(range).format(`DD[D] HH[H] m[M]`);
  };

  const createOfferTemplate = (title, price) => {
    return (`<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </li>`);
  }

  const createOffersTemplate = () => {
    let result = offers.reduce(function(layot, offer) {
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
