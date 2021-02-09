import AddNewEvent from "../view/add-new-event.js";
import {UserAction, UpdateType, defaultEvent} from "../const.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import UpdateEvent from "../utils/updateEvent.js";

export default class AddNewEventPresenter extends UpdateEvent {
  constructor(eventListElement, changeData, offersModel, destinationsModel) {
    super();

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._changeData = changeData;

    this._eventListElement = eventListElement;
    this._addNewEventComponent = null;

    this._bindHandler();
  }

  init(event) {
    this._event = event;
    const prevAddNewEventComponent = this._addNewEventComponent;

    this._addNewEventComponent = new AddNewEvent(
        this._offersModel.getOffers(),
        this._offersModel.getPointsRoute(),
        this._offersModel.getOfferIndexByTypePoint(this._event.pointRoute),
        this._destinationsModel.getDestinations(),
        this._destinationsModel.getCitysDestination(),
        this._event
    );

    if (prevAddNewEventComponent !== null) {
      replace(this._addNewEventComponent, prevAddNewEventComponent);
      remove(prevAddNewEventComponent);
    } else {
      render(this._eventListElement, this._addNewEventComponent, RenderPosition.AFTERBEGIN);
    }
    this._setInnerHandlers();
  }

  replaceEventToForm(eventComponent) {
    replace(this._addNewEventComponent, eventComponent);
  }

  replaceFormEditToEvent(eventComponent) {
    replace(eventComponent, this._addNewEventComponent);
  }

  destroy() {
    remove(this._addNewEventComponent);
    this._addNewEventComponent = null;
  }

  _setInnerHandlers() {
    const offersData = this._offersModel.getOffers();
    const indexOfferData = this._offersModel.getOfferIndexByTypePoint(this._event.pointRoute);

    this._addNewEventComponent.setPriceChangeHandler(this._handlePriceChange);
    this._addNewEventComponent.setDateFromPicker(this._handleStartTimeChange);
    this._addNewEventComponent.setDateToPicker(this._handlerFinishTimeChange);
    this._addNewEventComponent.setTypesEventChangeHandler(this._handlerTypesEventChange);
    this._addNewEventComponent.setValuesNameChangeHandler(this._handlerValuesNameChange);
    if (offersData[indexOfferData].offers.length !== 0) {
      this._addNewEventComponent.setOffersChangeHandler(this._handlerOfferChecked, this._handlerOfferUnChecked);
    }
    this._addNewEventComponent.setClickClose(this._handleCloseClick);
    this._addNewEventComponent.setSubmitEvent(this._handleFormSubmit);
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
    this._addNewEventComponent.setDateToPicker(this._handlerFinishTimeChange);
  }

  _handlerFinishTimeChange(userDate) {
    this.updateData({
      dateTo: userDate
    }, true);
    // this._handleStartTimeChange(userDate);
    this._addNewEventComponent.setDateFromPicker(this._handleStartTimeChange);
  }

  _handleFormSubmit() {
    this._changeData(
        UserAction.ADD_ELEMENT,
        UpdateType.MINOR,
        this._event
    );
    this.destroy();
  }

  _handleCloseClick() {
    this.destroy();
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
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }
}
