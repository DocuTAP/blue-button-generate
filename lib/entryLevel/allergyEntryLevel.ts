import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';

import * as sel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const allergyStatusObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.28'),
    fieldLevel.templateCode('AllergyStatusObservation'),
    fieldLevel.statusCodeCompleted,
    {
      attributes: [leafLevel.typeCE, leafLevel.code],
      existsWhen: condition.codeOrDisplayname,
      key: 'value',
      required: true
    }
  ],
  dataKey: 'status',
  key: 'observation'
};

export const allergyIntoleranceObservation = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.7'),
    fieldLevel.id,
    fieldLevel.templateCode('AllergyObservation'),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'intolerance',
      existsWhen: condition.codeOrDisplayname,
      key: 'value',
      required: true
    },
    {
      attributes: {
        typeCode: 'CSM'
      },
      content: [
        {
          attributes: {
            classCode: 'MANU'
          },
          content: [
            {
              attributes: {
                classCode: 'MMAT'
              },
              content: [
                {
                  attributes: leafLevel.code,
                  content: [
                    {
                      content: [
                        {
                          attributes: {
                            value: leafLevel.nextReference('substance')
                          },
                          key: 'reference'
                        }
                      ],
                      key: 'originalText'
                    },
                    {
                      attributes: leafLevel.code,
                      dataKey: 'translations',
                      key: 'translation'
                    }
                  ],
                  key: 'code',
                  require: true
                }
              ],
              key: 'playingEntity'
            }
          ],
          key: 'participantRole',
          required: true
        }
      ],
      dataKey: 'allergen',
      key: 'participant'
    },
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [[allergyStatusObservation, required]],
      existsWhen: condition.keyExists('status'),
      key: 'entryRelationship'
    },
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'MFST'
      },
      content: [[sel.reactionObservation, required]],
      dataKey: 'reactions',
      existsWhen: condition.keyExists('reaction'),
      key: 'entryRelationship'
    },
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [[sel.severityObservation('overall_severity'), required]],
      existsWhen: condition.keyExists('severity'),
      key: 'entryRelationship'
    }
  ],
  dataKey: 'observation',
  key: 'observation'
};

export const allergyProblemAct = {
  attributes: {
    classCode: 'ACT',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.30'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    fieldLevel.templateCode('AllergyProblemAct'),
    fieldLevel.statusCode,
    [fieldLevel.effectiveTime, required],
    {
      attributes: {
        typeCode: 'SUBJ'
      },
      content: [allergyIntoleranceObservation, required],
      existsWhen: condition.keyExists('observation'),
      key: 'entryRelationship',
      required: true
    }
  ],
  key: 'act'
};
