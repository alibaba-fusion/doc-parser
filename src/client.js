'use strict';

const astParser = require('@textlint/markdown-to-ast');
const utils = require('./utils');
const md = require('./md');
const defaultOptions = require('./default-options');

class Client {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  get logger() {
    return this.options.logger;
  }

  // parse markdown
  parse(content) {
    const lines = content.split(/\r\n|\r|\n/);
    const header = [];
    const body = [];
    let recording = true;
    let isYaml = false;

    lines.forEach((line, index) => {
      if (index === 0 && line.slice(0, 3) === '---') {
        isYaml = true;
      }

      if (recording && index && line.slice(0, 3) === '---') {
        recording = false;
      } else if (recording) {
        header.push(line);
      } else {
        body.push(line);
      }
    });

    let bodyStr;
    if (body.length) {
      bodyStr = body.join('\n');
    } else {
      bodyStr = content;
    }

    const codes = utils.parseCodes(bodyStr);

    let meta;
    if (isYaml) {
      meta = {};
      header.forEach(line => {
        const pair = line.split(':');
        if (pair.length > 1) {
          meta[pair[0].trim()] = pair[1].trim();
        }
      });
    } else {
      meta = utils.parseMeta(header.join('\n'));
    }

    if (!meta.title) {
      this.logger.info('title is missing');
    }
    return {
      title: meta.title,
      meta,
      codes,
      body: bodyStr,
    };
  }

  parseChangelog(content) {
    const ast = astParser.parse(content);
    if (!ast || ast.type !== 'Document') {
      this.logger.error(new Error('Invalid markdown content'));
    }

    const { children } = ast;

    let index = 0;
    const changelogList = [];
    for (; index < children.length; index++) {
      const item = children[index];
      if (item.type === 'Header') {
        const match = utils.CHANGELOG_HEADER_REGEX.exec(item.raw);
        if (match && match.length === 3) {
          changelogList.push({
            index,
            version: match[1],
            published_date: match[2] || '',
          });
        }
      }
    }

    for (index = 0; index < changelogList.length; index++) {
      const item = changelogList[index];
      const start = item.index + 1;
      const end = start < changelogList.length ? changelogList[index + 1].index : children.length;
      const contentArr = children.slice(start, end);
      item.content = contentArr.reduce((before, cur) => before + '\n\n' + cur.raw, '');
      item.html = this.simpleRender(item.content);
    }

    return changelogList;
  }

  /**
   * Fetch apis from markdown documents
   * @param {String} content The markdown content
   * @param {Array} tableHeader  The table header
   * @return {Array} The api list
   */
  parseAPI(content, tableHeader) {
    const ast = astParser.parse(content);
    if (!ast || ast.type !== 'Document') {
      this.logger.error(new Error('Invalid markdown document!'));
      return;
    }

    const { children } = ast;
    const apis = [];
    let apiPair;

    let compName; // 组件名，例如 NumberPicker 通常位于文件的开始处
    let headerOneCount = 0; // h1 标题统计
    let foundApiHeader = false; // 是否找到了 API 的开始标记
    let compHeaderCount = 0; // 组件标题个数统计
    let topExport; // 父级导出组件名，例如 TabPane 的父级导出组件为 Tab
    for (let i = 0, n = children.length; i < n; i++) {
      const child = children[i];

      if (child.type === 'Header' && child.depth === 1) {
        if (++headerOneCount === 1) {
          compName = child.children[0].value.trim();
        }
      }

      const isApiHeader = child.raw.toLowerCase().includes('api');
      if (child.type === 'Header' && isApiHeader) {
        foundApiHeader = true;
      }
      if (!foundApiHeader) {
        continue; // 跳过
      }

      if (child.type === 'Header' && !isApiHeader && child.depth > 1) {
        apiPair = {};
        apiPair.name = child.children[0].value.trim();
        if (++compHeaderCount === 1) {
          topExport = apiPair.name;
        } else {
          apiPair.parent = topExport;
        }
      }

      if ((child.type === 'table' || (child.align && child.align.length === tableHeader.length))) {
        if (!apiPair) {
          apiPair = {
            name: compName,
          };
        }
        apiPair.body = child.children;
        apis.push(apiPair);
        apiPair = null;
      }
    }

    for (const item of apis) {
      // const header = buildTableLine(item.body[0].children);
      const params = [];
      for (let i = 1, n = item.body.length; i < n; i++) {
        const param = {};
        const lineArr = utils.parseMarkdownTableRow(item.body[i].children);
        for (let j = 0, n = lineArr.length; j < n; j++) {
          param[tableHeader[j]] = lineArr[j];
        }
        params.push(param);
      }

      item.params = params;
    }

    return apis;
  }

  // render markdown
  render(content) {
    return md.render(content);
  }

  simpleRender(content) {
    return md.simpleRender(content);
  }
}

module.exports = Client;
