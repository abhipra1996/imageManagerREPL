var repl = require("repl");
const { evaluateCommand } = require("./modules/command");
const { dbInit } = require("./modules/db");

const evaluateInput = (userInput, context, filename, callback) => {
    let response = evaluateCommand(userInput, context);
    if (response instanceof Promise) {
        return response
            .then((result) => callback(null, result))
            .catch((error) => {
                callback(null, error);
            });
    } else {
        return callback(null, response);
    }
};

dbInit()
    .then((res) => {
        if (res.success) {
            var replServer = (repl.start({
                prompt: "image-manager-repl => ",
                eval: evaluateInput,
            }).context.db = (res.data || {}).dbConnInstance);
        } else {
            console.log("Error in db initialization => ", res.errorDesc);
        }
    })
    .catch((error) => {
        console.log("Error in db initialization => ", error.toString());
    });
