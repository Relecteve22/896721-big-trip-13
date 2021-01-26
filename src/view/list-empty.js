import Abstract from "./abstract.js";

const createListEmptyTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class ListEmpty extends Abstract {
  _getTemplate() {
    return createListEmptyTemplate();
  }
}
