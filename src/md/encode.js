'use strict';

const path = require('path');

exports.uri = function(text) {
  text = text.replace(/<\/?[^>]*>/g, '');
  const regex = /[^,\.<>\/\?;\:'"\[\]\{\}\\\|`~!@#\$%\^\&\*\(\)\_\+\=\s]+/g;
  const bits = text.match(regex);
  if (bits) {
    text = bits.join('-').toLowerCase();
  }
  text = text.replace(/-{2,}/g, '-');
  return text;
};

exports.filepath = function(fpath) {
  const dirname = path.dirname(fpath);
  let text = path.basename(fpath);

  text = text.replace(/<\/?[^>]*>/g, '');
  const regex = /[^,<>\/\?;\:'"\[\]\{\}\\\|`~!@#\$%\^\&\*\(\)\_\+\=\s]+/g;
  text = text.match(regex).join('-').toLowerCase();
  text = text.replace(/-{2,}/g, '-');
  return path.join(dirname, text);
};
