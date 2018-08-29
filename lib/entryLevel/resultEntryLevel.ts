'use strict';

import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

const required = contentModifier.required;

const resultObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.2'),
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      dataKey: 'result',
      key: 'code',
      required: true
    },
    fieldLevel.text(leafLevel.nextReference('result')),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      attributes: {
        unit: leafLevel.inputProperty('unit'),
        value: leafLevel.inputProperty('value'),
        'xsi:type': (input) => {
          return input.text ? 'ST' : 'PQ';
        }
      },
      existsWhen: condition.eitherKeyExists('value', 'text'),
      key: 'value',
      required: true,
      text: leafLevel.inputProperty('text')
    },
    {
      attributes: {
        code: (input) => {
          return input.substr(0, 1);
        },
        codeSystem: '2.16.840.1.113883.5.83',
        codeSystemName: 'ObservationInterpretation',
        displayName: leafLevel.input
      },
      dataKey: 'interpretations',
      key: 'interpretationCode'
    },
    {
      content: {
        content: [
          {
            dataKey: 'range',
            key: 'text',
            text: leafLevel.input
          },
          {
            attributes: {
              'xsi:type': 'IVL_PQ'
            },
            content: [
              {
                attributes: {
                  unit: leafLevel.inputProperty('unit'),
                  value: leafLevel.inputProperty('low')
                },
                existsWhen: condition.keyExists('low'),
                key: 'low'
              },
              {
                attributes: {
                  unit: leafLevel.inputProperty('unit'),
                  value: leafLevel.inputProperty('high')
                },
                existsWhen: condition.keyExists('high'),
                key: 'high'
              }
            ],
            existsWhen: condition.eitherKeyExists('low', 'high'),
            key: 'value'
          }
        ],
        key: 'observationRange',
        required: true
      },
      dataKey: 'reference_range',
      key: 'referenceRange'
    }
  ],
  key: 'observation',
  notIplemented: ['variable statusCode', 'methodCode', 'targetSiteCode', 'author']
};

export const resultOrganizer = {
  attributes: {
    classCode: 'BATTERY',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.1'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: {
        attributes: leafLevel.code,
        dataKey: 'translations',
        key: 'translation'
      },
      dataKey: 'result_set',
      key: 'code',
      required: true
    },
    fieldLevel.statusCodeCompleted,
    {
      content: [[resultObservation, required]],
      dataKey: 'results',
      key: 'component',
      required: true
    }
  ],
  key: 'organizer',
  notIplemented: ['variable @classCode', 'variable statusCode']
};
