'use strict';

const _ = require('underscore');

const defaultValues = {
  cachetag: '0.2.0',
  sourcedir: 'content',
  outputdir: '_site',
  encoding: 'utf8',
  tocLevel: 3,
  engine: 'swig',
  reader: null,
  ignoredotfiles: true,
};

let defaultMaps = {};

function Option(options) {
  this._cache = options || {};
}

Option.prototype.get = function(key) {
  if (!key) {
    return _.defaults(this._cache, defaultValues);
  }
  const ret = this._cache[key];
  if (defaultMaps[key]) {
    return _.defaults(ret || {}, defaultMaps[key]);
  }
  if (ret) return ret;
  return defaultValues[key];
};

Option.prototype.set = function(key, value) {
  this._cache[key] = value;
  return value;
};

Option.prototype.option = function(key, value) {
  if (!value) return this.get(key);
  return this.set(key, value);
};

Option.prototype.clean = function(key) {
  if (!key) {
    this._cache = {};
  } else if (this._cache[key]) {
    delete this._cache[key];
  }
};

exports = module.exports = new Option();

exports.Option = Option;

exports.defaults = function(obj) {
  if (!obj) { return defaultMaps; }
  defaultMaps = obj;
};

