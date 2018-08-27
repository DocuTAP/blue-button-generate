'use strict';

import * as fieldLevel from '../fieldLevel'
import * as leafLevel from '../leafLevel'
import * as contentModifier from '../contentModifier'

import * as sharedEntryLevel from './sharedEntryLevel'

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

export const encounterActivities = {
  key: 'encounter',
  attributes: {
    classCode: 'ENC',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.49'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      content: [
        {
          key: 'originalText',
          content: [
            {
              key: 'reference',
              attributes: { value: leafLevel.nextReference('encounter') }
            }
          ]
        },
        {
          key: 'translation',
          attributes: leafLevel.code,
          dataKey: 'translations'
        }
      ],
      dataKey: 'encounter'
    },
    [fieldLevel.effectiveTime, required],
    [fieldLevel.performer, dataKey('performers')],
    {
      key: 'participant',
      attributes: {
        typeCode: 'LOC'
      },
      content: [[sharedEntryLevel.serviceDeliveryLocation, required]],
      dataKey: 'locations'
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'RSON'
      },
      content: [[sharedEntryLevel.indication, required]],
      dataKey: 'findings',
      dataTransform: function(input) {
        input = input.map(function(e) {
          e.code = {
            code: '404684003',
            name: 'Finding',
            code_system: '2.16.840.1.113883.6.96',
            code_system_name: 'SNOMED CT'
          };
          return e;
        });
        return input;
      },
      toDo: 'move dataTransform to blue-button-meta'
    }
  ],
  notImplemented: ['entryRelationship:encounterDiagnosis', 'dishargeDispositionCode']
};
