import * as condition from './condition';
import * as contentModifier from './contentModifier';
import * as fieldLevel from './fieldLevel';
import * as leafLevel from './leafLevel';

const key = contentModifier.key;
const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

const patientName = Object.create(fieldLevel.usRealmName);
patientName.attributes = {
  use: 'L'
};

export const patient = {
  content: [
    patientName,
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.1'),
      dataKey: 'gender',
      key: 'administrativeGenderCode'
    },
    {
      attributes: { value: leafLevel.time },
      dataKey: 'dob.point',
      key: 'birthTime'
    },
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.2'),
      dataKey: 'marital_status',
      key: 'maritalStatusCode'
    },
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.5.1076'),
      dataKey: 'religion',
      key: 'religiousAffiliationCode'
    },
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.6.238'),
      dataKey: 'race',
      key: 'raceCode'
    },
    {
      attributes: leafLevel.codeFromName('2.16.840.1.113883.6.238'),
      dataKey: 'ethnicity',
      key: 'ethnicGroupCode'
    },
    {
      content: [
        {
          attributes: {
            code: leafLevel.inputProperty('relationship_code'),
            codeSystem: '2.16.840.1.113883.5.111',
            codeSystemName: 'HL7 Role',
            displayName: leafLevel.inputProperty('display_name')
          },
          dataKey: 'relation',
          key: 'code'
        },
        fieldLevel.usRealmAddress,
        fieldLevel.telecom,
        {
          content: fieldLevel.usRealmName,
          key: 'guardianPerson'
        }
      ],
      dataKey: 'guardians',
      key: 'guardian'
    },
    {
      content: {
        content: [[fieldLevel.usRealmAddress, dataKey('birthplace.address')]],
        key: 'place'
      },
      existsWhen: condition.keyExists('birthplace'),
      key: 'birthplace'
    },
    {
      content: [
        {
          attributes: {
            code: leafLevel.input
          },
          dataKey: 'language',
          key: 'languageCode'
        },
        {
          attributes: leafLevel.codeFromName('2.16.840.1.113883.5.60'),
          dataKey: 'mode',
          existsWhen: condition.keyExists('modecode'),
          key: 'modeCode'
        },
        {
          attributes: {
            code: (input) => {
              return input.substring(0, 1);
            },
            codeSystem: '2.16.840.1.113883.5.61',
            codeSystemName: 'LanguageAbilityProficiency',
            displayName: leafLevel.input
          },
          dataKey: 'proficiency',
          key: 'proficiencyLevelCode'
        },
        {
          attributes: {
            value: (input) => {
              return input.toString();
            }
          },
          dataKey: 'preferred',
          key: 'preferenceInd'
        }
      ],
      dataKey: 'languages',
      key: 'languageCommunication'
    }
  ],
  key: 'patient'
};

export const provider = {
  attributes: {
    typeCode: 'PRF'
  },
  content: [
    [fieldLevel.effectiveTime, key('time'), dataKey('date_time')],
    {
      content: [
        {
          attributes: {
            extension: leafLevel.inputProperty('extension'),
            root: leafLevel.inputProperty('root')
          },
          dataKey: 'identity',
          key: 'id'
        },
        {
          attributes: leafLevel.code,
          dataKey: 'type',
          key: 'code'
        },

        {
          attributes: [
            {
              use: 'WP',
              value: (input) => {
                return input.value.number;
              }
            }
          ],
          dataKey: 'phone',
          key: 'telecom'
        },
        {
          content: [
            {
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
              dataKey: 'name',
              key: 'name'
            }
          ],
          key: 'assignedPerson'
        }
      ],
      key: 'assignedEntity'
    }
  ],
  dataKey: 'providers',
  key: 'performer'
};

export const attributedProvider = {
  content: [
    {
      attributes: {
        extension: leafLevel.inputProperty('extension'),
        root: leafLevel.inputProperty('root')
      },
      dataKey: 'attributed_provider.identity',
      key: 'id'
    },
    {
      dataKey: 'attributed_provider.name',
      key: 'name',
      text: leafLevel.inputProperty('full')
    },
    {
      attributes: [
        {
          use: 'WP',
          value: (input) => {
            return input.value.number;
          }
        }
      ],
      dataKey: 'attributed_provider.phone',
      key: 'telecom'
    }
  ],
  dataKey: 'meta',
  key: 'providerOrganization'
};

export const recordTarget = {
  content: {
    content: [
      fieldLevel.id,
      fieldLevel.usRealmAddress,
      fieldLevel.telecom,
      patient,
      attributedProvider
    ],
    key: 'patientRole'
  },
  dataKey: 'data.demographics',
  key: 'recordTarget'
};

export const headerAuthor = {
  content: [
    [fieldLevel.timeNow, required],
    {
      content: [
        fieldLevel.id,
        {
          attributes: [
            leafLevel.code,
            {
              codeSystem: '2.16.840.1.113883.6.101',
              codeSystemName: 'Healthcare Provider Taxonomy (HIPAA)'
            }
          ],
          dataKey: 'taxonomy_code',
          key: 'code'
        },
        fieldLevel.usRealmAddress,
        fieldLevel.telecom,
        {
          content: [fieldLevel.usRealmName],
          key: 'assignedPerson'
        },
        fieldLevel.representedOrganization
      ],
      key: 'assignedAuthor'
    }
  ],
  dataKey: 'meta.ccda_header.author',
  key: 'author'
};

export const headerInformant = {
  content: {
    // attributes: {id:}
    content: [
      {
        attributes: {
          root: leafLevel.inputProperty('id')
        },
        dataKey: 'informant',
        key: 'id'
      },
      {
        content: [
          {
            attributes: {
              root: leafLevel.inputProperty('id')
            },
            dataKey: 'informant',
            key: 'id'
          },
          {
            dataKey: 'informant',
            key: 'name',
            text: leafLevel.inputProperty('name')
          }
        ],
        key: 'representedOrganization'
      }
    ],
    key: 'assignedEntity'
  },
  dataKey: 'meta.ccda_header',
  existsWhen: condition.keyExists('informant'),
  key: 'informant'
};
export const headerCustodian = {
  content: {
    // attributes: {id:}
    content: [
      [
        fieldLevel.representedOrganization,
        key('representedCustodianOrganization'),
        dataKey('custodian')
      ]
    ],
    key: 'assignedCustodian'
  },
  dataKey: 'meta.ccda_header',
  key: 'custodian'
};

export const providers = {
  attributes: {
    typeCode: 'DOC'
  },
  content: {
    attributes: {
      classCode: 'PCPR'
    },
    content: [[fieldLevel.effectiveTime, dataKey('event.date_time')]],
    dataKey: 'meta',
    key: 'serviceEvent'
  },
  key: 'documentationOf'
};
