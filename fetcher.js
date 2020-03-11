const request = require("request");
const fs      = require("fs");

const fetchPage = function(url, fileSpec) {

  let fileSize = 0;

  request(url, (error, response, body) => {
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", body);
  });

  fs.open("", (error, fd) => {
    if (error) console.log(error);
  });

  console.log(`Downloaded and saved ${fileSize} bytes to ${fileSpec}`);

};

const args = process.argv.slice(2, 4);
console.log(args);
fetchPage(args[0], args[1]);
