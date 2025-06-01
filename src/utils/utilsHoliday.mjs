/**
 * Format string ICAL date
 * @param {Date} strDate
 * @returns formated date
 */
const convertICALDate = (strDate) => {
    let year = parseInt(strDate.substring(0, 4));
    let month = parseInt(strDate.substring(4, 6)) - 1;
    let day = parseInt(strDate.substring(6, 8));

    return new Date(year, month, day);
};

/**
 * sort holidays by start date
 * @param {JSON} holidays JSON string data holidays
 * @returns JSON strong data holidays after sort by date
 */
const sortHolidays = (holidays) => {
    const sortAble = Object.fromEntries(
        Object.entries(holidays).sort((a, b) => {
            const dateA = new Date(a[0]);
            const dateB = new Date(b[0]);
            return dateA.getTime() - dateB.getTime();
        })
    );

    return sortAble;
};

/**
 * filter holidays by range years
 * @param {JSON} holidays JSON string data holidays after parse from ICAL google calendar
 * @param {String} startYear
 * @param {String} endYear
 * @returns JSON string data holidays after filter by start year and end year
 */
const filterHolidaysByYear = (holidays, startYear, endYear) => {
    const entries = Object.fromEntries(
        Object.entries(holidays).filter((data) => {
            const year = new Date(data[0]).getFullYear();

            return year >= startYear && year <= endYear;
        })
    );

    return entries;
};

export { convertICALDate, sortHolidays, filterHolidaysByYear };
