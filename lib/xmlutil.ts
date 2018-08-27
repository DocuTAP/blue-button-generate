'use strict';

var libxmljs = require('libxmljs');

export function newDocument() {
  return new libxmljs.Document();
}

export function newNode(xmlDoc, name, text) {
  if (text === undefined || text === null) {
    return xmlDoc.node(name);
  } else {
    return xmlDoc.node(name, text);
  }
}

export function nodeAttr(node, attr) {
  node.attr(attr);
}

export function serializeToString(xmlDoc) {
  return xmlDoc.toString();
}
