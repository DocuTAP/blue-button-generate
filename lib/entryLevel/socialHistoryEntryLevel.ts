'use strict';

import * as fieldLevel from '../fieldLevel'
import * as leafLevel from '../leafLevel'

import * as contentModifier from '../contentModifier'

const required = contentModifier.required;

export const socialHistoryObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.38'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      content: [
        {
          key: 'originalText',
          text: leafLevel.inputProperty('unencoded_name'),
          content: {
            key: 'reference',
            attributes: { value: leafLevel.nextReference('social_history_element') }
          }
        },
        {
          key: 'translation',
          attributes: leafLevel.code,
          dataKey: 'translations'
        }
      ],
      dataKey: 'code'
    },
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      key: 'value',
      attributes: {
        'xsi:type': 'ST'
      },
      text: leafLevel.inputProperty('value')
    }
  ],
  existsWhen: function(input) {
    return !input.value || input.value.indexOf('smoke') < 0;
  }
};

export const smokingStatusObservation = {
  key: 'observation',
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
      key: 'value',
      attributes: [{ 'xsi:type': 'CD' }, leafLevel.codeFromName('2.16.840.1.113883.11.20.9.38')],
      required: true,
      dataKey: 'value'
    }
  ],
  existsWhen: function(input) {
    return input.value && input.value.indexOf('smoke') > -1;
  }
};