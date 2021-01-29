import SortView from "../view/sort.js";
import ListView from "../view/list.js";
import ListEmptyView from "../view/list-empty.js";
import EventPresenter from "./event.js";
// import AddNewEventView from "./view/add-new-event.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";

import {getWeightPrice, getWeightTime} from "../utils/event.js"

const EVENTS_COUNT = 3;

export default class Trip {
  constructor(tripEventContainer) {
    this._tripEventContainer = tripEventContainer;
    this._sortComponent = new SortView();
    this._tripEventsListComponent = new ListView();
    this._listEmptyComponent = new ListEmptyView();
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._tripEvents = events;

    this._sourceTripEvent = this._tripEvents.slice();

    if (!this._tripEvents.length) {
      render(this._tripEventContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderSort();

    render(this._tripEventContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderEventsList();
  }

  _renderSort() {
    render(this._tripEventContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._tripEvents.sort(getWeightTime);
        break;
      case SortType.PRICE:
        this._tripEvents.sort(getWeightPrice);
        break;
      default:

        this._tripEvents = this._sourceTripEvent.slice();
    }

    this._currentSortType = sortType;
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
    // this._sourceTripEvent = this._tripEvents.slice();
  }

  _handleModeChange() {
    Object
    .values(this._eventPresenter)
    .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearTaskList();
    this._renderEventsList();
  }
}
