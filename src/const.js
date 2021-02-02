import {generateOffersData, generateDestinationsData} from "./mock/offer-and-destination.js";

export const SortType = {
  DAY: `day`,
  TIME: `time`,
  PRICE: `price`
};
export const DEFAULT_OFFERS = [
  {
    title: `Add luggage`,
    price: 10
  },
  {
    title: `Switch to comfort class`,
    price: 100
  },
  {
    title: `Add meal`,
    price: 15
  },
  {
    title: `Choose seats`,
    price: 5
  },
  {
    title: `Travel by train`,
    price: 40
  }
];

export const SECONDS_IN_MINUTES = 60;
export const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTES;
export const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

// СНИЗУ ВСЁ ДЛЯ ГЕНЕРАЦИИ МОКОВЫХ ДАННЫХ

export const POINTS_ROUTE = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
export const NAMES_ROUTE = [`Amsterdam`, `Chamonix`, `Geneva`, `Paris`, `Moscow`];
export const DESTINATION = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`, null];
export const DESCRIPTION_PHOTOS = [`Amsterdam is very good`, `Chamonix is city`, `Geneva is good`, `Paris is city`, `Moscow is city`];
export const OFFERS = [
  {
    title: `Add luggage`,
    price: 10
  },
  {
    title: `Rent a car`,
    price: 20
  },
  {
    title: `Order Uber`,
    price: 60
  },
  {
    title: `Lunch in city`,
    price: 40
  },
  {
    title: `Add breakfast`,
    price: 10
  },
  {
    title: `Switch to comfort class`,
    price: 100
  },
  {
    title: `Add meal`,
    price: 15
  },
  {
    title: `Choose seats`,
    price: 5
  },
  {
    title: `Travel by train`,
    price: 40
  }
];

export const offersData = generateOffersData();
export const destinationsData = generateDestinationsData();
