import SortView from "../view/sort.js";
import ListView from "../view/list.js";
import ListEmptyView from "../view/list-empty.js";
import EventPresenter from "./event.js";
// import AddNewEventView from "./view/add-new-event.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {getWeightPrice, getWeightTime, getWeightEventDayStart} from "../utils/event.js";
import {UpdateType, UserAction, SortType} from "../const.js";

export default class Trip {
  constructor(tripEventContainer, eventsModel) {
    this._eventsModel = eventsModel;
    this._tripEventContainer = tripEventContainer;

    this._sortComponent = null;
    this._tripEventsListComponent = new ListView();
    this._listEmptyComponent = new ListEmptyView();
    this._eventPresenterMap = new Map();

    this._currentSortType = SortType.DAY;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._eventsModel.getEvents().sort(getWeightEventDayStart);

    this._renderBoard();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._eventsModel.getEvents().slice().sort(getWeightEventDayStart);
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort(getWeightTime);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(getWeightPrice);
    }

    return this._eventsModel.getEvents();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripEventsListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenterMap[event.id] = eventPresenter;
  }

  _renderEventsList() {
    this._getEvents().forEach((event) => this._renderEvent(event));
  }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._eventPresenterMap)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenterMap = {};

    remove(this._sortComponent);
    remove(this._listEmptyComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderBoard() {
    if (!this._eventsModel.getEvents().length) {
      render(this._tripEventContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderSort();

    render(this._tripEventContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderEventsList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_ELEMENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_ELEMENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_ELEMENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenterMap[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleEventChange(updatedEvent) {
    this._eventPresenterMap[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
    .values(this._eventPresenterMap)
    .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }
}
