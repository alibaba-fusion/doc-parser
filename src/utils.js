'use strict';

const md = require('./md');

/**
 * 解析 markdown ast 中的 table 的一行数据
 * @param {Array} arr children 数组
 * @return {Array} 返回数组
 */
exports.parseMarkdownTableRow = function(arr) {
  const obj = [];
  for (const item of arr) {
    const str = item.raw.trim();
    obj.push(str);
  }
  return obj;
};

/**
 * 解析 meta 信息
 * @param {string} content The html string
 * @return {object} The meta object
 */
exports.parseMeta = function(content) {
  md.markdown.setOptions({
    gfm: false,
  });
  const html = md.markdown(content);
  const m = html.match(/<h1 id="(.*?)">(.*?)<\/h1>/); // find title
  const meta = {};
  if (!m) {
    meta.title = null;
  } else {
    meta.title = m[2];
  }

  const items = [];
  const metaListRegex = /<ul>([\s\S]*?)<\/ul>([\s\S]*)$/g; // find meta list
  const metaListMatch = metaListRegex.exec(html);
  let metaListHtml;
  if (metaListMatch) {
    metaListHtml = metaListMatch[1] || html;
    meta.description = metaListMatch[2] || '';
  } else {
    meta.description = html;
  }

  const regex = /<li>(.*?)<\/li>/g;
  let match = regex.exec(metaListHtml);
  while (match) {
    items.push(match[1]);
    match = regex.exec(metaListHtml);
  }

  if (items) {
    items.forEach(item => {
      const splits = item.split(':');
      if (splits && splits.length === 2) {
        const key = splits[0].trim();
        const value = splits.slice(1).join(':').trim();
        meta[key] = value;
      }
    });
  }
  return meta;
};

/**
 * 解析 jsx/css 信息
 * @param {string} mdString The markdown string
 * @return {object} The code object { jsx, css }
 */
exports.parseCodes = function(mdString) {
  const jsxRegex = /````?\s*jsx?\n([\s\S]*?)(<p>)?````?\s*/g; // find jsx codes
  const jsxCodesMatch = jsxRegex.exec(mdString);

  let jsxCodes;
  if (jsxCodesMatch) {
    jsxCodes = jsxCodesMatch[1];
  }

  const cssRegex = /````?\s*css\n([\s\S]*?)````?\s*/g; // find css codes
  const cssCodesMatch = cssRegex.exec(mdString);

  let cssCodes;
  if (cssCodesMatch) {
    cssCodes = cssCodesMatch[1];
  }

  return {
    jsx: jsxCodes,
    css: cssCodes,
  };
};

exports.CHANGELOG_HEADER_REGEX = /##\s(\d+\.\d+.\d+)\s?\/?\s?(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})?/;
