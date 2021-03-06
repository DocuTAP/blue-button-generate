# blue-button-generate

Blue Button CCDA Generator

[![npm](https://img.shields.io/npm/v/%40docutap-api%2Fblue-button-generate.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/@docutap-api/blue-button-generate)
[![npm](https://img.shields.io/npm/l/%40docutap-api%2Fblue-button-generate.svg?style=flat-square)](https://github.com/DocuTAP/blue-button-generate/blob/develop/LICENSE)
[![CircleCI](https://img.shields.io/circleci/project/github/DocuTAP/blue-button-generate.svg?style=flat-square&logo=circleci)](https://circleci.com/gh/DocuTAP/blue-button-generate)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

blue-button-generate is a module to generate CCDA files from JSON data. Currently it only supports [blue-button](https://github.com/amida-tech/blue-button) JSON data model.

## Usage

``` javascript
const fs = require('fs');
const bb = require('blue-button');
const bbg = require('@docutap-api/blue-button-generate');

const xmlString = fs.readFileSync('test/fixtures/files/ccda_xml/CCD_1.xml', 'utf-8');
const record = bb.parseString(xmlString);

// ...
// changes to record
// ...

// get back xml as text
const updatedXmlString = bbg.generateCCD(record);

```

## Implementation

blue-button-generate uses javascript template objects for implementation. Each template in CCDA is represented with an object. As an example Reaction Observation object is shown

``` javascript
const reactionObservation = exports.reactionObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.9"),
        fieldLevel.id,
        fieldLevel.nullFlavor("code"),
        fieldLevel.text(leafLevel.sameReference("reaction")),
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            dataKey: 'reaction',
            existsWhen: condition.codeOrDisplayname,
            required: true
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: severityObservation,
            existsWhen: condition.keyExists('severity')
        }
    ]
};
```

This template is internally used with a call

```javascript
js2xml.update(xmlDoc, input, context, reactionObservation);
```

where `xmlDoc` is the parent xml document (Allergy Intolerance Observation) and `input` is the immediate parent of [bluebutton.js](https://github.com/blue-button/bluebutton.js) object that describes Reaction Observation. `context` is internally used for indices in text references.

### Motivation

This approach is an alternative to direct programming or text based templates such as in [bluebutton.js](https://github.com/blue-button/bluebutton.js) and is motivated by the following

* Each template directly follows the actual specification. One can easily match each node in the template to the actual statements in the specification.
* Individual templates can be tested independently without any additional flags or programming.
* Required elements are specified in the template and get `nullFlavor` automatically when no data exists.
* No coding required to add new templates.
* It is also a step in the right direction for the possible future directions
  * Factoring out data model dependencies so that [blue-button](https://github.com/amida-tech/blue-button) data model changes or other data models can be accomodated more easily
* Automatic generation of templates from [blue-button](https://github.com/amida-tech/blue-button) like CCDA parsers.

### Template Structure

The following are the properties of the templates

* `key`: This is the name for the xml element.
* `attributes`: This describes the attributes of the element. `attributes` can be an object of with `key` and `value` pairs for each attribute or it can be an array of such objects. Each attribute object or can be a function with `input` argument that returns attributes.
* `text`: This is a function with `input` attribute that returns text value of the element.
* `content`: This is an array of other templates that describe the children of the element. For a single child an object can be used.
* `dataKey`: This is the property of `input` that serves as the data for the template.
* `required`: This identifies if template is required or not. If template is required and there is not value in the `input` a `nullFlavor` node is created.
* `dataTransform`: This is a function to transform the input.
* `existWhen`: This is a boolean function with `input` argument to describe it the elements should exists or not.
