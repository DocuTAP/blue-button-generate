'use strict';

import * as fieldLevel from '../fieldLevel'
import * as leafLevel from '../leafLevel'
import * as condition from '../condition'
import * as contentModifier from '../contentModifier'

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

export const planOfCareActivityAct = {
  key: 'entry',
  dataKey: 'plan_of_care',
  content: {
    key: 'act',
    attributes: {
      classCode: 'ACT',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.39'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        key: 'code',
        attributes: leafLevel.code,
        dataKey: 'plan'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ]
  },
  existsWhen: function(input) {
    return input['types'] && input.types.includes('act');
  }
};

export const planOfCareActivityObservation = {
  key: 'entry',
  dataKey: 'plan_of_care',
  content: {
    key: 'observation',
    attributes: {
      classCode: 'OBS',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.44'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        key: 'code',
        attributes: leafLevel.code,
        dataKey: 'plan'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ]
  },
  existsWhen: function(input) {
    return input['types'] && input.types.includes('observation');
  }
};

export const planOfCareActivityProcedure = {
  key: 'entry',
  dataKey: 'plan_of_care',
  content: {
    key: 'procedure',
    attributes: {
      classCode: 'PROC',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.41'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        key: 'code',
        attributes: leafLevel.code,
        dataKey: 'plan'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ]
  },
  existsWhen: function(input) {
    return input['types'] && input.types.includes('procedure');
  }
};

export const planOfCareActivityEncounter = {
  key: 'entry',
  dataKey: 'plan_of_care',
  content: {
    key: 'encounter',
    attributes: {
      classCode: 'ENC',
      moodCode: 'INT'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.40'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        key: 'code',
        attributes: leafLevel.code,
        dataKey: 'plan'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ]
  },
  existsWhen: function(input) {
    return input['types'] && input.types.includes('encounter');
  }
};

export const planOfCareActivitySubstanceAdministration = {
  key: 'entry',
  dataKey: 'plan_of_care',
  content: {
    key: 'substanceAdministration',
    attributes: {
      classCode: 'SBADM',
      moodCode: 'RQO'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.42'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        key: 'code',
        attributes: leafLevel.code,
        dataKey: 'plan'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ]
  },
  existsWhen: function(input) {
    return input['types'] && input.types.includes('substanceAdministration');
  }
};

export const planOfCareActivitySupply = {
  key: 'entry',
  dataKey: 'plan_of_care',
  content: {
    key: 'supply',
    attributes: {
      classCode: 'SPLY',
      moodCode: 'INT'
    },
    content: [
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.43'),
      fieldLevel.uniqueId,
      fieldLevel.id,
      {
        key: 'code',
        attributes: leafLevel.code,
        dataKey: 'plan'
      },
      fieldLevel.statusCodeNew,
      fieldLevel.effectiveTime
    ]
  },
  existsWhen: function(input) {
    return input['types'] && input.types.includes('supply');
  }
};

var goal = {
  key: 'code',
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
  dataKey: 'goal'
};

var intervention = {
  key: 'code',
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
  dataKey: 'intervention'
};

export const planOfCareActivityInstructions = {
  key: 'instructions',
  attributes: {
    classCode: 'ACT',
    moodCode: 'INT'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.20'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.code,
      dataKey: 'plan'
    },
    fieldLevel.statusCodeNew,
    {
      key: 'priorityCode',
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
      dataKey: 'severity'
    },
    fieldLevel.effectiveTime,
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'COMP'
      },
      content: [
        {
          key: 'observation',
          attributes: {
            classCode: 'OBS',
            moodCode: 'GOL'
          },
          content: [
            fieldLevel.effectiveTime,
            goal,
            {
              key: 'act',
              attributes: {
                classCode: 'ACT',
                moodCode: 'INT'
              },

              content: [
                {
                  key: 'entryRelationship',
                  attributes: {
                    typeCode: 'REFR'
                  },
                  content: [intervention],
                  dataKey: 'interventions'
                }
              ]
            }
          ],
          dataKey: 'goals'
        }
      ],
      required: true
    }
  ],
  existsWhen: function(input) {
    return input.type === 'instructions';
  }
};
