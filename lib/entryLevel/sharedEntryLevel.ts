import * as condition from '../condition';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

export const severityObservation = (severityReference) => ({
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
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'code',
      existsWhen: condition.codeOrDisplayname,
      key: 'value',
      required: true
    },
    {
      attributes: leafLevel.code,
      dataKey: 'interpretation',
      existsWhen: condition.codeOrDisplayname,
      key: 'interpretationCode'
    }
  ],
  dataKey: 'severity',
  existsWhen: condition.keyExists('code'),
  key: 'observation'
});

export const reactionObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.9'),
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      dataKey: 'code',
      key: 'code',
      required: true
    },
    fieldLevel.text(leafLevel.nextReference('reaction')),
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'reaction',
      existsWhen: condition.codeOrDisplayname,
      key: 'value',
      required: true
    },
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [severityObservation('reaction_severity')],
      existsWhen: condition.keyExists('severity'),
      key: 'entryRelationship'
    }
  ],
  key: 'observation',
  notImplemented: ['Procedure Activity Procedure', 'Medication Activity']
};

export const serviceDeliveryLocation = {
  attributes: {
    classCode: 'SDLOC'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.32'),
    {
      attributes: leafLevel.code,
      dataKey: 'location_type',
      key: 'code',
      required: true
    },
    fieldLevel.usRealmAddress,
    fieldLevel.telecom,
    {
      attributes: {
        classCode: 'PLC'
      },
      content: {
        key: 'name',
        text: leafLevel.inputProperty('name')
      },
      existsWhen: condition.keyExists('name'),
      key: 'playingEntity'
    }
  ],
  key: 'participantRole'
};

export const ageObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.31'),
    fieldLevel.templateCode('AgeObservation'),
    fieldLevel.statusCodeCompleted,
    {
      attributes: {
        unit: leafLevel.codeOnlyFromName('2.16.840.1.113883.11.20.9.21', 'onset_age_unit'),
        value: leafLevel.inputProperty('onset_age'),
        'xsi:type': 'PQ'
      },
      key: 'value',
      required: true
    }
  ],
  key: 'observation'
};

export const indication = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.19'),
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      dataKey: 'code',
      key: 'code',
      required: true
    },
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'value',
      existsWhen: condition.codeOrDisplayname,
      key: 'value'
    }
  ],
  key: 'observation',
  notImplemented: ['value should handle nullFlavor=OTH and translation']
};

export const preconditionForSubstanceAdministration = {
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.25'),
    {
      attributes: {
        code: leafLevel.inputProperty('code'),
        codeSystem: '2.16.840.1.113883.5.4'
      },
      dataKey: 'code',
      key: 'code'
    },
    {
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'value',
      existsWhen: condition.codeOrDisplayname,
      key: 'value'
    }
  ],
  key: 'criterion'
};

export const drugVehicle = {
  attributes: {
    classCode: 'MANU'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.24'),
    {
      attributes: {
        code: '412307009',
        codeSystem: '2.16.840.1.113883.6.96',
        codeSystemName: 'SNOMED CT',
        displayName: 'drug vehicle'
      },
      key: 'code'
    },
    {
      attributes: {
        classCode: 'MMAT'
      },
      content: [
        {
          attributes: leafLevel.code,
          key: 'code',
          required: true
        },
        {
          key: 'name',
          text: leafLevel.inputProperty('name')
        }
      ],
      key: 'playingEntity',
      required: true
    }
  ],
  key: 'participantRole'
};

export const instructions = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'INT'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.20'),
    {
      attributes: [leafLevel.code],
      dataKey: 'code',
      key: 'code',
      required: true
    },
    fieldLevel.text(leafLevel.nextReference('patient_instructions')),
    fieldLevel.statusCodeCompleted
  ],
  key: 'act'
};
