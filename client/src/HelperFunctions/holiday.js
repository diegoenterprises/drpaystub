import moment from "moment";

export const format = "DD/MM/YYYY";
const fixedHolidays = ["01/01", "04/07", "11/11", "25/12"];

const getFirstDay = (year, month, dayName) => {
  const momentStartMonth = moment()
    .set("year", year)
    .set("month", month)
    .startOf("month");
  let day = momentStartMonth.format("dddd");
  let isMonday = day === dayName;
  if (isMonday) {
    return momentStartMonth;
  }
  while (!isMonday) {
    momentStartMonth.add(1, "day");
    isMonday = momentStartMonth.format("dddd") === dayName;
  }
  return momentStartMonth;
};

const getLastDay = (year, month, dayName) => {
  const momentEndMonth = moment()
    .set("year", year)
    .set("month", month)
    .endOf("month");

  let day = momentEndMonth.format("dddd");
  let isRightDay = day === dayName;
  if (isRightDay) {
    return momentEndMonth;
  }
  while (!isRightDay) {
    momentEndMonth.subtract(1, "day");
    isRightDay = momentEndMonth.format("dddd") === dayName;
  }
  return momentEndMonth;
};

const getMartinLutherHoliday = (year) => {
  const firstMonday = getFirstDay(year, 0, "Monday");
  firstMonday.add(14, "days");
  return firstMonday.format(format);
};

const getPresidentHoliday = (year) => {
  const firstMonday = getFirstDay(year, 1, "Monday");
  firstMonday.add(14, "days");
  return firstMonday.format(format);
};

const getLaborDay = (year) => {
  const firstMonday = getFirstDay(year, 8, "Monday");
  return firstMonday.format(format);
};

const getColumbusDay = (year) => {
  const firstMonday = getFirstDay(year, 9, "Monday");
  firstMonday.add(7, "days");
  return firstMonday.format(format);
};

const getThanksgiving = (year) => {
  const firstThur = getFirstDay(year, 10, "Thursday");
  firstThur.add(21, "days");
  return firstThur.format(format);
};

const getMemorial = (year) => {
  const firstThur = getLastDay(year, 4, "Monday");
  return firstThur.format(format);
};

const getAllFederalHolidays = (year) => {
  return [
    getMemorial(year),
    getThanksgiving(year),
    getColumbusDay(year),
    getLaborDay(year),
    getPresidentHoliday(year),
    getMartinLutherHoliday(year),
  ];
};

export const getHolidays = (year) => {
  const momentStartYear = moment().set("year", year).startOf("year");
  const momentEndYear = moment().set("year", year).endOf("year").format(format);
  let isLastDate = momentStartYear.format(format) === momentEndYear;
  const weekends = [];
  while (!isLastDate) {
    if (["Saturday", "Sunday"].includes(momentStartYear.format("dddd"))) {
      weekends.push(momentStartYear.format(format));
    }
    momentStartYear.add(1, "day");
    isLastDate = momentStartYear.format(format) === momentEndYear;
  }
  let fixedHolidayDates = fixedHolidays.map((i) => `${i}/${year}`);
  return [...weekends, ...fixedHolidayDates, ...getAllFederalHolidays(year)];
};

export const getFiveYearHoldiays = () => {
  let momentYear = moment();
  const holidays = [];
  for (let i = 0; i < 5; i++) {
    let year = momentYear.format("YYYY");
    holidays.push({
      year: year,
      holidays: getHolidays(year),
    });
    momentYear.add(1, "year");
  }
  return holidays;
};

export const holidays = getFiveYearHoldiays();
