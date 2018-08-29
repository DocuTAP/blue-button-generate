import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

const required = contentModifier.required;

export const socialHistoryObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.38'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      content: [
        {
          content: {
            attributes: { value: leafLevel.nextReference('social_history_element') },
            key: 'reference'
          },
          key: 'originalText',
          text: leafLevel.inputProperty('unencoded_name')
        },
        {
          attributes: leafLevel.code,
          dataKey: 'translations',
          key: 'translation'
        }
      ],
      dataKey: 'code',
      key: 'code'
    },
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      attributes: {
        'xsi:type': 'ST'
      },
      key: 'value',
      text: leafLevel.inputProperty('value')
    }
  ],
  existsWhen: (input) => {
    return !input.value || input.value.indexOf('smoke') < 0;
  },
  key: 'observation'
};

export const smokingStatusObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.78'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    fieldLevel.templateCode('SmokingStatusObservation'),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      attributes: [{ 'xsi:type': 'CD' }, leafLevel.codeFromName('2.16.840.1.113883.11.20.9.38')],
      dataKey: 'value',
      key: 'value',
      required: true
    }
  ],
  existsWhen: (input) => {
    return input.value && input.value.indexOf('smoke') > -1;
  },
  key: 'observation'
};
