import InfoRouteView from "./view/info-route.js";
import PriceTripView from "./view/price-trip.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import ListView from "./view/list.js";
import EventView from "./view/event.js";
import EditEventView from "./view/edit-event.js";
import ListEmptyView from "./view/list-empty.js";
// import AddNewEventView from "./view/add-new-event.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils.js";

const EVENTS_COUNT = 3;
const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const siteHeaderElement = document.querySelector(`header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const tripInfoComponent = new InfoRouteView();
render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripInfoComponent.getElement(), new PriceTripView().getElement(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);

render(tripControlsElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);

const createBoardEvent = () => {
  if (!events.length) {
    render(tripEventsElement, new ListEmptyView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

  const tripEventsListComponent = new ListView();
  render(tripEventsElement, tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

  const renderEvent = (eventListElement, event) => {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EditEventView(event);

    const replaceEventToForm = () => {
      eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    };

    const replaceFormToEvent = () => {
      eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
  };

  events
  .slice(0, Math.min(events.length, EVENTS_COUNT))
  .forEach((event) => renderEvent(tripEventsListComponent.getElement(), event));
};

createBoardEvent();
