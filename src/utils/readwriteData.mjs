import * as fs from "fs/promises";

/**
 * First step, check is folder exist, if not will create folder by folder path.
 * Next, after folder valid, check  is data file exist, if not will create data file for write data.
 * @param {String} folderPath
 * @returns resolve
 */
export function initDir(folderPath) {
    return new Promise((resolve) => {
        const stepInit = {
            isFolderExist: async () => {
                try {
                    await fs.access(folderPath, fs.constants.F_OK);
                    resolve(true);
                } catch (error) {
                    if (error.code === "ENOENT") {
                        console.log("Data directory doesn't exist!");
                        console.log("Initializing directory...");
                        const dataDir = await fs.mkdir(folderPath, {
                            recursive: true,
                        });
                        console.log(`Data directory has been created: ${dataDir}`);
                        resolve(true);
                    } else {
                        console.log(error);
                        resolve(false);
                    }
                }
                stepInit.isFileExist();
            },
            isFileExist: async () => {
                try {
                    await fs.access(folderPath, fs.constants.F_OK);
                    resolve(true);
                } catch (error) {
                    if (error.code === "ENOENT") {
                        console.log("Data file doesn't exist!");
                        console.log("Initializing new data file...");
                        const data = {};
                        await fs.writeFile(folderPath, JSON.stringify(data, null, 4), {
                            flag: "w+",
                            encoding: "utf8",
                        });
                        console.log("Data file has been created: ", folderPath);
                        resolve(true);
                    } else {
                        console.log("Something wrong when access file!");
                        resolve(false);
                    }
                }
            },
        };

        stepInit.isFolderExist();
    });
}

/**
 * Read JSON data file
 * @param {String} filePath
 * @returns JSON string data
 */
export async function readDataFile(filePath) {
    try {
        const data = await fs.readFile(filePath, { encoding: "utf8" });
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("Files does not exist! Please re-check folder data");
            return { error: "invalid_file", code: error.code };
        } else {
            console.log("Something wrong when CLI running!", error);
        }
        process.exit(1);
    }
}

/**
 * Write JSON data file
 * @param {JSON} data
 * @param {String} filePath
 */
export async function writeDataFile(data, filePath) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 4), {
            flag: "w+",
            encoding: "utf8",
        });
    } catch (error) {
        console.log(error);
        console.log("Something wrong when writing data file!");
        process.exit(1);
    }
}
