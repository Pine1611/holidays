import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";

import { SERVER_PORT } from "./src/configs/global.mjs";

import { notFound } from "./src/middlewares/notFound.mjs";
import { handleError } from "./src/middlewares/handleError.mjs";
import IndexAPI from "./src/resources/index.mjs";

/**
 * @description initial configs server
 */
// const PORT = SERVER_PORT === undefined ? 3000 : SERVER_PORT;
const PORT = SERVER_PORT;
const app = express();
const server = createServer(app);

const corsOptions = {
    origin: `https://localhost:${PORT}`,
    optionsSuccessStatus: 200,
};

/**
 * @description import middlewares
 */
app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(express.json());
app.use(helmet());
app.use(express.static("./docs"));

/**
 * @description Begin for API routes
 */
app.get("/", (_req, res, _next) => {
    try {
        return res.status(200).json({ message: "Server connected!" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

IndexAPI(app);

/**
 * @description Response for route not found and handle error when something went wrong!
 */
app.use(notFound);
app.use(handleError);

/**
 * @description Startup Server
 * For the first, listening and start up server via port in .env files
 * And the second, checking if error catch up port in use, just reconnect with default port.
 */
server
    .listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    })
    .on("error", (_error) => {
        if (_error.code === "EADDRINUSE") {
            console.error("Server port in use, reconnecting...");
            setTimeout(() => {
                server.listen(3001, () => {
                    console.log(`Server running on port: ${3001}`);
                });
            }, 3000);
        } else {
            console.error("Something went wrong with server, please try again later!");
        }
    });
