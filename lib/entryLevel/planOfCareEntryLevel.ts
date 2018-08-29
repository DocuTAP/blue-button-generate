import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

export const planOfCareActivityAct = {
  content: {
    attributes: {
      classCode: 'ACT',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.39'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        attributes: leafLevel.code,
        dataKey: 'plan',
        key: 'code'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ],
    key: 'act'
  },
  dataKey: 'plan_of_care',
  existsWhen: (input) => {
    return input.types && input.types.includes('act');
  },
  key: 'entry'
};

export const planOfCareActivityObservation = {
  content: {
    attributes: {
      classCode: 'OBS',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.44'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        attributes: leafLevel.code,
        dataKey: 'plan',
        key: 'code'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ],
    key: 'observation'
  },
  dataKey: 'plan_of_care',
  existsWhen: (input) => {
    return input.types && input.types.includes('observation');
  },
  key: 'entry'
};

export const planOfCareActivityProcedure = {
  content: {
    attributes: {
      classCode: 'PROC',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.41'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        attributes: leafLevel.code,
        dataKey: 'plan',
        key: 'code'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ],
    key: 'procedure'
  },
  dataKey: 'plan_of_care',
  existsWhen: (input) => {
    return input.types && input.types.includes('procedure');
  },
  key: 'entry'
};

export const planOfCareActivityEncounter = {
  content: {
    attributes: {
      classCode: 'ENC',
      moodCode: 'INT'
    },

    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.40'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        attributes: leafLevel.code,
        dataKey: 'plan',
        key: 'code'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ],
    key: 'encounter'
  },
  dataKey: 'plan_of_care',
  existsWhen: (input) => {
    return input.types && input.types.includes('encounter');
  },
  key: 'entry'
};

export const planOfCareActivitySubstanceAdministration = {
  content: {
    attributes: {
      classCode: 'SBADM',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.42'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        attributes: leafLevel.code,
        dataKey: 'plan',
        key: 'code'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ],
    key: 'substanceAdministration'
  },
  dataKey: 'plan_of_care',
  existsWhen: (input) => {
    return input.types && input.types.includes('substanceAdministration');
  },
  key: 'entry'
};

export const planOfCareActivitySupply = {
  content: {
    attributes: {
      classCode: 'SPLY',
      moodCode: 'INT'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.43'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        attributes: leafLevel.code,
        dataKey: 'plan',
        key: 'code'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ],
    key: 'supply'
  },
  dataKey: 'plan_of_care',
  existsWhen: (input) => {
    return input.types && input.types.includes('supply');
  },
  key: 'entry'
};

const goal = {
  attributes: {
    code: leafLevel.deepInputProperty('code'),
    displayName: 'Goal'
  },
  content: [
    {
      key: 'originalText',
      text: leafLevel.deepInputProperty('name')
    }
  ],
  dataKey: 'goal',
  key: 'code'
};

const intervention = {
  attributes: {
    code: leafLevel.deepInputProperty('code'),
    displayName: 'Intervention'
  },
  content: [
    {
      key: 'originalText',
      text: leafLevel.deepInputProperty('name')
    }
  ],
  dataKey: 'intervention',
  key: 'code'
};

export const planOfCareActivityInstructions = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'INT'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.20'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      attributes: leafLevel.code,
      dataKey: 'plan',
      key: 'code'
    },
    fieldLevel.statusCodeNew,
    {
      attributes: {
        code: leafLevel.deepInputProperty('code'),
        displayName: 'Severity Code'
      },
      content: [
        {
          key: 'originalText',
          text: leafLevel.deepInputProperty('name')
        }
      ],
      dataKey: 'severity',
      key: 'priorityCode'
    },
    fieldLevel.effectiveTime,
    {
      attributes: {
        typeCode: 'COMP'
      },
      content: [
        {
          attributes: {
            classCode: 'OBS',
            moodCode: 'GOL'
          },
          content: [
            fieldLevel.effectiveTime,
            goal,
            {
              attributes: {
                classCode: 'ACT',
                moodCode: 'INT'
              },

              content: [
                {
                  attributes: {
                    typeCode: 'REFR'
                  },
                  content: [intervention],
                  dataKey: 'interventions',
                  key: 'entryRelationship'
                }
              ],
              key: 'act'
            }
          ],
          dataKey: 'goals',
          key: 'observation'
        }
      ],
      key: 'entryRelationship',
      required: true
    }
  ],
  existsWhen: (input) => {
    return input.type === 'instructions';
  },
  key: 'instructions'
};
