const { createConnection } = require("typeorm");
const { generateResponseObject } = require("../response");
const { Location } = require("../entity/location");
const { Image } = require("../entity/image");

const dbHost = "abhinav-dev.cogugg91zocs.ap-south-1.rds.amazonaws.com";
const dbName = "postgres";
const dbUserName = "postgres";
const dbPassword = "mypostgresserver";

exports.dbInit = async () => {
    try {
        const db = await createConnection({
            type: "postgres",
            schema: "imagemanager",
            host: dbHost,
            port: 5432,
            username: dbUserName,
            password: dbPassword,
            database: dbName,
            entities: [Image, Location],
            logging: false,
            uuidExtension: "pgcrypto",
        });
        return generateResponseObject(true, { dbConnInstance: db }, "");
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};
