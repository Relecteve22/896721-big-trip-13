import EventView from "../view/event.js";
import EditEventPresenter from "./edit-event.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType, Mode} from "../const.js";
import Offers from "../model/offers.js";
import Destinations from "../model/destinations.js";
import {offersData, destinationsData, POINTS_ROUTE} from "../const.js";

export default class Event {
  constructor(eventListElement, changeData, changeMode) {
    this._eventListElement = eventListElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._modeEvent = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._replaceFormEditToEvent = this._replaceFormEditToEvent.bind(this);
    this._handlerCloseEditComponent = this._handlerCloseEditComponent.bind(this);

    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;

    this.setModels();

    this._eventComponent = new EventView(this._event);
    this._editEventPresenter = new EditEventPresenter(this._eventListElement,
        this._changeData,
        this._offersModel,
        this._destinationsModel,
        this._replaceFormEditToEvent,
        this._handlerCloseEditComponent);
    this._editEventPresenter.init(this._event);
    this._replaceFormEditToEvent();

    this._eventComponent.setClickOpenForm(this._handleEditClick);
    this._eventComponent.setClickFavorite(this._handleFavoriteClick);

    if (prevEventComponent === null) {
      render(this._eventListElement, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._modeEvent === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._modeEvent === Mode.EDITING) {
      this._editEventPresenter.init(this._event);
    }

    remove(prevEventComponent);
    this._editEventPresenter.destroy();
  }

  resetView() {
    if (this._modeEvent !== Mode.DEFAULT) {
      this._replaceFormEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    this._editEventPresenter.destroy();
  }

  _replaceEventToFormEdit() {
    this._editEventPresenter.replaceEventToForm(this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDownHandler);
    this._changeMode();
    this._modeEvent = Mode.EDITING;
  }

  _replaceFormEditToEvent() {
    this._editEventPresenter.replaceFormEditToEvent(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
    this._modeEvent = Mode.DEFAULT;
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._handlerCloseEditComponent();
      document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
    }
  }

  _handlerCloseEditComponent() {
    this._editEventPresenter.reset(this._event);
    this._replaceFormEditToEvent();
  }

  _handleEditClick() {
    this._replaceEventToFormEdit();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_ELEMENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  setModels() {
    this._offersModel = new Offers();
    this._offersModel.setOffers(offersData);
    this._offersModel.setPointsRoute(POINTS_ROUTE);

    this._destinationsModel = new Destinations();
    this._destinationsModel.setDestinations(destinationsData);
    this._destinationsModel.setCitysDestination(destinationsData);
  }
}
