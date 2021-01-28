import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";
import {POINTS_ROUTE, NAMES_ROUTE, DESTINATION} from "../const.js";

const titlesOffer = [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add breakfast`, `Book tickets`, `Lunch in city`];

const generateRandomElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generatePhotos = () => {
  const photos = new Set();
  for (let i = 0; i < getRandomInteger(0, 10); i++) {
    photos.add(`http://picsum.photos/248/152?r=${getRandomInteger(0, 100)}`);
  }
  return Array.from(photos);
};

const generateFromDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, 0);
  const maxHoursGap = 12;
  const hoursGap = getRandomInteger(-maxHoursGap, maxHoursGap);
  const maxMinutesGap = 60;
  const minutesGap = getRandomInteger(-maxMinutesGap, maxMinutesGap);

  return dayjs().add(daysGap, `day`).add(hoursGap, `hour`).add(minutesGap, `minutes`).toDate();
};

const generateToDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(0, maxDaysGap);
  const maxHoursGap = 12;
  const hoursGap = getRandomInteger(-maxHoursGap, maxHoursGap);
  const maxMinutesGap = 60;
  const minutesGap = getRandomInteger(-maxMinutesGap, maxMinutesGap);

  return dayjs().add(daysGap, `day`).add(hoursGap, `hour`).add(minutesGap, `minutes`).toDate();
};

export const generateEvent = () => {

  const OFFERS_COUNT = getRandomInteger(0, 5);

  const generateOffer = () => {
    return {
      title: generateRandomElement(titlesOffer),
      price: getRandomInteger(0, 100),
    };
  };

  const offers = Array(OFFERS_COUNT).fill().map(generateOffer);

  return {
    id: generateId(),
    pointRoute: generateRandomElement(POINTS_ROUTE),
    nameRoute: generateRandomElement(NAMES_ROUTE),
    destination: generateRandomElement(DESTINATION),
    photos: generatePhotos(),
    price: getRandomInteger(10, 100),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    dateFrom: generateFromDate(),
    dateTo: generateToDate(),
    offers,
  };
};
