'use strict';

import * as condition from '../condition';
import * as contentModifier from '../contentModifier';
import * as fieldLevel from '../fieldLevel';
import * as leafLevel from '../leafLevel';
import * as sharedEntryLevel from './sharedEntryLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const medicationInformation = {
  attributes: {
    classCode: 'MANU'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.23'),
    fieldLevel.id,
    {
      content: [
        {
          attributes: leafLevel.code,
          content: [
            {
              content: [
                {
                  attributes: { value: leafLevel.nextReference('medinfo') },
                  key: 'reference'
                }
              ],
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
      input.product.unencoded_name = input.unencoded_name;
    }
    return input;
  },
  key: 'manufacturedProduct'
};

const medicationSupplyOrder = {
  attributes: {
    classCode: 'SPLY',
    moodCode: 'INT'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.17'),
    fieldLevel.id,
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      attributes: {
        value: leafLevel.input
      },
      dataKey: 'repeatNumber',
      key: 'repeatNumber'
    },
    {
      attributes: {
        value: leafLevel.input
      },
      dataKey: 'quantity',
      key: 'quantity'
    },
    {
      content: medicationInformation,
      dataKey: 'product',
      key: 'product'
    },
    fieldLevel.author,
    {
      attributes: {
        inversionInd: 'true',
        typeCode: 'SUBJ'
      },
      content: [[sharedEntryLevel.instructions, required]],
      dataKey: 'instructions',
      key: 'entryRelationship'
    }
  ],
  key: 'supply',
  notImplemented: ['product:immunizationMedicationInformation'],
  toDo: 'statusCode needs to allow values other than completed'
};

const medicationDispense = {
  attributes: {
    classCode: 'SPLY',
    moodCode: 'EVN'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.18'),
    fieldLevel.id,
    fieldLevel.statusCodeCompleted,
    fieldLevel.effectiveTime,
    {
      content: medicationInformation,
      dataKey: 'product',
      key: 'product'
    },
    fieldLevel.performer
  ],
  key: 'supply',
  notImplemented: [
    'repeatNumber',
    'quantity',
    'product:ImmunizationMedicationInformation',
    'entryRelationship:medicationSupplyOrder'
  ],
  toDo: 'statusCode needs to allow different values than completed'
};

export const medicationActivity = {
  attributes: {
    classCode: 'SBADM',
    moodCode: (input) => {
      const status = input.status;
      if (status) {
        if (status === 'prescribed') {
          return 'INT';
        }
        if (status === 'completed') {
          return 'EVN';
        }
      }
      return undefined;
    }
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.16'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      dataKey: 'sig',
      key: 'text',
      text: leafLevel.input
    },
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      attributes: {
        institutionSpecified: 'true',
        operator: 'A',
        'xsi:type': 'PIVL_TS'
      },
      content: {
        attributes: {
          unit: leafLevel.inputProperty('unit'),
          value: leafLevel.inputProperty('value')
        },
        key: 'period'
      },
      dataKey: 'administration.interval.period',
      key: 'effectiveTime'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'administration.route',
      key: 'routeCode'
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
      attributes: {
        unit: leafLevel.inputProperty('unit'),
        value: leafLevel.inputProperty('value')
      },
      dataKey: 'administration.rate',
      key: 'rateQuantity'
    },
    {
      attributes: leafLevel.code,
      dataKey: 'administration.form',
      key: 'administrationUnitCode'
    },
    {
      content: medicationInformation,
      dataKey: 'product',
      key: 'consumable'
    },
    fieldLevel.performer,
    {
      attributes: {
        typeCode: 'CSM'
      },
      content: [[sharedEntryLevel.drugVehicle, required]],
      dataKey: 'drug_vehicle',
      key: 'participant'
    },
    {
      attributes: {
        typeCode: 'RSON'
      },
      content: [[sharedEntryLevel.indication, required]],
      dataKey: 'indication',
      key: 'entryRelationship'
    },
    {
      attributes: {
        typeCode: 'REFR'
      },
      content: [[medicationSupplyOrder, required]],
      dataKey: 'supply',
      key: 'entryRelationship'
    },
    {
      attributes: {
        typeCode: 'REFR'
      },
      content: [[medicationDispense]],
      dataKey: 'dispense',
      key: 'entryRelationship'
    },
    {
      attributes: {
        typeCode: 'PRCN'
      },
      content: [[sharedEntryLevel.preconditionForSubstanceAdministration, required]],
      dataKey: 'precondition',
      key: 'precondition'
    }
  ],
  key: 'substanceAdministration',
  notImplemented: [
    'code',
    'text:reference',
    'repeatNumber',
    'approachSiteCode',
    'maxDoseQuantity',
    'entryRelationship:instructions',
    'reactionObservation'
  ]
};
