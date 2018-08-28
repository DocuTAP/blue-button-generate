'use strict';

import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';
import * as condition from '../condition';
import * as contentModifier from '../contentModifier';

import * as sharedEntryLevel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const immunizationMedicationInformation = {
  key: 'manufacturedProduct',
  attributes: {
    classCode: 'MANU'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.54'),
    fieldLevel.id,
    {
      key: 'manufacturedMaterial',
      content: [
        {
          key: 'code',
          attributes: leafLevel.code,
          content: [
            {
              key: 'originalText',
              text: leafLevel.inputProperty('unencoded_name'),
              content: {
                key: 'reference',
                attributes: { value: leafLevel.sameReference('vaccine') }
              }
            },
            {
              key: 'translation',
              attributes: leafLevel.code,
              dataKey: 'translations'
            }
          ]
        },
        {
          key: 'lotNumberText',
          text: leafLevel.input,
          dataKey: 'lot_number'
        }
      ],
      dataKey: 'product',
      required: true
    },
    {
      key: 'manufacturerOrganization',
      content: {
        key: 'name',
        text: leafLevel.input
      },
      dataKey: 'manufacturer'
    }
  ],
  dataTransform: (input) => {
    if (input.product) {
      input.product.lot_number = input.lot_number;
    }
    return input;
  }
};

const immunizationRefusalReason = {
  key: 'observation',
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.53'),
    fieldLevel.id,
    {
      key: 'code',
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.8'),
      required: true
    },
    fieldLevel.statusCodeCompleted
  ]
};

const immunizationActivityAttributes = (input) => {
  if (input.status) {
    if (input.status === 'refused') {
      return {
        moodCode: 'EVN',
        negationInd: 'true'
      };
    }
    if (input.status === 'pending') {
      return {
        moodCode: 'INT',
        negationInd: 'false'
      };
    }
    if (input.status === 'complete') {
      return {
        moodCode: 'EVN',
        negationInd: 'false'
      };
    }
  }
  return null;
};

export const immunizationActivity = {
  key: 'substanceAdministration',
  attributes: [
    {
      classCode: 'SBADM'
    },
    immunizationActivityAttributes
  ],
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.52'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    fieldLevel.text(leafLevel.nextReference('vaccine')),
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      key: 'repeatNumber',
      attributes: {
        value: leafLevel.inputProperty('sequence_number')
      },
      existsWhen: (input) => {
        return input.sequence_number || input.sequence_number === '';
      }
    },
    {
      key: 'routeCode',
      attributes: leafLevel.code,
      dataKey: 'administration.route'
    },
    {
      key: 'approachSiteCode',
      attributes: leafLevel.code,
      dataKey: 'administration.body_site'
    },
    {
      key: 'doseQuantity',
      attributes: {
        value: leafLevel.inputProperty('value'),
        unit: leafLevel.inputProperty('unit')
      },
      dataKey: 'administration.dose'
    },
    {
      key: 'consumable',
      content: [[immunizationMedicationInformation, required]],
      dataKey: 'product',
      required: true
    },
    fieldLevel.performer,
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [sharedEntryLevel.instructions, required],
      dataKey: 'instructions'
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'RSON'
      },
      content: [immunizationRefusalReason, required],
      dataKey: 'refusal_reason'
    }
  ],
  notImplemented: [
    'code',
    'administrationUnitCode',
    'participant:drugVehicle',
    'entryRelationship:indication',
    'entryRelationship:medicationSupplyOrder',
    'entryRelationship:medicationDispense',
    'entryRelationship:reactionObservation',
    'entryRelationship:preconditionForSubstanceAdministration'
  ]
};
