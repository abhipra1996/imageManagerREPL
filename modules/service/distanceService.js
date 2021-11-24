const { In } = require("typeorm");
const { generateResponseObject } = require("../response");
const { getAllLocationsByParams } = require("../service/locationService");
const { getAllImagesByParams } = require("../service/imageService");

exports.validateDistanceQuery = (distance) => {
    if (distance < 0.01 || distance > 10) {
        return false;
    }
    return true;
};

exports.getAllImagesByDistance = async (
    db,
    xCoordinate,
    yCoordinate,
    distance
) => {
    try {
        let locationQueryParams = {
            isDeleted: false,
        };
        let locationListResponse = await getAllLocationsByParams(
            db,
            locationQueryParams
        );
        if (locationListResponse.success) {
            let locationIDArray = [];
            for (let i = 0; i < locationListResponse.data.length; i++) {
                if (
                    isInsideCircle(
                        xCoordinate,
                        yCoordinate,
                        distance,
                        locationListResponse.data[i]["xCoordinate"],
                        locationListResponse.data[i]["yCoordinate"]
                    )
                ) {
                    locationIDArray.push(locationListResponse.data[i]["id"]);
                }
            }
            if (locationIDArray.length === 0) {
                return generateResponseObject(
                    locationListResponse.success,
                    locationIDArray,
                    locationListResponse.errorDesc
                );
            } else {
                const imageQueryParams = {
                    isDeleted: false,
                    location: {id: In(locationIDArray)},
                };
                let imageListResponse = await getAllImagesByParams(
                    db,
                    imageQueryParams
                );
                return generateResponseObject(
                    imageListResponse.success,
                    imageListResponse.data,
                    imageListResponse.errorDesc
                );
            }
        } else {
            return generateResponseObject(
                locationListResponse.success,
                locationListResponse.data,
                locationListResponse.errorDesc
            );
        }
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

const isInsideCircle = (centreX, centreY, radius, x, y) => {
    let value = (x - centreX) * (x - centreX) + (y - centreY) * (y - centreY);
    let radiusSquare = radius * radius;
    if (value <= radiusSquare) {
        return true;
    }
    return false;
};
