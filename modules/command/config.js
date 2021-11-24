const {
    addImage,
    addLocation,
    removeImage,
    removeLocation,
    listAllImages,
    listAllLocations,
    listImagesByLocation,
    searchImageByCoordinates,
} = require("./service");

exports.commandConfig = {
    ADD_IMAGE: {
        inputCount: 4,
        input: [
            {
                key: "fileName",
                dataType: "string",
                position: 1,
            },
            {
                key: "locationName",
                dataType: "string",
                position: 2,
            },
            {
                key: "xCoordinate",
                dataType: "number",
                position: 3,
            },
            {
                key: "yCoordinate",
                dataType: "number",
                position: 4,
            },
        ],
        executionFunction: (params, context) => addImage(params, context),
    },
    ADD_LOCATION: {
        inputCount: 3,
        input: [
            {
                key: "locationName",
                dataType: "string",
                position: 1,
            },
            {
                key: "xCoordinate",
                dataType: "number",
                position: 2,
            },
            {
                key: "yCoordinate",
                dataType: "number",
                position: 3,
            },
        ],
        executionFunction: (params, context) => addLocation(params, context),
    },
    REMOVE_IMAGE: {
        inputCount: 1,
        input: [
            {
                key: "fileName",
                dataType: "string",
                position: 1,
            },
        ],
        executionFunction: (params, context) => removeImage(params, context),
    },
    REMOVE_LOCATION: {
        inputCount: 1,
        input: [
            {
                key: "locationName",
                dataType: "string",
                position: 1,
            },
        ],
        executionFunction: (params, context) => removeLocation(params, context),
    },
    LIST_ALL_IMAGES: {
        inputCount: 0,
        input: [],
        executionFunction: (params, context) => listAllImages(params, context),
    },
    LIST_ALL_LOCATIONS: {
        inputCount: 0,
        input: [],
        executionFunction: (params, context) =>
            listAllLocations(params, context),
    },
    LIST_IMAGES_BY_LOCATION: {
        inputCount: 1,
        input: [
            {
                key: "locationName",
                dataType: "string",
                position: 1,
            },
        ],
        executionFunction: (params, context) =>
            listImagesByLocation(params, context),
    },
    SEARCH_IMAGES_BY_COORD: {
        inputCount: 3,
        input: [
            {
                key: "xCoordinate",
                dataType: "floatNumber",
                position: 1,
            },
            {
                key: "yCoordinate",
                dataType: "floatNumber",
                position: 2,
            },
            {
                key: "distance",
                dataType: "floatNumber",
                position: 3,
            },
        ],
        executionFunction: (params, context) =>
            searchImageByCoordinates(params, context),
    },
};
