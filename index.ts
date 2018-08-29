'use strict';

/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in
standard XML/CCDA format) back to XML/CCDA format.
*/

import * as bbu from 'blue-button-util';

import * as documentLevel from './lib/documentLevel';
import * as engine from './lib/engine';

const bbuo = bbu.object;

import * as html_renderer from './lib/htmlHeaders';

const createContext = (() => {
  const base = {
    nextReference(referenceKey) {
      let index = this.references[referenceKey] || 0;
      ++index;
      this.references[referenceKey] = index;
      return '#' + referenceKey + index;
    },
    sameReference(referenceKey) {
      const index = this.references[referenceKey] || 0;
      return '#' + referenceKey + index;
    },
    nextReferenceId(referenceKey) {
      let index = this.referenceIds[referenceKey] || 0;
      ++index;
      this.referenceIds[referenceKey] = index;
      return referenceKey + index;
    }
  };

  return (options) => {
    const result = Object.create(base);
    result.references = {};
    result.referenceIds = {};
    if (options.meta && options.addUniqueIds) {
      result.rootId = bbuo.deepValue(options.meta, 'identifiers.0.identifier');
    } else {
      result.rootId = undefined;
    }
    result.preventNullFlavor = options.preventNullFlavor;

    return result;
  };
})();

export function generate(template, input, options) {
  if (!options.html_renderer) {
    options.html_renderer = html_renderer;
  }

  const context = createContext(options);
  return engine.create(documentLevel.ccd(options.html_renderer), input, context);
}

export function generateCCD(input, options?) {
  options = options || {};
  options.meta = input.meta;
  return generate(documentLevel.ccd, input, options);
}

export * from './lib/fieldLevel';
export * from './lib/entryLevel';
export * from './lib/leafLevel';
export * from './lib/contentModifier';
export * from './lib/condition';
