import EventView from "../view/event.js";
import EditEventView from "../view/edit-event.js";
import {render, RenderPosition, replace} from "../utils/render.js";

export default class Event {
  constructor(eventListElement) {
    this._eventListElement = eventListElement;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleEventClick = this._handleEventClick.bind(this);
    this._handleFormSubmitClick = this._handleFormSubmitClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EditEventView(this._event);

    this._eventComponent.setClickOpenForm(this._handleEditClick);
    this._eventEditComponent.setClickOpenEvent(this._handleEventClick);
    this._eventEditComponent.setSubmitEvent(this._handleFormSubmitClick);

    render(this._eventListElement, this._eventComponent, RenderPosition.BEFOREEND);
  }

  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDownHandler);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
    }
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmitClick() {
    this._replaceEventToForm();
  }

  _handleEventClick() {
    this._replaceFormToEvent();
  }
}
