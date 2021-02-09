import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";
import {POINTS_ROUTE, NAMES_ROUTE} from "../const.js";
import {offersData, destinationsData} from "../const.js";

const offersStatic = offersData;

const generateRandomElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

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
  const pointRoute = generateRandomElement(POINTS_ROUTE);

  const generateOffers = () => {
    const index = offersStatic.findIndex((offer) => offer.type === pointRoute);
    let offersSlice = Array.from(offersStatic[index].offers);
    const randomOffers = new Set(offersSlice);
    for (let randomOffer of randomOffers) {
      if (Boolean(getRandomInteger(0, 1)) || Boolean(getRandomInteger(0, 1))) {
        randomOffers.delete(randomOffer);
      }
    }
    return Array.from(randomOffers);
  };

  return {
    id: generateId(),
    pointRoute,
    nameRoute: generateRandomElement(NAMES_ROUTE),
    destination: generateRandomElement(destinationsData),
    price: getRandomInteger(10, 100),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    dateFrom: generateFromDate(),
    dateTo: generateToDate(),
    offers: generateOffers(),
  };
};
