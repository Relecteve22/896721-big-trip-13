import EditEventView from "../view/edit-event.js";

export default class EditEventPresenter {
  constructor() {
    this._eventEditComponent = new EditEventView(this._event);
  }

  
}
