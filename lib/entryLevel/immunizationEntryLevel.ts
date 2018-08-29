import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';
import * as sharedEntryLevel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const immunizationMedicationInformation = {
  attributes: {
    classCode: 'MANU'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.54'),
    fieldLevel.id,
    {
      content: [
        {
          attributes: leafLevel.code,
          content: [
            {
              content: {
                attributes: { value: leafLevel.sameReference('vaccine') },
                key: 'reference'
              },
              key: 'originalText',
              text: leafLevel.inputProperty('unencoded_name')
            },
            {
              attributes: leafLevel.code,
              dataKey: 'translations',
              key: 'translation'
            }
          ],
          key: 'code'
        },
        {
          dataKey: 'lot_number',
          key: 'lotNumberText',
          text: leafLevel.input
        }
      ],
      dataKey: 'product',
      key: 'manufacturedMaterial',
      required: true
    },
    {
      content: {
        key: 'name',
        text: leafLevel.input
      },
      dataKey: 'manufacturer',
      key: 'manufacturerOrganization'
    }
  ],
  dataTransform: (input) => {
    if (input.product) {
      input.product.lot_number = input.lot_number;
    }
    return input;
  },
  key: 'manufacturedProduct'
};

const immunizationRefusalReason = {
  attributes: {
    classCode: 'OBS',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.53'),
    fieldLevel.id,
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.8'),
      key: 'code',
      required: true
    },
    fieldLevel.statusCodeCompleted
  ],
  key: 'observation'
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
  return undefined;
};

export const immunizationActivity = {
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
      attributes: {
        value: leafLevel.inputProperty('sequence_number')
      },
      existsWhen: (input) => {
        return input.sequence_number || input.sequence_number === '';
      },
      key: 'repeatNumber'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'administration.route',
      key: 'routeCode'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'administration.body_site',
      key: 'approachSiteCode'
    },
    {
      attributes: {
        unit: leafLevel.inputProperty('unit'),
        value: leafLevel.inputProperty('value')
      },
      dataKey: 'administration.dose',
      key: 'doseQuantity'
    },
    {
      content: [[immunizationMedicationInformation, required]],
      dataKey: 'product',
      key: 'consumable',
      required: true
    },
    fieldLevel.performer,
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [sharedEntryLevel.instructions, required],
      dataKey: 'instructions',
      key: 'entryRelationship'
    },
    {
      attributes: {
        typeCode: 'RSON'
      },
      content: [immunizationRefusalReason, required],
      dataKey: 'refusal_reason',
      key: 'entryRelationship'
    }
  ],
  key: 'substanceAdministration',
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
