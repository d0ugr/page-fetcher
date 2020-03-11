const request  = require("request");
const fs       = require("fs");
const readline = require("readline");

const requestPage = function(url, callback) {

  request(url, (error, response, body) => {
    if (!error) {
      if (response.statusCode === 200) {
        callback(body);
      } else {
        console.log("request.statusCode:", response && response.statusCode);
      }
    } else {
      console.log("request error:", error);
    }
  });

};

const openFile = function(fileSpec, callback) {

  fs.open(fileSpec, "wx", (error, fd) => {
    if (!error) {
      callback(fd);
    } else if (error.code === "EEXIST") {
      const rl = readline.createInterface({
        input:  process.stdin,
        output: process.stdout
      });
      rl.question(`${fileSpec} exists.  Type something starting with 'Y' to overwrite... `, (answer) => {
        rl.close();
        if (answer[0].toUpperCase() === "Y") {
          fs.open(fileSpec, "w", (error, fd) => {
            if (!error) {
              callback(fd);
            } else {
              console.log("fs.open(w) error:", error);
            }
          });
        }
      });
    } else {
      console.log("fs.open(wx) error:", error);
    }
  });

};

const writeFile = function(fd, body, callback) {

  fs.write(fd, body, "utf8", (error, written) => {
    if (error) {
      console.log("fs.write error:", error);
    }
    fs.close(fd, (error) => {
      if (!error) {
        callback(written);
      } else {
        console.log("fs.close error:, error");
      }
    });
  });

};

const fetchPage = function(url, fileSpec) {

  requestPage(url, (body) => {
    openFile(fileSpec, (fd) => {
      writeFile(fd, body, (written) => {
        console.log(`Downloaded and saved ${written} bytes to ${fileSpec}`);
      });
    });
  });

};

const args = process.argv.slice(2, 4);
fetchPage(args[0], args[1]);
