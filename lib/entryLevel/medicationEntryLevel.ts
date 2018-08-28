'use strict';

import * as fieldLevel from '../fieldLevel'
import * as leafLevel from '../leafLevel'
import * as condition from '../condition'
import * as contentModifier from '../contentModifier'

import * as sharedEntryLevel from './sharedEntryLevel'

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const medicationInformation = {
  key: 'manufacturedProduct',
  attributes: {
    classCode: 'MANU'
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.23'),
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
              content: [
                {
                  key: 'reference',
                  attributes: { value: leafLevel.nextReference('medinfo') }
                }
              ]
            },
            {
              key: 'translation',
              attributes: leafLevel.code,
              dataKey: 'translations'
            }
          ]
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
      input.product.unencoded_name = input.unencoded_name;
    }
    return input;
  }
};

const medicationSupplyOrder = {
  key: 'supply',
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
      key: 'repeatNumber',
      attributes: {
        value: leafLevel.input
      },
      dataKey: 'repeatNumber'
    },
    {
      key: 'quantity',
      attributes: {
        value: leafLevel.input
      },
      dataKey: 'quantity'
    },
    {
      key: 'product',
      content: medicationInformation,
      dataKey: 'product'
    },
    fieldLevel.author,
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'SUBJ',
        inversionInd: 'true'
      },
      content: [[sharedEntryLevel.instructions, required]],
      dataKey: 'instructions'
    }
  ],
  toDo: 'statusCode needs to allow values other than completed',
  notImplemented: ['product:immunizationMedicationInformation']
};

const medicationDispense = {
  key: 'supply',
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
      key: 'product',
      content: medicationInformation,
      dataKey: 'product'
    },
    fieldLevel.performer
  ],
  toDo: 'statusCode needs to allow different values than completed',
  notImplemented: [
    'repeatNumber',
    'quantity',
    'product:ImmunizationMedicationInformation',
    'entryRelationship:medicationSupplyOrder'
  ]
};

export const medicationActivity = {
  key: 'substanceAdministration',
  attributes: {
    classCode: 'SBADM',
    moodCode: (input) => {
      var status = input.status;
      if (status) {
        if (status === 'prescribed') {
          return 'INT';
        }
        if (status === 'completed') {
          return 'EVN';
        }
      }
      return null;
    }
  },
  content: [
    fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.16'),
    fieldLevel.uniqueId,
    fieldLevel.id,
    {
      key: 'text',
      text: leafLevel.input,
      dataKey: 'sig'
    },
    fieldLevel.statusCodeCompleted,
    [fieldLevel.effectiveTime, required],
    {
      key: 'effectiveTime',
      attributes: {
        'xsi:type': 'PIVL_TS',
        institutionSpecified: 'true',
        operator: 'A'
      },
      content: {
        key: 'period',
        attributes: {
          value: leafLevel.inputProperty('value'),
          unit: leafLevel.inputProperty('unit')
        }
      },
      dataKey: 'administration.interval.period'
    },
    {
      key: 'routeCode',
      attributes: leafLevel.code,
      dataKey: 'administration.route'
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
      key: 'rateQuantity',
      attributes: {
        value: leafLevel.inputProperty('value'),
        unit: leafLevel.inputProperty('unit')
      },
      dataKey: 'administration.rate'
    },
    {
      key: 'administrationUnitCode',
      attributes: leafLevel.code,
      dataKey: 'administration.form'
    },
    {
      key: 'consumable',
      content: medicationInformation,
      dataKey: 'product'
    },
    fieldLevel.performer,
    {
      key: 'participant',
      attributes: {
        typeCode: 'CSM'
      },
      content: [[sharedEntryLevel.drugVehicle, required]],
      dataKey: 'drug_vehicle'
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'RSON'
      },
      content: [[sharedEntryLevel.indication, required]],
      dataKey: 'indication'
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'REFR'
      },
      content: [[medicationSupplyOrder, required]],
      dataKey: 'supply'
    },
    {
      key: 'entryRelationship',
      attributes: {
        typeCode: 'REFR'
      },
      content: [[medicationDispense]],
      dataKey: 'dispense'
    },
    {
      key: 'precondition',
      attributes: {
        typeCode: 'PRCN'
      },
      content: [[sharedEntryLevel.preconditionForSubstanceAdministration, required]],
      dataKey: 'precondition'
    }
  ],
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
