/**
 * parse ICAL base on each lines
 * @param {String} icalData string ICAL data after read from google calendar
 * @returns object data after formated ICAL
 */

export const parseICALData = (icalData) => {
    const calendar = {
        properties: [],
        events: [],
    };

    // A line is folded if it's followed by a space or tab
    const unfoldedIcalString = icalData.replace(/\r\n[\s\t]/g, "");
    // Split by CRLF or LF and remove empty lines
    const lines = unfoldedIcalString.split(/\r\n|\n/).filter((line) => line.trim() !== "");

    let currentProperty = null;

    for (const line of lines) {
        if (line.startsWith("X-WR-")) {
            let props = line.substring(5);
            const { key, value } = parseProperty(props);

            // store calendar name, timezone and desc
            key === "CALNAME" ? calendar.properties.push({ name: value }) : "";
            key === "TIMEZONE" ? calendar.properties.push({ timezone: value }) : "";
            key === "CALDESC" ? calendar.properties.push({ desc: value }) : "";
        } else if (line.startsWith("BEGIN:VEVENT")) {
            const event = {};
            // add event
            calendar.events.push(event);
            // initial current property
            currentProperty = event;
        } else if (line.startsWith("END:VEVENT")) {
            // clear current property
            currentProperty = null;
        } else if (currentProperty) {
            // parse property
            const { key, value } = parseProperty(line);

            const keyStore = ["DTSTART", "DTEND", "SUMMARY"];

            // store property event
            if (keyStore.includes(key)) {
                currentProperty[key] = value;
            }
        }
    }

    return calendar;
};

/**
 * Format string ICAL line
 * @param {String} line string line ICAL data
 * @returns object with key and value
 */
const parseProperty = (line) => {
    const parts = line.split(":");
    let keyPart = parts[0];
    // Value can contain colons
    const value = parts.slice(1).join(":");

    if (keyPart.includes(";")) {
        const keyAndParams = keyPart.split(";");
        keyPart = keyAndParams[0];
    }

    return { key: keyPart.toUpperCase(), value };
};
