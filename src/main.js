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
import {render, RenderPosition, replace} from "./utils/render.js";

const EVENTS_COUNT = 3;
const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const siteHeaderElement = document.querySelector(`header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);

const tripInfoComponent = new InfoRouteView();
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new PriceTripView(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

render(tripControlsElement, new FilterView(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);

const createBoardEvent = () => {
  if (!events.length) {
    render(tripEventsElement, new ListEmptyView(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripEventsElement, new SortView(), RenderPosition.BEFOREEND);

  const tripEventsListComponent = new ListView();
  render(tripEventsElement, tripEventsListComponent, RenderPosition.BEFOREEND);

  const renderEvent = (eventListElement, event) => {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EditEventView(event);

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setClickOpenForm(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setClickOpenEvent(() => {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setSubmitEvent(() => {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
  };

  events
  .slice(0, Math.min(events.length, EVENTS_COUNT))
  .forEach((event) => renderEvent(tripEventsListComponent, event));
};

createBoardEvent();
