import { API_URL } from "../configs/global.mjs";
import { HolidaysRouter } from "./holidays/router.holiday.mjs";

const IndexAPI = (app) => {
    const holidayRouter = HolidaysRouter();

    app.use(`${API_URL}/holidays`, holidayRouter.holidayRoute);
};

export default IndexAPI;
