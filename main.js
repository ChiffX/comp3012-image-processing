/*
 * File Name: main.js
 * Description: Image processing app to convert images to greyscale
 *
 * Created Date: 13-Jul-2022
 * Author: Ryan Carswell
 *
 */

const path = require("path");

const IOhandler = require("./IOhandler"),
  zipFilePath = path.join(__dirname, 'myfile.zip'),
  pathUnzipped = path.join(__dirname, 'unzipped'),
  pathProcessed = path.join(__dirname, 'grayscaled');

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((files) => {
    files.forEach(file => IOhandler.grayScale(path.join(pathUnzipped, file), pathProcessed))
  })
  .catch(err => console.log(err));