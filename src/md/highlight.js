'use strict';

const format = require('util').format;
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['jsx', 'scss']);

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

  const lang = language === 'javascript' ? 'jsx' : language;
  code = prism.highlight(code, prism.languages[lang], lang)
  return format(
    '<div class="highlight"><pre class="language-%s"><code class="language-%s">%s</code></pre></div>',
    lang, lang, code
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

  if (!language || Object.keys(prism.languages).indexOf(language) < 0) {
    return null;
  }

  return language;
};
