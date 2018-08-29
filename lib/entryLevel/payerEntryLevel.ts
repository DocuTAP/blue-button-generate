import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const policyActivity = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.61'),
    {
      attributes: {
        extension: leafLevel.inputProperty('extension'),
        root: leafLevel.inputProperty('identifier')
      },
      dataKey: 'policy.identifiers',
      existsWhen: condition.keyExists('identifier'),
      key: 'id',
      required: true
    },

    {
      attributes: leafLevel.code,
      dataKey: 'policy.code',
      key: 'code'
    },
    fieldLevel.statusCodeCompleted,
    {
      attributes: {
        typeCode: 'PRF'
      },
      content: [
        fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.87'),
        fieldLevel.assignedEntity
      ],
      dataKey: 'policy.insurance.performer',
      key: 'performer'
    },
    {
      attributes: {
        typeCode: 'PRF'
      },
      content: [
        fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.88'),
        fieldLevel.assignedEntity
      ],
      dataKey: 'guarantor',
      key: 'performer'
    },
    {
      attributes: {
        typeCode: 'COV'
      },
      content: [
        fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.89'),
        [fieldLevel.effectiveTime, key('time')],
        {
          attributes: {
            classCode: 'PAT'
          },
          content: [
            fieldLevel.id,
            fieldLevel.usRealmAddress,
            fieldLevel.telecom,
            {
              attributes: leafLevel.code,
              dataKey: 'code',
              key: 'code'
            },
            {
              content: fieldLevel.usRealmName,
              key: 'playingEntity'
            }
          ],
          key: 'participantRole'
        }
      ],
      dataKey: 'participant',
      dataTransform: (input) => {
        if (input.performer) {
          input.identifiers = input.performer.identifiers;
          input.address = input.performer.address;
          input.phone = input.performer.phone;
        }
        return input;
      },
      key: 'participant'
    },
    {
      attributes: {
        typeCode: 'HLD'
      },
      content: [
        fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.90'),
        {
          content: [fieldLevel.id, fieldLevel.usRealmAddress],
          dataKey: 'performer',
          key: 'participantRole'
        }
      ],
      dataKey: 'policy_holder',
      key: 'participant'
    },
    {
      attributes: {
        typeCode: 'REFR'
      },
      content: {
        attributes: {
          classCode: 'ACT',
          moodCode: 'EVN'
        },
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.1.19'),
          fieldLevel.id,
          {
            attributes: {},
            key: 'code'
          },
          {
            attributes: {
              typeCode: 'SUBJ'
            },
            content: {
              attributes: {
                classCode: 'PROC',
                moodCode: 'PRMS'
              },
              content: {
                attributes: leafLevel.code,
                dataKey: 'code',
                key: 'code'
              },
              key: 'procedure'
            },
            dataKey: 'procedure',
            key: 'entryRelationship'
          }
        ],
        key: 'act'
      },
      dataKey: 'authorization',
      key: 'entryRelationship'
    }
  ],
  key: 'act'
};

export const coverageActivity = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.60'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    fieldLevel.templateCode('CoverageActivity'),
    fieldLevel.statusCodeCompleted,
    {
      attributes: {
        typeCode: 'COMP'
      },
      content: [[policyActivity, required]],
      key: 'entryRelationship',
      required: true
    }
  ],
  key: 'act'
};
