import express from "express";
import * as holiday from "./controller.holiday.mjs";

export const HolidaysRouter = () => {
    const holidayRoute = express.Router();

    holidayRoute.route(["/:country", "/:country/:year"]).get(holiday.getHolidaysCountry);

    return { holidayRoute };
};
