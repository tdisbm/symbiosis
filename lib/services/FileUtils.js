'use strict';

const Path = require('path');
const Fs = require('fs');

class FileUtils {
  /**
   * get full file path
   *
   * @param relative
   * @returns {string}
   */
  static getFullPath(relative) {
    const absolute = Path.dirname(require.main.filename) + Path.sep + relative;

    try {
      Fs.statSync(absolute);
      return absolute;
    } catch (err) {
      throw new Error("File " + absolute + " not exist");
    }
  }
}

module.exports = FileUtils;