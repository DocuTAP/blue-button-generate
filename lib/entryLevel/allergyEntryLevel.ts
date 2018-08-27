'use strict';

import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';
import * as condition from '../condition';
import * as contentModifier from '../contentModifier';

import * as sel from './sharedEntryLevel';

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var allergyStatusObservation = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.28'),
    fieldLevel.templateCode('AllergyStatusObservation'),
    fieldLevel.statusCodeCompleted,
    {
      key: 'value',
      attributes: [leafLevel.typeCE, leafLevel.code],
      existsWhen: condition.codeOrDisplayname,
      required: true
    }
  ],
  dataKey: 'status'
};

export const allergyIntoleranceObservation = {
  key: 'observation',
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
      key: 'value',
      attributes: [leafLevel.typeCD, leafLevel.code],
      dataKey: 'intolerance',
      existsWhen: condition.codeOrDisplayname,
      required: true
    },
    {
      key: 'participant',
      attributes: {
        typeCode: 'CSM'
      },
      content: [
        {
          key: 'participantRole',
          attributes: {
            classCode: 'MANU'
          },
          content: [
            {
              key: 'playingEntity',
              attributes: {
                classCode: 'MMAT'
              },
              content: [
                {
                  key: 'code',
                  attributes: leafLevel.code,
                  content: [
                    {
                      key: 'originalText',
                      content: [
                        {
                          key: 'reference',
                          attributes: {
                            value: leafLevel.nextReference('substance')
                          }
                        }
                      ]
                    },
                    {
                      key: 'translation',
                      attributes: leafLevel.code,
                      dataKey: 'translations'
                    }
                  ],
                  require: true
                }
              ]
            }
          ],
          required: true
        }
      ],
      dataKey: 'allergen'
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [[allergyStatusObservation, required]],
      existsWhen: condition.keyExists('status')
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'MFST',
        inversionInd: 'true'
      },
      content: [[sel.reactionObservation, required]],
      dataKey: 'reactions',
      existsWhen: condition.keyExists('reaction')
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [[sel.severityObservation('overall_severity'), required]],
      existsWhen: condition.keyExists('severity')
    }
  ],
  dataKey: 'observation'
};

export const allergyProblemAct = {
  key: 'act',
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
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ'
      },
      content: [allergyIntoleranceObservation, required],
      existsWhen: condition.keyExists('observation'),
      required: true
    }
  ]
};
