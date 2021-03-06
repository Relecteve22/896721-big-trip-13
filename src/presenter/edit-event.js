import EditEventView from "../view/edit-event.js";
import {UserAction, UpdateType} from "../const.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import UpdateEvent from "../utils/updateEvent.js";

export default class EditEventPresenter extends UpdateEvent {
  constructor(eventListElement, changeData, offersModel, destinationsModel, callbackReplace, callbackCloseEditComponent) {
    super();

    this._offersModel = offersModel;
    this._callbackReplace = callbackReplace;
    this._destinationsModel = destinationsModel;
    this._changeData = changeData;
    this._callbackCloseEditComponent = callbackCloseEditComponent;

    this._eventListElement = eventListElement;
    this._eventEditComponent = null;

    this._bindHandler();
  }

  init(event) {
    this._event = event;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventEditComponent = new EditEventView(this._event,
        this._offersModel.getOffers(),
        this._offersModel.getPointsRoute(),
        this._offersModel.getOfferIndexByTypePoint(this._event.pointRoute),
        this._destinationsModel.getDestinations(),
        this._destinationsModel.getCitysDestination()
    );

    if (prevEventEditComponent !== null) {
      replace(this._eventEditComponent, prevEventEditComponent);
      remove(prevEventEditComponent);
    } else {
      render(this._eventListElement, this._eventEditComponent, RenderPosition.AFTERBEGIN);
    }
    this._setInnerHandlers();
  }

  replaceEventToForm(eventComponent) {
    replace(this._eventEditComponent, eventComponent);
  }

  replaceFormEditToEvent(eventComponent) {
    replace(eventComponent, this._eventEditComponent);
  }

  reset(event) {
    this.updateData(
        event
    );
  }

  destroy() {
    remove(this._eventEditComponent);
  }

  _setInnerHandlers() {
    const offersData = this._offersModel.getOffers();
    const indexOfferData = this._offersModel.getOfferIndexByTypePoint(this._event.pointRoute);

    this._eventEditComponent.setPriceChangeHandler(this._handlePriceChange);
    this._eventEditComponent.setDateFromPicker(this._handleStartTimeChange);
    this._eventEditComponent.setDateToPicker(this._handlerFinishTimeChange);
    this._eventEditComponent.setTypesEventChangeHandler(this._handlerTypesEventChange);
    this._eventEditComponent.setValuesNameChangeHandler(this._handlerValuesNameChange);
    if (offersData[indexOfferData].offers.length !== 0) {
      this._eventEditComponent.setOffersChangeHandler(this._handlerOfferChecked, this._handlerOfferUnChecked);
    }
    this._eventEditComponent.setClickOpenEvent(this._handleEventClick);
    this._eventEditComponent.setSubmitEvent(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
  }

  _handlerOfferChecked(dataOfferChange) {
    this.updateData({
      offers: [...this._event.offers, dataOfferChange]
    }, true);
  }

  _handlerOfferUnChecked(dataOfferChange) {
    const EventOffersSet = new Set(this._event.offers);
    EventOffersSet.delete(dataOfferChange);
    this.updateData({
      offers: Array.from(EventOffersSet)
    }, true);
  }

  _handlerValuesNameChange(indexNamesInArr) {
    this.updateData({
      destination: this._destinationsModel.getDestinations()[indexNamesInArr]
    });
  }

  _handlerTypesEventChange(eventTarget) {
    this.updateData({
      pointRoute: eventTarget.target.dataset.type,
      offers: []
    });
  }

  _handlePriceChange(eventTarget) {
    this.updateData({
      price: eventTarget.target.value
    }, true);
  }

  _handleStartTimeChange(userDate) {
    this.updateData({
      dateFrom: userDate
    }, true);
    // this._handlerFinishTimeChange(userDate);
    this._eventEditComponent.setDateToPicker(this._handlerFinishTimeChange);
  }

  _handlerFinishTimeChange(userDate) {
    this.updateData({
      dateTo: userDate
    }, true);
    // this._handleStartTimeChange(userDate);
    this._eventEditComponent.setDateFromPicker(this._handleStartTimeChange);
  }

  _handleFormSubmit() {
    this._changeData(
        UserAction.UPDATE_ELEMENT,
        UpdateType.MINOR,
        this._event
    );
    this._callbackReplace();
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_ELEMENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleEventClick() {
    this._callbackCloseEditComponent();
  }

  _bindHandler() {
    this._handlePriceChange = this._handlePriceChange.bind(this);
    this._handleStartTimeChange = this._handleStartTimeChange.bind(this);
    this._handlerFinishTimeChange = this._handlerFinishTimeChange.bind(this);
    this._handlerTypesEventChange = this._handlerTypesEventChange.bind(this);
    this._handlerValuesNameChange = this._handlerValuesNameChange.bind(this);
    this._handlerOfferChecked = this._handlerOfferChecked.bind(this);
    this._handlerOfferUnChecked = this._handlerOfferUnChecked.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEventClick = this._handleEventClick.bind(this);
  }
}
