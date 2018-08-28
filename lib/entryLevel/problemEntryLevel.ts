'use strict';

import * as fieldLevel from '../fieldLevel'
import * as leafLevel from '../leafLevel'
import * as condition from '../condition'
import * as contentModifier from '../contentModifier'

import * as sharedEntryLevel from './sharedEntryLevel'

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const problemStatus = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.6'),
    fieldLevel.id,
    fieldLevel.templateCode('ProblemStatus'),
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      key: 'value',
      attributes: [
        {
          'xsi:type': 'CD'
        },
        leafLevel.codeFromName('2.16.840.1.113883.3.88.12.80.68')
      ],
      dataKey: 'name',
      required: true
    }
  ]
};

const healthStatusObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.5'),
    fieldLevel.templateCode('HealthStatusObservation'),
    fieldLevel.text(leafLevel.nextReference('patient_health_status')),
    fieldLevel.statusCodeCompleted,
    {
      key: 'value',
      attributes: {
        'xsi:type': 'CD',
        code: '81323004',
        codeSystem: '2.16.840.1.113883.6.96',
        codeSystemName: 'SNOMED CT',
        displayName: leafLevel.inputProperty('patient_status')
      },
      required: true,
      toDo: 'The attribute should not be constant'
    }
  ]
};

const problemObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN',
    negationInd: leafLevel.boolInputProperty('negation_indicator')
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.4'),
    fieldLevel.id,
    {
      key: 'code',
      attributes: {
        nullFlavor: 'UNK'
      }
    },
    fieldLevel.text(leafLevel.nextReference('condition')),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, dataKey('problem.date_time')],
    {
      key: 'value',
      attributes: [
        {
          'xsi:type': 'CD'
        },
        leafLevel.code
      ],
      content: [
        {
          key: 'translation',
          attributes: leafLevel.code,
          dataKey: 'translations'
        }
      ],
      dataKey: 'problem.code',
      existsWhen: condition.codeOrDisplayname,
      required: true
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'REFR'
      },
      content: [[problemStatus, required]],
      dataTransform: (input) => {
        if (input && input.status) {
          var result = input.status;
          result.identifiers = input.identifiers;
          return result;
        }
        return null;
      }
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [[sharedEntryLevel.ageObservation, required]],
      existsWhen: condition.keyExists('onset_age')
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'REFR'
      },
      content: [[healthStatusObservation, required]],
      existsWhen: condition.keyExists('patient_status')
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [[sharedEntryLevel.severityObservation('severity')]],
      dataKey: 'problem',
      existsWhen: condition.keyExists('severity')
    }
  ],
  notImplemented: ['code']
};

export const problemConcernAct = {
  key: 'act',
  attributes: {
    classCode: 'ACT',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.3'),
    fieldLevel.uniqueId,
    {
      key: 'id',
      attributes: {
        root: leafLevel.inputProperty('identifier'),
        extension: leafLevel.inputProperty('extension')
      },
      dataKey: 'source_list_identifiers',
      existsWhen: condition.keyExists('identifier'),
      required: true
    },
    fieldLevel.templateCode('ProblemConcernAct'),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ'
      },
      content: [[problemObservation, required]],
      required: true
    }
  ]
};
