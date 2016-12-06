'use strict';

const FileUtils = require('../services/FileUtils');
const MapValidators = require('./validators/loader');
const _ = require('lodash');

/**
 * @param mapPath path to json map defined by user
 * @constructor
 */
class Map {
  constructor() {
    this._elements = {};
  }

  validate() {
    _.each(MapValidators, (validator) => validator.validate(this._elements));
  }

  load(pathArray) {
    const that = this;
    _.each(pathArray, (path) => {
      that._elements = _.merge(this._elements, require(FileUtils.getFullPath(path)));
    });
    this.validate();
  }

  getElements() {
    return this._elements;
  }
}

module.exports = new Map();