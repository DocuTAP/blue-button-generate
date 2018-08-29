export function key(overrideKeyValue) {
  return (template) => {
    template.key = overrideKeyValue;
  };
}

export function required(template) {
  template.required = true;
}

export function dataKey(overrideKeyValue) {
  return (template) => {
    template.dataKey = overrideKeyValue;
  };
}
