import {getRandomInteger} from "../utils/common.js";
import {POINTS_ROUTE, NAMES_ROUTE, DESTINATION, OFFERS, DESCRIPTION_PHOTOS} from "../const.js";

export const generateOffersData = () => {
  const OFFERS_COUNT = POINTS_ROUTE.length;

  const generateOffers = () => {
    let offers = new Set();
    let maxOffers = getRandomInteger(0, 7);
    for (let i = 0; i < maxOffers; i++) {
      offers.add(OFFERS[getRandomInteger(0, maxOffers)]);
    }
    return Array.from(offers);
  };

  const offers = Array(OFFERS_COUNT).fill(null).map((element, i) => {
    return {
      type: POINTS_ROUTE[i],
      offers: generateOffers(),
    };
  });

  return offers;
};

export const generateDestinationsData = () => {
  const DESTINATION_COUNT = NAMES_ROUTE.length;

  const generatePhotos = () => {
    let photos = [];
    for (let i = 0; i < getRandomInteger(0, 10); i++) {
      photos.push({
        src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 100)}`,
        description: DESCRIPTION_PHOTOS[getRandomInteger(0, DESCRIPTION_PHOTOS.length - 1)]
      });
    }
    return Array.from(photos);
  };

  const destinations = Array(DESTINATION_COUNT).fill(null).map((element, i) => {
    let description = DESTINATION[getRandomInteger(0, DESTINATION.length - 1)];
    return {
      description,
      name: NAMES_ROUTE[i],
      pictures: !description ? null : generatePhotos()
    };
  });

  return destinations;
};
