import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';
import * as sharedEntryLevel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

export const encounterActivities = {
  attributes: {
    classCode: 'ENC',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.49'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: [
        {
          content: [
            {
              attributes: { value: leafLevel.nextReference('encounter') },
              key: 'reference'
            }
          ],
          key: 'originalText'
        },
        {
          attributes: leafLevel.code,
          dataKey: 'translations',
          key: 'translation'
        }
      ],
      dataKey: 'encounter',
      key: 'code'
    },
    [fieldLevel.effectiveTime, required],
    [fieldLevel.performer, dataKey('performers')],
    {
      attributes: {
        typeCode: 'LOC'
      },
      content: [[sharedEntryLevel.serviceDeliveryLocation, required]],
      dataKey: 'locations',
      key: 'participant'
    },
    {
      attributes: {
        typeCode: 'RSON'
      },
      content: [[sharedEntryLevel.indication, required]],
      dataKey: 'findings',
      dataTransform: (input) => {
        input = input.map((e) => {
          e.code = {
            code: '404684003',
            code_system: '2.16.840.1.113883.6.96',
            code_system_name: 'SNOMED CT',
            name: 'Finding'
          };
          return e;
        });
        return input;
      },
      key: 'entryRelationship',
      toDo: 'move dataTransform to blue-button-meta'
    }
  ],
  key: 'encounter',
  notImplemented: ['entryRelationship:encounterDiagnosis', 'dishargeDispositionCode']
};
