'use strict';

import * as fieldLevel from '../fieldLevel'
import * as leafLevel from '../leafLevel'
import * as condition from '../condition'

import * as contentModifier from '../contentModifier'

const required = contentModifier.required;

const resultObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.2'),
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      dataKey: 'result',
      required: true
    },
    fieldLevel.text(leafLevel.nextReference('result')),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      key: 'value',
      attributes: {
        'xsi:type': function(input) {
          return input.text ? 'ST' : 'PQ';
        },
        value: leafLevel.inputProperty('value'),
        unit: leafLevel.inputProperty('unit')
      },
      text: leafLevel.inputProperty('text'),
      existsWhen: condition.eitherKeyExists('value', 'text'),
      required: true
    },
    {
      key: 'interpretationCode',
      attributes: {
        code: function(input) {
          return input.substr(0, 1);
        },
        codeSystem: '2.16.840.1.113883.5.83',
        displayName: leafLevel.input,
        codeSystemName: 'ObservationInterpretation'
      },
      dataKey: 'interpretations'
    },
    {
      key: 'referenceRange',
      content: {
        key: 'observationRange',
        content: [
          {
            key: 'text',
            text: leafLevel.input,
            dataKey: 'range'
          },
          {
            key: 'value',
            attributes: {
              'xsi:type': 'IVL_PQ'
            },
            content: [
              {
                key: 'low',
                attributes: {
                  value: leafLevel.inputProperty('low'),
                  unit: leafLevel.inputProperty('unit')
                },
                existsWhen: condition.keyExists('low')
              },
              {
                key: 'high',
                attributes: {
                  value: leafLevel.inputProperty('high'),
                  unit: leafLevel.inputProperty('unit')
                },
                existsWhen: condition.keyExists('high')
              }
            ],
            existsWhen: condition.eitherKeyExists('low', 'high')
          }
        ],
        required: true
      },
      dataKey: 'reference_range'
    }
  ],
  notIplemented: ['variable statusCode', 'methodCode', 'targetSiteCode', 'author']
};

export const resultOrganizer = {
  key: 'organizer',
  attributes: {
    classCode: 'BATTERY',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.1'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      content: {
        key: 'translation',
        attributes: leafLevel.code,
        dataKey: 'translations'
      },
      dataKey: 'result_set',
      required: true
    },
    fieldLevel.statusCodeCompleted,
    {
      key: 'component',
      content: [[resultObservation, required]],
      dataKey: 'results',
      required: true
    }
  ],
  notIplemented: ['variable @classCode', 'variable statusCode']
};
