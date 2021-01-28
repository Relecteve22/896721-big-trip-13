import SortView from "../view/sort.js";
import ListView from "../view/list.js";
import ListEmptyView from "../view/list-empty.js";
import EventPresenter from "./event.js";
// import AddNewEventView from "./view/add-new-event.js";

import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";

const EVENTS_COUNT = 3;

export default class Trip {
  constructor(tripEventContainer) {
    this._tripEventContainer = tripEventContainer;
    this._sortComponent = new SortView();
    this._tripEventsListComponent = new ListView();
    this._listEmptyComponent = new ListEmptyView();
    this._eventPresenter = {};

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._tripEvents = events;
    if (!this._tripEvents.length) {
      render(this._tripEventContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderSort();

    render(this._tripEventContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderEventsList();
  }

  _renderSort() {
    render(this._tripEventContainer, new SortView(), RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripEventsListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(from, to) {
    this._tripEvents
    .slice(from, to)
    .forEach((event) => this._renderEvent(event));
  }

  _renderEventsList() {
    this._renderEvents(0, Math.min(this._tripEvents.length, EVENTS_COUNT));
  }

  _clearTaskList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _handleEventChange(updatedEvent) {
    this._tripEvents = updateItem(this._tripEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
    .values(this._eventPresenter)
    .forEach((presenter) => presenter.resetView());
  }
}
