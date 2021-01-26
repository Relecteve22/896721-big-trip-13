import Abstract from "./abstract.js";

const createListTemplate = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class List extends Abstract {
  _getTemplate() {
    return createListTemplate();
  }
}

