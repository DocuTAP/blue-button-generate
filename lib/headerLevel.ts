'use strict';

import * as fieldLevel from './fieldLevel';
import * as leafLevel from './leafLevel';
import * as condition from './condition';
import * as contentModifier from './contentModifier';

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var patientName = Object.create(fieldLevel.usRealmName);
patientName.attributes = {
  use: 'L'
};

export const patient = {
  key: 'patient',
  content: [
    patientName,
    {
      dataKey: 'gender',
      key: 'administrativeGenderCode',
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.1')
    },
    {
      dataKey: 'dob.point',
      key: 'birthTime',
      attributes: { value: leafLevel.time }
    },
    {
      dataKey: 'marital_status',
      key: 'maritalStatusCode',
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.2')
    },
    {
      dataKey: 'religion',
      key: 'religiousAffiliationCode',
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.1076')
    },
    {
      dataKey: 'race',
      key: 'raceCode',
      attributes: leafLevel.codeFromName('2.16.840.1.113883.6.238')
    },
    {
      dataKey: 'ethnicity',
      key: 'ethnicGroupCode',
      attributes: leafLevel.codeFromName('2.16.840.1.113883.6.238')
    },
    {
      dataKey: 'guardians',
      key: 'guardian',
      content: [
        {
          dataKey: 'relation',
          key: 'code',
          attributes: {
            code: leafLevel.inputProperty('relationship_code'),
            displayName: leafLevel.inputProperty('display_name'),
            codeSystem: '2.16.840.1.113883.5.111',
            codeSystemName: 'HL7 Role'
          }
        },
        fieldLevel.usRealmAddress,
        fieldLevel.telecom,
        {
          key: 'guardianPerson',
          content: fieldLevel.usRealmName
        }
      ]
    },
    {
      key: 'birthplace',
      existsWhen: condition.keyExists('birthplace'),
      content: {
        key: 'place',
        content: [[fieldLevel.usRealmAddress, dataKey('birthplace.address')]]
      }
    },
    {
      dataKey: 'languages',
      key: 'languageCommunication',
      content: [
        {
          dataKey: 'language',
          key: 'languageCode',
          attributes: {
            code: leafLevel.input
          }
        },
        {
          dataKey: 'mode',
          existsWhen: condition.keyExists('modecode'),
          key: 'modeCode',
          attributes: leafLevel.codeFromName('2.16.840.1.113883.5.60')
        },
        {
          dataKey: 'proficiency',
          key: 'proficiencyLevelCode',
          attributes: {
            code: function(input) {
              return input.substring(0, 1);
            },
            displayName: leafLevel.input,
            codeSystem: '2.16.840.1.113883.5.61',
            codeSystemName: 'LanguageAbilityProficiency'
          }
        },
        {
          dataKey: 'preferred',
          key: 'preferenceInd',
          attributes: {
            value: function(input) {
              return input.toString();
            }
          }
        }
      ]
    }
  ]
};

export const provider = {
  key: 'performer',
  attributes: {
    typeCode: 'PRF'
  },
  content: [
    [fieldLevel.effectiveTime, key('time'), dataKey('date_time')],
    {
      key: 'assignedEntity',
      content: [
        {
          key: 'id',
          attributes: {
            extension: leafLevel.inputProperty('extension'),
            root: leafLevel.inputProperty('root')
          },
          dataKey: 'identity'
        },
        {
          key: 'code',
          attributes: leafLevel.code,
          dataKey: 'type'
        },

        {
          key: 'telecom',
          attributes: [
            {
              use: 'WP',
              value: function(input) {
                return input.value.number;
              }
            }
          ],
          dataKey: 'phone'
        },
        {
          key: 'assignedPerson',
          content: [
            {
              key: 'name',
              content: [
                {
                  key: 'given',
                  text: leafLevel.inputProperty('first')
                },
                {
                  key: 'family',
                  text: leafLevel.inputProperty('last')
                }
              ],
              dataKey: 'name'
            }
          ]
        }
      ]
    }
  ],
  dataKey: 'providers'
};

export const attributed_provider = {
  key: 'providerOrganization',
  content: [
    {
      key: 'id',
      attributes: {
        extension: leafLevel.inputProperty('extension'),
        root: leafLevel.inputProperty('root')
      },
      dataKey: 'attributed_provider.identity'
    },
    {
      key: 'name',
      text: leafLevel.inputProperty('full'),
      dataKey: 'attributed_provider.name'
    },
    {
      key: 'telecom',
      attributes: [
        {
          use: 'WP',
          value: function(input) {
            return input.value.number;
          }
        }
      ],
      dataKey: 'attributed_provider.phone'
    }
  ],
  dataKey: 'meta'
};

export const recordTarget = {
  key: 'recordTarget',
  content: {
    key: 'patientRole',
    content: [
      fieldLevel.id,
      fieldLevel.usRealmAddress,
      fieldLevel.telecom,
      patient,
      attributed_provider
    ]
  },
  dataKey: 'data.demographics'
};

export const headerAuthor = {
  key: 'author',
  content: [
    [fieldLevel.timeNow, required],
    {
      key: 'assignedAuthor',
      content: [
        fieldLevel.id,
        {
          key: 'code',
          attributes: [
            leafLevel.code,
            {
              codeSystemName: 'Healthcare Provider Taxonomy (HIPAA)',
              codeSystem: '2.16.840.1.113883.6.101'
            }
          ],
          dataKey: 'taxonomy_code'
        },
        fieldLevel.usRealmAddress,
        fieldLevel.telecom,
        {
          key: 'assignedPerson',
          content: [fieldLevel.usRealmName]
        },
        fieldLevel.representedOrganization
      ]
    }
  ],
  dataKey: 'meta.ccda_header.author'
};

export const headerInformant = {
  key: 'informant',
  content: {
    key: 'assignedEntity',
    //attributes: {id:}
    content: [
      {
        key: 'id',
        attributes: {
          root: leafLevel.inputProperty('id')
        },
        dataKey: 'informant'
      },
      {
        key: 'representedOrganization',
        content: [
          {
            key: 'id',
            attributes: {
              root: leafLevel.inputProperty('id')
            },
            dataKey: 'informant'
          },
          {
            key: 'name',
            text: leafLevel.inputProperty('name'),
            dataKey: 'informant'
          }
        ]
      }
    ]
  },
  dataKey: 'meta.ccda_header',
  existsWhen: condition.keyExists('informant')
};
export const headerCustodian = {
  key: 'custodian',
  content: {
    key: 'assignedCustodian',
    //attributes: {id:}
    content: [
      [
        fieldLevel.representedOrganization,
        key('representedCustodianOrganization'),
        dataKey('custodian')
      ]
    ]
  },
  dataKey: 'meta.ccda_header'
};

export const providers = {
  key: 'documentationOf',
  attributes: {
    typeCode: 'DOC'
  },
  content: {
    key: 'serviceEvent',
    attributes: {
      classCode: 'PCPR'
    },
    content: [[fieldLevel.effectiveTime, dataKey('event.date_time')]],
    dataKey: 'meta'
  }
};
