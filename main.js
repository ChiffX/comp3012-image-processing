/*
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const path = require("path");

const IOhandler = require("./IOhandler"),
  zipFilePath = path.join(__dirname, 'myfile.zip'),
  pathUnzipped =  path.join(__dirname, 'unzipped'),
  pathProcessed =  path.join(__dirname, 'grayscaled');

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(console.log("test"))  
  .catch(err => console.log(err))