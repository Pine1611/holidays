import axios from "axios";
import path from "path";

import { ICAL_URL, FOLDER_DATA } from "../../configs/global.mjs";
import { createCustomError } from "../../utils/customError.mjs";
import { parseICALData } from "../../utils/processICAL.mjs";
import * as utils from "../../utils/utilsHoliday.mjs";
import * as rwData from "../../utils/readwriteData.mjs";

export const getHolidaysCountry = async (req, res, next) => {
    try {
        const { country, year } = req.params;

        const dataSource = Object.entries(ICAL_URL).filter(([key]) => key.includes(country));
        // get current year
        const currentYear = new Date().getFullYear();
        const prevYear = currentYear - 1;
        const nextYear = currentYear + 1;

        // check country and year valid
        if (dataSource.length === 0 || !dataSource) return next(createCustomError("invalid_route", 404));
        if (year) {
            // this case use for have exist year
            // valid year is number
            if (year && isNaN(year)) return next(createCustomError("invalid_route", 404));

            const filePath = path.join(`${FOLDER_DATA}/${country}/${year}/`, "date.json");
            const data = await rwData.readDataFile(filePath);

            // return error if file doesn't exist
            if (data.error) {
                return next(createCustomError(data.error, data.code));
            }

            return res.status(200).json({
                msg: "Read data json successfully!",
                country: country,
                year: year,
                data: data,
            });
        } else {
            // get data from ical url
            const icalData = await axios.get(dataSource[0][1]);
            // parse ical data
            const calendar = parseICALData(icalData.data);

            // declare array for store all holidays
            let holidays = {};
            // store data to object holiday
            calendar.events.forEach((event) => {
                let startDate = utils.convertICALDate(event.DTSTART);

                if (startDate.getFullYear() >= prevYear && startDate.getFullYear() <= nextYear) {
                    holidays[startDate.toLocaleDateString("en-CA").toString()] = event.SUMMARY;
                }
            });

            // sort holidays
            holidays = utils.sortHolidays(holidays);
            // write data files for 3 years
            const folderPath = path.join(`${FOLDER_DATA}/${country}/`);
            const filePathCountry = path.join(folderPath, "date.json");
            // check folder path exist?
            await rwData.initDir(folderPath);
            // write data holidays for last year, this year, and next year of country
            rwData.writeDataFile(holidays, filePathCountry);

            // write data for each year
            [prevYear, currentYear, nextYear].forEach(async (year) => {
                const dataByYear = utils.filterHolidaysByYear(holidays, year, year);
                const folderYear = path.join(folderPath, `${year}/`);
                const filePathByYear = path.join(folderYear, "date.json");

                // before write data need check folder exist?
                await rwData.initDir(folderYear);
                rwData.writeDataFile(dataByYear, filePathByYear);
            });

            return res.status(200).json({
                msg: "List data holiday for country in previous year, current year and next year",
                country: country,
                dataParse: holidays,
            });
        }
    } catch (error) {
        return next(createCustomError("default_error", 500));
    }
};
