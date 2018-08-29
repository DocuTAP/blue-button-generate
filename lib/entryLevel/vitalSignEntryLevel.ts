import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

const required = contentModifier.required;

const vitalSignObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.27'),
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: [
        {
          content: {
            attributes: { value: leafLevel.nextReference('vitals') },
            key: 'reference'
          },
          key: 'originalText'
        },
        {
          attributes: leafLevel.code,
          dataKey: 'translations',
          key: 'translation'
        }
      ],
      dataKey: 'vital',
      key: 'code',
      required: true
    },
    {
      attributes: {
        code: leafLevel.inputProperty('status')
      },
      key: 'statusCode'
    },
    [fieldLevel.effectiveTime, required],
    {
      attributes: {
        unit: leafLevel.inputProperty('unit'),
        value: leafLevel.inputProperty('value'),
        'xsi:type': 'PQ'
      },
      existsWhen: condition.keyExists('value'),
      key: 'value',
      required: true
    },
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.83'),
      dataKey: 'interpretations',
      key: 'interpretationCode'
    }
  ],
  key: 'observation',
  notImplemented: ['constant statusCode', 'methodCode', 'targetSiteCode', 'author']
};

export const vitalSignsOrganizer = {
  attributes: {
    classCode: 'CLUSTER',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.26'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    fieldLevel.templateCode('VitalSignsOrganizer'),
    {
      attributes: {
        code: leafLevel.inputProperty('status')
      },
      key: 'statusCode'
    },
    [fieldLevel.effectiveTime, required],
    {
      content: vitalSignObservation,
      key: 'component',
      required: true
    }
  ],
  key: 'organizer',
  notImplemented: ['constant statusCode']
};
