import EventView from "../view/event.js";
import EditEventView from "../view/edit-event.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(eventListElement, changeData, changeMode) {
    this._eventListElement = eventListElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._modeEvent = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleEventClick = this._handleEventClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EditEventView(this._event);

    this._eventComponent.setClickOpenForm(this._handleEditClick);
    this._eventComponent.setClickFavorite(this._handleFavoriteClick);
    this._eventEditComponent.setClickOpenEvent(this._handleEventClick);
    this._eventEditComponent.setSubmitEvent(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventListElement, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._modeEvent === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._modeEvent === Mode.EDITING) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this._modeEvent !== Mode.DEFAULT) {
      this._replaceFormEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _replaceEventToFormEdit() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDownHandler);
    this._changeMode();
    this._modeEvent = Mode.EDITING;
  }

  _replaceFormEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
    this._modeEvent = Mode.DEFAULT;
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceFormEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
    }
  }

  _handleEditClick() {
    this._replaceEventToFormEdit();
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.UPDATE_ELEMENT,
        UpdateType.MINOR,
        event
    );
    this._replaceFormEditToEvent();
  }

  _handleEventClick() {
    this._eventEditComponent.reset(this._event);
    this._replaceFormEditToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_ELEMENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_ELEMENT,
        UpdateType.MINOR,
        event
    );
  }
}
