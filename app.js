//var net = require("net");
var repl = require("repl");
const { evaluateCommand } = require("./modules/command");
const { dbInit } = require("./modules/db");

//A remote node repl that you can telnet to!
// net.createServer(function (socket) {
//     var remote = repl.start("abhinavs::repl> ", socket);
//     //Adding "mood" and "bonus" to the remote REPL's context.
//     remote.context.mood = mood;
//     remote.context.bonus = "UNLOCKED";
// }).listen(5001);

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
