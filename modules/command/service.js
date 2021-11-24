const { getRepository } = require("typeorm");
const {
    generateResponseObject,
    generateResponseObjectString,
} = require("../response");
const { validateCoordinates } = require("../entity/location");
const { generateArrayFromObjectArray } = require("../util");
const { Image } = require("../entity/image");
const {
    getLocationByName,
    createLocation,
    getAllLocationsByParams,
    removeLocationByID,
} = require("../service/locationService");
const {
    createImage,
    removeImageByFileName,
    getImageByFileName,
    getAllImagesByParams,
} = require("../service/imageService");
const {
    validateDistanceQuery,
    getAllImagesByDistance,
} = require("../service/distanceService");

exports.addImage = async (params, context) => {
    try {
        if (validateCoordinates(params["xCoordinate"], params["yCoordinate"])) {
            let locationID = "";
            currentLocationResponse = await getLocationByName(
                context.db,
                params["locationName"]
            );
            if (currentLocationResponse.success) {
                // if valid location exists extract and set location id
                locationID = (currentLocationResponse.data || {}).id;
            } else {
                // if valid location does not exists create location
                let locationObjectResponse = await createLocation(
                    params["locationName"],
                    params["xCoordinate"],
                    params["yCoordinate"]
                );
                if (locationObjectResponse.success) {
                    // extract and set location id
                    locationID = (locationObjectResponse.data || {}).id;
                } else {
                    return generateResponseObject(
                        false,
                        {},
                        "add image failed"
                    );
                }
            }
            let imageResponse = await createImage(
                params["fileName"],
                locationID
            );
            const responseString = imageResponse.success ? "OK" : "";
            return generateResponseObjectString(
                imageResponse.success,
                responseString,
                imageResponse.errorDesc
            );
        } else {
            return generateResponseObject(false, {}, "Coordinate Out Range");
        }
    } catch (error) {
        return generateResponseObject(false, {}, "add image failed");
    }
};

exports.addLocation = async (params, context) => {
    try {
        let locationObjectResponse = await createLocation(
            params["locationName"],
            params["xCoordinate"],
            params["yCoordinate"]
        );
        const responseString = locationObjectResponse.success ? "OK" : "";
        return generateResponseObjectString(
            locationObjectResponse.success,
            responseString,
            locationObjectResponse.errorDesc
        );
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.removeImage = async (params, context) => {
    try {
        const imageObjectResponse = await getImageByFileName(
            context.db,
            params["fileName"]
        );
        if (imageObjectResponse.success) {
            let imageDeleteObjectResponse = await removeImageByFileName(
                params["fileName"]
            );
            const responseString = imageDeleteObjectResponse.success
                ? "OK"
                : "";
            return generateResponseObjectString(
                imageDeleteObjectResponse.success,
                responseString,
                imageDeleteObjectResponse.errorDesc
            );
        } else {
            return generateResponseObjectString(
                imageObjectResponse.success,
                imageObjectResponse.data,
                imageObjectResponse.errorDesc
            );
        }
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.removeLocation = async (params, context) => {
    try {
        const locationObjectResponse = await getLocationByName(
            context.db,
            params["locationName"]
        );
        if (locationObjectResponse.success) {
            let locationDeleteObjectResponse = await removeLocationByID(
                locationObjectResponse.data.id
            );
            const responseString = locationDeleteObjectResponse.success
                ? "OK"
                : "";
            return generateResponseObjectString(
                locationDeleteObjectResponse.success,
                responseString,
                locationDeleteObjectResponse.errorDesc
            );
        } else {
            return generateResponseObjectString(
                locationObjectResponse.success,
                locationObjectResponse.data,
                locationObjectResponse.errorDesc
            );
        }
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.listAllImages = async (params, context) => {
    try {
        let queryParams = {
            isDeleted: false,
        };
        let imageListResponse = await getAllImagesByParams(
            context.db,
            queryParams
        );
        return generateResponseObject(
            imageListResponse.success,
            generateArrayFromObjectArray(imageListResponse.data, "fileName"),
            imageListResponse.errorDesc
        );
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.listAllLocations = async (params, context) => {
    try {
        let queryParams = {
            isDeleted: false,
        };
        let locationListResponse = await getAllLocationsByParams(
            context.db,
            queryParams
        );
        return generateResponseObject(
            locationListResponse.success,
            generateArrayFromObjectArray(locationListResponse.data, "name"),
            locationListResponse.errorDesc
        );
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.listImagesByLocation = async (params, context) => {
    try {
        let imageList = await getRepository(Image).find({
            where: {
                location: { name: params["locationName"], isDeleted: false },
                isDeleted: false,
            },
            relations: ["location"],
        });
        return generateResponseObject(
            true,
            generateArrayFromObjectArray(imageList, "fileName"),
            ""
        );
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.searchImageByCoordinates = async (params, context) => {
    try {
        if (validateDistanceQuery(params["distance"])) {
            let imageListResponse = await getAllImagesByDistance(
                context.db,
                params["xCoordinate"],
                params["yCoordinate"],
                params["distance"]
            );
            return generateResponseObject(
                imageListResponse.success,
                generateArrayFromObjectArray(
                    imageListResponse.data,
                    "fileName"
                ),
                imageListResponse.errorDesc
            );
        } else {
            return generateResponseObject(false, {}, "Distance Out Of Range");
        }
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};
