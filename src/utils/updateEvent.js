export default class UpdateEvent {
  constructor() {
    this._event = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._event = Object.assign(
        {},
        this._event,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.init(this._event);
  }

  init() {
    throw new Error(`init not implemented`);
  }
}
