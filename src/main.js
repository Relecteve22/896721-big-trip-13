import {createInfoRouteTemplate} from "./view/info-route.js";
import {createPriceTripTemplate} from "./view/price-trip.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createListTemplate} from "./view/list.js";
import {createEventTemplate} from "./view/event.js";
import {createEditEventTemplate} from "./view/edit-event.js";
import {createAddNewEventTemplate} from "./view/add-new-event.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_COUNT = 3;
const events = new Array(EVENTS_COUNT).fill().map(generateEvent);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
render(tripMainElement, createInfoRouteTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);
render(tripInfoElement, createPriceTripTemplate(), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, createMenuTemplate(), `afterbegin`);

render(tripControlsElement, createFilterTemplate(), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortTemplate(), `beforeend`);

render(tripEventsElement, createListTemplate(), `beforeend`);
const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

// render(tripEventsListElement, createAddNewEventTemplate(events[0]), `afterbegin`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate(events[i]), `beforeend`);
}


