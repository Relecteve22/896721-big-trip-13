import InfoRouteView from "./view/info-route.js";
import PriceTripView from "./view/price-trip.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import PointsModel from "./model/points.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";

import TripPresenter from "./presenter/trip.js";

const EVENTS_COUNT = 3;
const events = new Array(EVENTS_COUNT).fill(null).map(generateEvent);

const eventsModel = new PointsModel();
eventsModel.setEvents(events);

const siteHeaderElement = document.querySelector(`header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const tripInfoComponent = new InfoRouteView();
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new PriceTripView(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

render(tripControlsElement, new FilterView(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElement, eventsModel);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
