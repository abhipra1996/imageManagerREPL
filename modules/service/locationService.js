const { getConnection } = require("typeorm");
const { generateResponseObject } = require("../response");
const { Location, validateCoordinates } = require("../entity/location");
const { Image } = require("../entity/image");
const { extractCreateObject } = require("../util");

exports.getLocationByName = async (db, locationName) => {
    try {
        const locationObj = await db
            .getRepository(Location)
            .createQueryBuilder("locations")
            .where(
                "locations.name = :name AND locations.is_deleted = :isDeleted",
                {
                    name: locationName,
                    isDeleted: false,
                }
            )
            .getOne();
        if (locationObj === undefined) {
            return generateResponseObject(
                false,
                {},
                "Location Does Not Exists"
            );
        } else {
            return await generateResponseObject(true, locationObj, "");
        }
    } catch (error) {
        return await generateResponseObject(false, {}, error.toString());
    }
};

exports.createLocation = async (locationName, xCoordinate, yCoordinate) => {
    try {
        if (validateCoordinates(xCoordinate, yCoordinate)) {
            let location = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Location)
                .values({
                    name: locationName,
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate,
                })
                .execute();
            return generateResponseObject(
                true,
                extractCreateObject(location),
                ""
            );
        } else {
            return generateResponseObject(
                false,
                {},
                "Coordinates out of range"
            );
        }
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.removeLocationByID = async (locationID) => {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
        await getConnection()
            .createQueryBuilder()
            .update(Location)
            .set({ isDeleted: true, deletedAt: new Date() })
            .where("id = :id", { id: locationID })
            .execute();
        await getConnection()
            .createQueryBuilder()
            .update(Image)
            .set({ isDeleted: true, deletedAt: new Date() })
            .where("location_id = :location_id", {
                location_id: locationID,
            })
            .execute();
        await queryRunner.commitTransaction();
        return generateResponseObject(true, {}, "");
    } catch (error) {
        await queryRunner.rollbackTransaction();
        return generateResponseObject(false, {}, error.toString());
    } finally {
        await queryRunner.release();
    }
};

exports.getAllLocationsByParams = async (db, queryParams) => {
    try {
        let locationList = await db.getRepository(Location).find(queryParams);
        return generateResponseObject(true, locationList, "");
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};
