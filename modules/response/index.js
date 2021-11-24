const responseObject = {
    success: false,
    data: {},
    errorDesc: "",
};

const responseObjectArray = {
    success: false,
    data: [],
    errorDesc: "",
};

const responseObjectString = {
    success: false,
    data: "",
    errorDesc: "",
};

exports.generateResponseObject = (success, data, errorDesc) => {
    let responseObj = Object.create(responseObject);

    responseObj.success = success;
    responseObj.data = data;
    responseObj.errorDesc = errorDesc;

    return responseObj;
};

exports.generateResponseObjectArray = (success, data, errorDesc) => {
    let responseObj = Object.create(responseObjectArray);

    responseObj.success = success;
    responseObj.data = data;
    responseObj.errorDesc = errorDesc;

    return responseObj;
};

exports.generateResponseObjectString = (success, data, errorDesc) => {
    let responseObj = Object.create(responseObjectString);

    responseObj.success = success;
    responseObj.data = data;
    responseObj.errorDesc = errorDesc;

    return responseObj;
};
