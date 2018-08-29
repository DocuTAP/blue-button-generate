import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

import * as sharedEntryLevel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const problemStatus = {
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
      attributes: [
        {
          'xsi:type': 'CD'
        },
        leafLevel.codeFromName('2.16.840.1.113883.3.88.12.80.68')
      ],
      dataKey: 'name',
      key: 'value',
      required: true
    }
  ],
  key: 'observation'
};

const healthStatusObservation = {
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
      attributes: {
        code: '81323004',
        codeSystem: '2.16.840.1.113883.6.96',
        codeSystemName: 'SNOMED CT',
        displayName: leafLevel.inputProperty('patient_status'),
        'xsi:type': 'CD'
      },
      key: 'value',
      required: true,
      toDo: 'The attribute should not be constant'
    }
  ],
  key: 'observation'
};

const problemObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN',
    negationInd: leafLevel.boolInputProperty('negation_indicator')
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.4'),
    fieldLevel.id,
    {
      attributes: {
        nullFlavor: 'UNK'
      },
      key: 'code'
    },
    fieldLevel.text(leafLevel.nextReference('condition')),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, dataKey('problem.date_time')],
    {
      attributes: [
        {
          'xsi:type': 'CD'
        },
        leafLevel.code
      ],
      content: [
        {
          attributes: leafLevel.code,
          dataKey: 'translations',
          key: 'translation'
        }
      ],
      dataKey: 'problem.code',
      existsWhen: condition.codeOrDisplayname,
      key: 'value',
      required: true
    },
    {
      attributes: {
        typeCode: 'REFR'
      },
      content: [[problemStatus, required]],
      dataTransform: (input) => {
        if (input && input.status) {
          const result = input.status;
          result.identifiers = input.identifiers;
          return result;
        }
        return undefined;
      },
      key: 'entryRelationship'
    },
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [[sharedEntryLevel.ageObservation, required]],
      existsWhen: condition.keyExists('onset_age'),
      key: 'entryRelationship'
    },
    {
      attributes: {
        typeCode: 'REFR'
      },
      content: [[healthStatusObservation, required]],
      existsWhen: condition.keyExists('patient_status'),
      key: 'entryRelationship'
    },
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [[sharedEntryLevel.severityObservation('severity')]],
      dataKey: 'problem',
      existsWhen: condition.keyExists('severity'),
      key: 'entryRelationship'
    }
  ],
  key: 'observation',
  notImplemented: ['code']
};

export const problemConcernAct = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.3'),
    fieldLevel.uniqueId,
    {
      attributes: {
        extension: leafLevel.inputProperty('extension'),
        root: leafLevel.inputProperty('identifier')
      },
      dataKey: 'source_list_identifiers',
      existsWhen: condition.keyExists('identifier'),
      key: 'id',
      required: true
    },
    fieldLevel.templateCode('ProblemConcernAct'),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      attributes: {
        typeCode: 'SUBJ'
      },
      content: [[problemObservation, required]],
      key: 'entryRelationship',
      required: true
    }
  ],
  key: 'act'
};
