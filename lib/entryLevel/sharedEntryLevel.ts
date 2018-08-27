'use strict';

import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';
import * as condition from '../condition';

export const severityObservation = (severityReference) => ({
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.8'),
    fieldLevel.templateCode('SeverityObservation'),
    fieldLevel.text(leafLevel.nextReference(severityReference)),
    fieldLevel.statusCodeCompleted,
    {
      key: 'value',
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'code',
      existsWhen: condition.codeOrDisplayname,
      required: true
    },
    {
      key: 'interpretationCode',
      attributes: leafLevel.code,
      dataKey: 'interpretation',
      existsWhen: condition.codeOrDisplayname
    }
  ],
  dataKey: 'severity',
  existsWhen: condition.keyExists('code')
});

export const reactionObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.9'),
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      dataKey: 'code',
      required: true
    },
    fieldLevel.text(leafLevel.nextReference('reaction')),
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      key: 'value',
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'reaction',
      existsWhen: condition.codeOrDisplayname,
      required: true
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [severityObservation('reaction_severity')],
      existsWhen: condition.keyExists('severity')
    }
  ],
  notImplemented: ['Procedure Activity Procedure', 'Medication Activity']
};

export const serviceDeliveryLocation = {
  key: 'participantRole',
  attributes: {
    classCode: 'SDLOC'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.32'),
    {
      key: 'code',
      attributes: leafLevel.code,
      dataKey: 'location_type',
      required: true
    },
    fieldLevel.usRealmAddress,
    fieldLevel.telecom,
    {
      key: 'playingEntity',
      attributes: {
        classCode: 'PLC'
      },
      content: {
        key: 'name',
        text: leafLevel.inputProperty('name')
      },
      existsWhen: condition.keyExists('name')
    }
  ]
};

export const ageObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.31'),
    fieldLevel.templateCode('AgeObservation'),
    fieldLevel.statusCodeCompleted,
    {
      key: 'value',
      attributes: {
        'xsi:type': 'PQ',
        value: leafLevel.inputProperty('onset_age'),
        unit: leafLevel.codeOnlyFromName('2.16.840.1.113883.11.20.9.21', 'onset_age_unit')
      },
      required: true
    }
  ]
};

export const indication = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.19'),
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      dataKey: 'code',
      required: true
    },
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      key: 'value',
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'value',
      existsWhen: condition.codeOrDisplayname
    }
  ],
  notImplemented: ['value should handle nullFlavor=OTH and translation']
};

export const preconditionForSubstanceAdministration = {
  key: 'criterion',
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.25'),
    {
      key: 'code',
      attributes: {
        code: leafLevel.inputProperty('code'),
        codeSystem: '2.16.840.1.113883.5.4'
      },
      dataKey: 'code'
    },
    {
      key: 'value',
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'value',
      existsWhen: condition.codeOrDisplayname
    }
  ]
};

export const drugVehicle = {
  key: 'participantRole',
  attributes: {
    classCode: 'MANU'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.24'),
    {
      key: 'code',
      attributes: {
        code: '412307009',
        displayName: 'drug vehicle',
        codeSystem: '2.16.840.1.113883.6.96',
        codeSystemName: 'SNOMED CT'
      }
    },
    {
      key: 'playingEntity',
      attributes: {
        classCode: 'MMAT'
      },
      content: [
        {
          key: 'code',
          attributes: leafLevel.code,
          required: true
        },
        {
          key: 'name',
          text: leafLevel.inputProperty('name')
        }
      ],
      required: true
    }
  ]
};

export const instructions = {
  key: 'act',
  attributes: {
    classCode: 'ACT',
    moodCode: 'INT'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.20'),
    {
      key: 'code',
      attributes: [leafLevel.code],
      dataKey: 'code',
      required: true
    },
    fieldLevel.text(leafLevel.nextReference('patient_instructions')),
    fieldLevel.statusCodeCompleted
  ]
};
