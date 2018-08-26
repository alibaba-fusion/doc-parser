'use strict';

const md = require('marked');
const share = require('./share');
const renderer = new md.Renderer();

function hlMarkdown(src) {
  renderer.heading = share.header;
  renderer.code = share.blockcode;
  renderer.link = share.link;

  const opt = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    renderer,
  };
  return md(src, opt);
}

function simpleHlMarkdown(src) {
  renderer.heading = share.header;
  renderer.code = share.simpleBlockcode;
  renderer.link = share.link;

  const opt = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    renderer,
  };
  return md(src, opt);
}

exports.markdown = md.parse;

// 渲染 markdown
exports.render = function(text) {
  return share.normalRender(text, hlMarkdown);
};

// 简单版，不编译 js
exports.simpleRender = function(text) {
  return share.normalRender(text, simpleHlMarkdown);
};
