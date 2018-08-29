'use strict';

import * as xmlutil from './xmlutil';

const expandText = (input, template) => {
  let text = template.text;
  if (text) {
    if (typeof text === 'function') {
      text = text(input);
    }
    if (text !== null && text !== undefined) {
      return text;
    }
  }
  return undefined;
};

function expandAttributes(input, context, attrObj, attrs) {
  if (Array.isArray(attrObj)) {
    attrObj.forEach((attrObjElem) => {
      expandAttributes(input, context, attrObjElem, attrs);
    });
  } else if (typeof attrObj === 'function') {
    expandAttributes(input, context, attrObj(input, context), attrs);
  } else {
    Object.keys(attrObj).forEach((attrKey) => {
      let attrVal = attrObj[attrKey];
      if (typeof attrVal === 'function') {
        attrVal = attrVal(input, context);
      }
      if (attrVal !== null && attrVal !== undefined) {
        attrs[attrKey] = attrVal;
      }
    });
  }
}

const fillAttributes = (node, input, context, template) => {
  const attrObj = template.attributes;
  if (attrObj) {
    const inputAttrKey = template.attributeKey;
    if (inputAttrKey) {
      input = input[inputAttrKey];
    }
    if (input) {
      const attrs = {};
      expandAttributes(input, context, attrObj, attrs);
      xmlutil.nodeAttr(node, attrs);
    }
  }
};

const fillContent = (node, input, context, template) => {
  let content = template.content;
  if (content) {
    if (!Array.isArray(content)) {
      content = [content];
    }
    content.forEach((element) => {
      if (Array.isArray(element)) {
        const actualElement = Object.create(element[0]);
        for (let i = 1; i < element.length; ++i) {
          element[i](actualElement);
        }
        update(node, input, context, actualElement);
      } else {
        update(node, input, context, element);
      }
    });
  }
};

function updateUsingTemplate(xmlDoc, input, context, template) {
  const condition = template.existsWhen;
  if (!condition || condition(input, context)) {
    const name = template.key;
    const text = expandText(input, template);
    if ((text !== null && text !== undefined) || template.content || template.attributes) {
      const node = xmlutil.newNode(xmlDoc, name, text);

      fillAttributes(node, input, context, template);
      fillContent(node, input, context, template);
      if (template.nullFlavor && template.nullFlavor.existsWhen(input, context)) {
        setNullFlavor(node, template);
      }
      return true;
    }
  }
  addNullFlavor(template, context, xmlDoc);
}

const transformInput = (input, template) => {
  const inputKey = template.dataKey;
  if (inputKey) {
    const pieces = inputKey.split('.');
    pieces.forEach((piece) => {
      if (Array.isArray(input) && piece !== '0') {
        const nextInputs = [];
        input.forEach((inputElement) => {
          const nextInput = inputElement[piece];
          if (nextInput) {
            if (Array.isArray(nextInput)) {
              nextInput.forEach((nextInputElement) => {
                if (nextInputElement) {
                  nextInputs.push(nextInputElement);
                }
              });
            } else {
              nextInputs.push(nextInput);
            }
          }
        });
        if (nextInputs.length === 0) {
          input = undefined;
        } else {
          input = nextInputs;
        }
      } else {
        input = input && input[piece];
      }
    });
  }
  if (input) {
    const transform = template.dataTransform;
    if (transform) {
      input = transform(input);
    }
  }
  return input;
};

export function update(xmlDoc, input, context, template) {
  input = transformInput(input, template);
  if (input) {
    if (Array.isArray(input)) {
      input.forEach((element) => {
        updateUsingTemplate(xmlDoc, element, context, template);
      });
    } else {
      updateUsingTemplate(xmlDoc, input, context, template);
    }
  } else {
    addNullFlavor(template, context, xmlDoc);
  }
}

export function create(template, input, context) {
  const doc = xmlutil.newDocument();
  update(doc, input, context, template);
  const result = xmlutil.serializeToString(doc);
  return result;
}

function addNullFlavor(template, context, xmlDoc) {
  if (template.required && !context.preventNullFlavor) {
    const node = xmlutil.newNode(xmlDoc, template.key);
    setNullFlavor(node, template);
  }
}

function setNullFlavor(node, template) {
  xmlutil.nodeAttr(node, {
    nullFlavor: (template.nullFlavor && template.nullFlavor.value) || 'UNK'
  });
}
