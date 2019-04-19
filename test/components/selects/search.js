'use strict';

const assert = require('chai').assert;
const search = require('../../../lib/components/selects/search');
const queryAll = require('../../../lib/commons/query-all');
const snippet = require('./snippet.html');
const Fixture = require('../../fixture');


describe('components/selects/search', () => {
  let fixture, lists;

  before(() => fixture = new Fixture());
  beforeEach(() => {
    fixture.create(snippet);
    const newOpt = document.createElement('div');
    newOpt.className = 'dqpl-option foo';
    newOpt.setAttribute('role', 'option');
    newOpt.innerHTML = '54 - cats';
    fixture.element.querySelector('.dqpl-listbox').appendChild(newOpt);
    lists = queryAll('.dqpl-listbox', fixture.element);
  });

  afterEach((done) => {
    fixture.destroy();
    setTimeout(done, 600); // allow the search timer to reset...
  });
  after(() => fixture.cleanUp());

  describe('exact match', () => {
    it('should activate the expected option', () => {
      // search for "5", then for "4"
      search(53, lists[0]);
      search(52, lists[0]);
      assert.equal(lists[0].querySelector('.foo').id, lists[0].getAttribute('aria-activedescendant'));
    });
  });

  describe('first character match (plan b)', () => {
    it('should activate the expected option', () => {
      // search with "5" character (53)
      search(53, lists[0]);
      assert.equal(lists[0].querySelector('.last').id, lists[0].getAttribute('aria-activedescendant'));
    });
  });

  describe('no match', () => {
    it('should not update aria-activedescendant', () => {
      // search "x" (no options contain "x")
      search(0, lists[0]);
      assert.equal(lists[0].getAttribute('aria-activedescendant'), 'default');
    });
  });
});
