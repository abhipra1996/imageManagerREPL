exports.isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
};

exports.hasAlphabets = (str) => {
    return !/[^a-zA-Z]/.test(str);
};

exports.isLowerCase = (str) => {
    return str == str.toLowerCase() && str != str.toUpperCase();
};

exports.extractCreateObject = (insertResult) => {
    let objectArray = insertResult["generatedMaps"];
    if (objectArray.length === 1) {
        return objectArray[0];
    }
    return objectArray;
};

exports.generateArrayFromObjectArray = (objectArray, key) => {
    let finalArray = [];
    for (let i = 0; i < objectArray.length; i++) {
        finalArray.push(objectArray[i][key]);
    }
    return finalArray;
};
