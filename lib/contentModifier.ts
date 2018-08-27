'use strict';

export function key(overrideKeyValue) {
  return function(template) {
    template.key = overrideKeyValue;
  };
}

export function required(template) {
  template.required = true;
}

export function dataKey(overrideKeyValue) {
  return function(template) {
    template.dataKey = overrideKeyValue;
  };
}
