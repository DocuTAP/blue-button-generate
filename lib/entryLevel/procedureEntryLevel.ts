import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

import * as sharedEntryLevel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

export const procedureActivityAct = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'INT' // not constant in the specification
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.12'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: [
        {
          content: [
            {
              attributes: { value: leafLevel.nextReference('procedure') },
              key: 'reference'
            }
          ],
          key: 'originalText'
        }
      ],
      dataKey: 'procedure',
      key: 'code',
      required: true
    },
    {
      attributes: {
        code: leafLevel.inputProperty('status')
      },
      key: 'statusCode',
      required: true
    },
    fieldLevel.effectiveTime,
    {
      attributes: leafLevel.code,
      dataKey: 'priority',
      key: 'priorityCode'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'body_sites',
      key: 'targetSiteCode'
    },
    [fieldLevel.performer, dataKey('performer')],
    {
      attributes: {
        typeCode: 'LOC'
      },
      content: [[sharedEntryLevel.serviceDeliveryLocation, required]],
      dataKey: 'locations',
      key: 'participant'
    }
  ],
  existsWhen: condition.propertyEquals('procedure_type', 'act'),
  key: 'act',
  notImplemented: [
    'entryRelationship:encounter',
    'entryRelationship:indication',
    'entryRelationship:medicationActivity'
  ],
  toDo: ['moodCode should be variable']
};

export const procedureActivityProcedure = {
  attributes: {
    classCode: 'PROC',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.14'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: [
        {
          content: [
            {
              attributes: { value: leafLevel.nextReference('procedure') },
              key: 'reference'
            }
          ],
          key: 'originalText'
        }
      ],
      dataKey: 'procedure',
      key: 'code',
      required: true
    },
    {
      attributes: {
        code: leafLevel.inputProperty('status')
      },
      key: 'statusCode',
      required: true
    },
    fieldLevel.effectiveTime,
    {
      attributes: leafLevel.code,
      dataKey: 'priority',
      key: 'priorityCode'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'body_sites',
      key: 'targetSiteCode'
    },
    {
      attributes: {
        typeCode: 'SPC'
      },
      content: {
        attributes: {
          classCode: 'SPEC'
        },
        content: [
          fieldLevel.id,
          {
            content: {
              attributes: leafLevel.code,
              dataKey: 'code',
              key: 'code'
            },
            existsWhen: condition.keyExists('code'),
            key: 'specimenPlayingEntity'
          }
        ],
        key: 'specimenRole',
        required: true
      },
      dataKey: 'specimen',
      key: 'specimen'
    },
    [fieldLevel.performer, dataKey('performer')],
    {
      attributes: {
        typeCode: 'LOC'
      },
      content: [[sharedEntryLevel.serviceDeliveryLocation, required]],
      dataKey: 'locations',
      key: 'participant'
    }
  ],
  existsWhen: condition.propertyEquals('procedure_type', 'procedure'),
  key: 'procedure',
  notImplemented: [
    'methodCode',
    'participant:productInstance',
    'entryRelationship:encounter',
    'entryRelationship:instructions',
    'entryRelationship:indication',
    'entryRelationship:medicationActivity'
  ],
  toDo: ['moodCode should be variable']
};

export const procedureActivityObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN' // not constant in the specification
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.13'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: [
        {
          content: [
            {
              attributes: { value: leafLevel.nextReference('procedure') },
              key: 'reference'
            }
          ],
          key: 'originalText'
        }
      ],
      dataKey: 'procedure',
      key: 'code',
      required: true
    },
    {
      attributes: {
        code: leafLevel.inputProperty('status')
      },
      key: 'statusCode',
      required: true
    },
    fieldLevel.effectiveTime,
    {
      attributes: leafLevel.code,
      dataKey: 'priority',
      key: 'priorityCode'
    },
    {
      attributes: {
        'xsi:type': 'CD'
      },
      key: 'value'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'body_sites',
      key: 'targetSiteCode'
    },
    [fieldLevel.performer, dataKey('performers')],
    {
      attributes: {
        typeCode: 'LOC'
      },
      content: [[sharedEntryLevel.serviceDeliveryLocation, required]],
      dataKey: 'locations',
      key: 'participant'
    }
  ],
  existsWhen: condition.propertyEquals('procedure_type', 'observation'),
  key: 'observation',
  notImplemented: [
    'entryRelationship:encounter',
    'entryRelationship:instructions',
    'entryRelationship:indication',
    'entryRelationship:medicationActivity'
  ],
  toDo: ['moodCode should be variable']
};
