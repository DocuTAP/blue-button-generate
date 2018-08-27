'use strict';

import * as bbu from 'blue-button-util';

import * as translate from './translate';

const bbuo = bbu.object;
const bbud = bbu.datetime;

export function input(input) {
  return input;
}

export function inputProperty(key) {
  return function(input) {
    return input && input[key];
  };
}

export function boolInputProperty(key) {
  return function(input) {
    if (input && input.hasOwnProperty(key)) {
      return input[key].toString();
    } else {
      return null;
    }
  };
}

export const code = translate.code;

export const codeFromName = translate.codeFromName;

export function codeOnlyFromName(OID, key) {
  var f = translate.codeFromName(OID);
  return function(input) {
    if (input && input[key]) {
      return f(input[key]).code;
    } else {
      return null;
    }
  };
}

export const time = translate.time;

export function use(key) {
  return function(input) {
    var value = input && input[key];
    if (value) {
      return translate.acronymize(value);
    } else {
      return null;
    }
  };
}

export const typeCD = {
  'xsi:type': 'CD'
};

export const typeCE = {
  'xsi:type': 'CE'
};

export function nextReference(referenceKey) {
  return function(input, context) {
    return context.nextReference(referenceKey);
  };
}

export function sameReference(referenceKey) {
  return function(input, context) {
    return context.sameReference(referenceKey);
  };
}

export function nextReferenceId(referenceKey) {
  return function(input, context) {
    return context.nextReferenceId(referenceKey);
  };
}

export function deepInputProperty(deepProperty, defaultValue?) {
  return function(input) {
    var value = bbuo.deepValue(input, deepProperty);
    value = bbuo.exists(value) ? value : defaultValue;
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value;
  };
}

export function deepInputDate(deepProperty, defaultValue) {
  return function(input) {
    var value = bbuo.deepValue(input, deepProperty);
    if (!bbuo.exists(value)) {
      return defaultValue;
    } else {
      value = bbud.modelToDate({
        date: value.date,
        precision: value.precision // workaround a bug in bbud.  Changes precision.
      });
      if (bbuo.exists(value)) {
        return value;
      } else {
        return defaultValue;
      }
    }
  };
}
