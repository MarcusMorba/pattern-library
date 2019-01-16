'use strict';

import Classlist from 'classlist';
import closest from 'closest';
import queryAll from '../../commons/query-all';
import noClobber from '../../commons/no-clobber';
import createTooltip from './create-tooltip';

const debug = require('debug')('dqpl:components:field-help');
const cached = [];

/**
 * Setup field help (tooltip attrs/classes/events)
 */
module.exports = () => {
  queryAll('.dqpl-help-button, .dqpl-button-definition')
    .forEach((button) => {
      // avoid setting up the same button twice
      if (cached.indexOf(button) > -1) { return; }
      cached.push(button);
      const tipText = button.getAttribute('data-help-text');
      const tip = createTooltip(tipText);
      // find the wrapper
      const wrap = closest(button, '.dqpl-help-button-wrap, .dqpl-definition-button-wrap');
      // don't continue if no wrapper found
      if (!wrap) {
        const expected = Classlist(button).contains('dqpl-help-button') ?
          '.dqpl-help-button-wrap' :
          '.dqpl-definition-button-wrap';
        debug(`Unable to generate tooltip without a "${expected}" wrapper for: `, button);
        return;
      }

      // insert tip into DOM
      wrap.appendChild(tip);
      // associate trigger with tip via aria-describedby
      noClobber(button, tip);

      const list = Classlist(tip);
      const showTip = () => {
        list.add('dqpl-tip-active');
        const updatedText = button.getAttribute('data-help-text');
        tip.innerHTML = updatedText;
      };
      const hideTip = () => list.remove('dqpl-tip-active');
      // focus/blur / mouseover/mouseout events (to show/hide)
      button.addEventListener('focus', showTip);
      button.addEventListener('mouseover', showTip);
      button.addEventListener('blur', hideTip);
      button.addEventListener('mouseout', hideTip);
    });
};
