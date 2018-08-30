import * as bbu from 'blue-button-util';
import * as _ from 'lodash';
import * as translate from './translate';

const bbud = bbu.datetime;

export function input(templateInput) {
  return templateInput;
}

export function inputProperty(key) {
  return (templateInput) => {
    return templateInput && templateInput[key];
  };
}

export function boolInputProperty(key) {
  return (templateInput) => {
    if (templateInput && templateInput.hasOwnProperty(key)) {
      return templateInput[key].toString();
    } else {
      return undefined;
    }
  };
}

export const code = translate.code;

export const codeFromName = translate.codeFromName;

export function codeOnlyFromName(OID, key) {
  const f = translate.codeFromName(OID);
  return (templateInput) => {
    if (templateInput && templateInput[key]) {
      return f(templateInput[key]).code;
    } else {
      return undefined;
    }
  };
}

export const time = translate.time;

export function use(key) {
  return (templateInput) => {
    const value = templateInput && templateInput[key];
    if (value) {
      return translate.acronymize(value);
    } else {
      return undefined;
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
  return (templateInput, context) => {
    return context.nextReference(referenceKey);
  };
}

export function sameReference(referenceKey) {
  return (templateInput, context) => {
    return context.sameReference(referenceKey);
  };
}

export function nextReferenceId(referenceKey) {
  return (templateInput, context) => {
    return context.nextReferenceId(referenceKey);
  };
}

export function deepInputProperty(deepProperty, defaultValue?) {
  return (templateInput) => {
    let value = _.get(templateInput, deepProperty) || defaultValue;
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value;
  };
}

export function deepInputDate(deepProperty, defaultValue) {
  return (templateInput) => {
    let value = _.get(templateInput, deepProperty);
    if (!value) {
      return defaultValue;
    } else {
      value = bbud.modelToDate({
        date: value.date,
        precision: value.precision // workaround a bug in bbud.  Changes precision.
      });
      if (value) {
        return value;
      } else {
        return defaultValue;
      }
    }
  };
}
