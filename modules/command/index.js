const { commandConfig } = require("./config");
const { generateResponseObject } = require("../response");
const { isNumeric, hasAlphabets, isLowerCase } = require("../util");

const invalidCommandMessage = "Invalid Command!!!";
const invalidInputCountMessage =
    "Invalid Number of Inputs provided for the command";
const invalidInputDataTypeMessage = "Invalid DataType/Format for Input : ";

const validateInputDataType = (value, dataType) => {
    let success = true;
    if (dataType === "number" || dataType === "floatNumber") {
        success = isNumeric(value);
    } else if (dataType === "string") {
        success = hasAlphabets(value) && isLowerCase(value);
    }

    return generateResponseObject(success, {}, "");
};

const extractAndValidateCommand = (input) => {
    const commandSplitArray = input.split(" ");
    const commandObject = commandConfig[commandSplitArray[0]];
    // Validate Command Name
    if (commandObject === undefined) {
        return generateResponseObject(false, {}, invalidCommandMessage);
    } else {
        // Validating Input Params
        // 1. Validate Command Signature
        if (commandSplitArray.length !== commandObject.inputCount + 1) {
            return generateResponseObject(false, {}, invalidInputCountMessage);
        }
        // 2. Validate Command Input and it's DataType
        for (let i = 0; i < commandObject.input.length; i++) {
            let commandInputObject = commandObject.input[i] || {};
            let response = validateInputDataType(
                commandSplitArray[commandInputObject.position],
                commandInputObject.dataType
            );
            if (!response.success) {
                return generateResponseObject(
                    false,
                    {},
                    invalidInputDataTypeMessage + " " + commandInputObject.key
                );
            } else {
                commandObject.input[i].value =
                    commandSplitArray[commandInputObject.position];
            }
        }

        return generateResponseObject(true, commandObject, "");
    }
};

const generateParamsforEvaluation = (paramsArray) => {
    try {
        const finalParams = {};
        for (let i = 0; i < paramsArray.length; i++) {
            let paramObject = paramsArray[i];
            let key = paramObject.key;
            if (paramObject.dataType === "number") {
                finalParams[key] = parseInt(paramObject.value);
            } else if (paramObject.dataType === "floatNumber") {
                finalParams[key] = parseFloat(paramObject.value);
            } else {
                finalParams[key] = paramObject.value;
            }
        }
        return generateResponseObject(true, finalParams, "");
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.evaluateCommand = async (input, context) => {
    input = input.replace("\n", "");
    if (input.toLowerCase() === "help") {
        console.log(
            "Please Find Below the list of commands for the Image Manager :- \n"
        );
        return JSON.stringify(commandConfig);
    } else {
        const extractionResponse = extractAndValidateCommand(input);
        if (extractionResponse.success) {
            const commandObject = extractionResponse.data;
            const paramsResponse = generateParamsforEvaluation(
                commandObject.input
            );
            if (paramsResponse.success) {
                let executionResponse = await commandObject.executionFunction(
                    paramsResponse.data,
                    context
                );
                if (executionResponse.success) {
                    return executionResponse.data;
                } else {
                    return executionResponse.errorDesc;
                }
            } else {
                return paramsResponse.errorDesc;
            }
        } else {
            return extractionResponse.errorDesc;
        }
    }
};
