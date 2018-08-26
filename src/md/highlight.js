'use strict';

const format = require('util').format;
const hl = require('highlight.js');

const escape = function(html) {
  return html.
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;').
    replace(/"/g, '&quot;').
    replace(/'/g, '&#39;');
};

exports.render = function(code, language) {
  language = exports.language(language);

  if (!language) {
    return '<pre>' + escape(code) + '</pre>';
  }
  if (language === 'html') {
    language = 'xml';
  }
  code = hl.highlight(language, code).value;
  return format(
    '<div class="highlight"><pre><code class="%s">%s</code></pre></div>',
    language, code
  );
};

exports.language = function(language) {
  if (!language) {
    return null;
  }
  if (language === 'html') {
    return 'html';
  }

  const shortcuts = {
    js: 'javascript',
    jsx: 'javascript',
    json: 'javascript',
    py: 'python',
    rb: 'ruby',
    md: 'markdown',
    mkd: 'markdown',
    'c++': 'cpp',
  };

  if (language && shortcuts[language]) {
    language = shortcuts[language];
  }

  if (!language || hl.listLanguages().indexOf(language) < 0) {
    return null;
  }

  return language;
};
