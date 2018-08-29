export function keyExists(key) {
  return (input) => {
    return input.hasOwnProperty(key);
  };
}

export function keyDoesntExist(key) {
  return (input) => {
    return !input.hasOwnProperty(key);
  };
}

export function eitherKeyExists(key0, key1, key2?, key3?) {
  return (input) => {
    return (
      input.hasOwnProperty(key0) ||
      input.hasOwnProperty(key1) ||
      input.hasOwnProperty(key2) ||
      input.hasOwnProperty(key3)
    );
  };
}

export function codeOrDisplayname(input) {
  return input.code || input.name;
}

export function propertyEquals(property, value) {
  return (input) => {
    return input && input[property] === value;
  };
}
