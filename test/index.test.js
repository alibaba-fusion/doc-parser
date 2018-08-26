'use strict';

const path = require('path');
const fs = require('fs-extra');
const assert = require('power-assert');
const createDocParser = require('../');
const util = require('../src/utils');

const docParser = createDocParser({});

describe('test/index.test.js', () => {

  describe('parse readme', () => {
    let readme;

    beforeEach(function* () {
      const filepath = path.join(__dirname, './fixture/api.md');
      readme = yield fs.readFile(filepath, 'utf8');
    });

    afterEach(() => {
      readme = null;
    });

    it('should #parse readme', () => {
      const data = docParser.parse(readme);
      assert(data.title === 'Demo');
      assert(data.meta.chinese === '测试');
    });

    it('should #parseAPI', () => {
      const headers = ['name', 'description', 'type', 'defaultValue'];
      const apis = docParser.parseAPI(readme, headers);
      assert(apis.length);
    });

    it('should #render markdwon', () => {
      const data = docParser.parse(readme);
      const md = docParser.render(data.body);
      assert(md);
    });
  });

  describe('parse demo', () => {
    let demo;

    beforeEach(function* () {
      const filepath = path.join(__dirname, './fixture/demo.md');
      demo = yield fs.readFile(filepath, 'utf8');
    });

    afterEach(() => {
      demo = null;
    });

    it('should #parse demo', () => {
      const data = docParser.parse(demo);
      assert(data.title === '基本');
      assert(data.codes.jsx);
      assert(data.codes.css);
    });

    it('should #render parsed demo', () => {
      const data = docParser.parse(demo);
      const html = docParser.render(data.body);
      assert(html.includes('<div class="highlight">'));
      assert(!html.includes('<p>+</p>'));
    });
  });
});
