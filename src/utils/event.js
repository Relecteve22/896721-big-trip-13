import dayjs from "dayjs";

export const getWeightPrice = (dateA, dateB) => {
  if (dateA.price === dateB.price) {
    return 0;
  }

  if (dateB.price > dateA.price) {
    return 1;
  }

  if (dateA.price > dateB.price) {
    return -1;
  }

  return null;
};

export const getWeightTime = (dateA, dateB) => {
  const returnSecondsDate = (date) => {
    const dateFinishDate = dayjs(date.dateTo);
    return dateFinishDate.diff(dayjs(date.dateFrom));
  }
  
  const diffSecondsDateA = returnSecondsDate(dateA);
  const diffSecondsDateB = returnSecondsDate(dateB);

  if (diffSecondsDateA > diffSecondsDateB) {
    return -1;
  }

  if (diffSecondsDateA < diffSecondsDateB) {
    return 1;
  }

  return null;
};
