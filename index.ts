'use strict';

/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in
standard XML/CCDA format) back to XML/CCDA format.
*/

import * as bbu from 'blue-button-util';

import * as engine from './lib/engine';
import * as documentLevel from './lib/documentLevel';

const bbuo = bbu.object;

import * as html_renderer from './lib/htmlHeaders';

const createContext = (() => {
  var base = {
    nextReference: function(referenceKey) {
      var index = this.references[referenceKey] || 0;
      ++index;
      this.references[referenceKey] = index;
      return '#' + referenceKey + index;
    },
    sameReference: function(referenceKey) {
      var index = this.references[referenceKey] || 0;
      return '#' + referenceKey + index;
    },
    nextReferenceId: function(referenceKey) {
      var index = this.referenceIds[referenceKey] || 0;
      ++index;
      this.referenceIds[referenceKey] = index;
      return referenceKey + index;
    }
  };

  return (options) => {
    var result = Object.create(base);
    result.references = {};
    result.referenceIds = {};
    if (options.meta && options.addUniqueIds) {
      result.rootId = bbuo.deepValue(options.meta, 'identifiers.0.identifier');
    } else {
      result.rootId = null;
    }
    result.preventNullFlavor = options.preventNullFlavor;

    return result;
  };
})();

export function generate(template, input, options) {
  if (!options.html_renderer) {
    options.html_renderer = html_renderer;
  }

  var context = createContext(options);
  return engine.create(documentLevel.ccd(options.html_renderer), input, context);
}

export function generateCCD(input, options?) {
  options = options || {};
  options.meta = input.meta;
  return generate(documentLevel.ccd, input, options);
}

exports.fieldLevel = require('./lib/fieldLevel');
exports.entryLevel = require('./lib/entryLevel');
exports.leafLevel = require('./lib/leafLevel');
exports.contentModifier = require('./lib/contentModifier');
exports.condition = require('./lib/condition');
