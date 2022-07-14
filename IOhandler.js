/*
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 12-Jul-2022
 * Author: Ryan Carswell
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  { createReadStream, createWriteStream, existsSync } = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut }))
    .promise()
    .then(() => console.log('Extraction complete'), e => console.log('Extraction failed', e));
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  const files = fs.readdir(dir);
  return files;
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  const fileName = path.parse(pathIn).base;
  const extension = path.extname(fileName);

  if (extension === ".png") {
    createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // adapted from https://github.com/noopkat/floyd-steinberg/blob/master/floyd-steinberg.js
            // sick toddler, no time to reinvent the wheel

            let w = this.width

            let newPixel = this.data[idx] < 150 ? 0 : 255;
            let err = Math.floor((this.data[idx] - newPixel) / 23);
            this.data[idx + 0 * 1 - 0] = newPixel;
            this.data[idx + 4 * 1 - 0] += err * 7;
            this.data[idx + 4 * w - 4] += err * 3;
            this.data[idx + 4 * w - 0] += err * 5;
            this.data[idx + 4 * w + 4] += err * 1;

            this.data[idx + 1] = this.data[idx + 2] = this.data[idx];
          }
        }

        if (!(existsSync(pathOut))) {
          fs.mkdir(pathOut);
        }

        const pathProcessed = path.join(pathOut, fileName);
        this.pack().pipe(createWriteStream(pathProcessed));
      });
  }
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
