import "dotenv/config";
import { join } from "path";

const SERVER_PORT = process.env.SERVER_PORT ? process.env.SERVER_PORT : "3000";
const API_URL = process.env.API_URL ? process.env.API_URL : "/api/v1";
const FOLDER_DATA = join("docs", API_URL);

const ICAL_URL = {
    vn: "https://calendar.google.com/calendar/ical/en.vietnamese%23holiday%40group.v.calendar.google.com/public/basic.ics",
};

export { SERVER_PORT, API_URL, ICAL_URL, FOLDER_DATA };
