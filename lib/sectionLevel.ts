'use strict';

import * as condition from './condition';
import * as contentModifier from './contentModifier';
import * as entryLevel from './entryLevel';
import * as fieldLevel from './fieldLevel';
import * as leafLevel from './leafLevel';

const required = contentModifier.required;

export function allergiesSectionEntriesRequired(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        nullFlavor: {
          value: 'NI',
          existsWhen: condition.keyDoesntExist('allergies')
        },
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.6'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.6.1'),
          fieldLevel.templateCode('AllergiesSection'),
          fieldLevel.templateTitle('AllergiesSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('allergies')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.allergyProblemAct, required]],
            dataKey: 'allergies'
          }
        ]
      }
    ]
  };
}

export function medicationsSectionEntriesRequired(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        nullFlavor: {
          value: 'NI',
          existsWhen: condition.keyDoesntExist('medications')
        },
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.1'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.1.1'),
          fieldLevel.templateCode('MedicationsSection'),
          fieldLevel.templateTitle('MedicationsSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('medications')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.medicationActivity, required]],
            dataKey: 'medications'
          }
        ]
      }
    ]
  };
}

export function problemsSectionEntriesRequired(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.5'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.5.1'),
          fieldLevel.templateCode('ProblemSection'),
          fieldLevel.templateTitle('ProblemSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('problems')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.problemConcernAct, required]],
            dataKey: 'problems',
            required: true
          },
          {
            key: 'entry',
            existsWhen: condition.keyExists('problems_comment'),
            content: {
              key: 'act',
              attributes: {
                classCode: 'ACT',
                moodCode: 'EVN'
              },
              content: [
                fieldLevel.templateId('2.16.840.1.113883.10.20.22.4.64'),
                fieldLevel.templateCode('CommentActivity'),
                {
                  key: 'text',
                  text: leafLevel.deepInputProperty('problems_comment')
                }
              ]
            },
            dataKey: 'demographics.meta'
          }
        ]
      }
    ]
  };
}

export function proceduresSectionEntriesRequired(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.7'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.7.1'),
          fieldLevel.templateCode('ProceduresSection'),
          fieldLevel.templateTitle('ProceduresSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('procedures')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: (input) => {
                return input.procedure_type === 'procedure' ? 'DRIV' : null;
              }
            },
            content: [
              entryLevel.procedureActivityAct,
              entryLevel.procedureActivityProcedure,
              entryLevel.procedureActivityObservation
            ],
            dataKey: 'procedures'
          }
        ]
      }
    ],
    notImplemented: ['entry required']
  };
}

export function resultsSectionEntriesRequired(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.3'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.3.1'),
          fieldLevel.templateCode('ResultsSection'),
          fieldLevel.templateTitle('ResultsSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('results')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.resultOrganizer, required]],
            dataKey: 'results',
            required: true
          }
        ]
      }
    ]
  };
}

export function encountersSectionEntriesOptional(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.22'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.22.1'),
          fieldLevel.templateCode('EncountersSection'),
          fieldLevel.templateTitle('EncountersSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('encounters')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.encounterActivities, required]],
            dataKey: 'encounters'
          }
        ]
      }
    ]
  };
}

export function immunizationsSectionEntriesOptional(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        nullFlavor: {
          value: 'NI',
          existsWhen: condition.keyDoesntExist('immunizations')
        },
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.2'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.2.1'),
          fieldLevel.templateCode('ImmunizationsSection'),
          fieldLevel.templateTitle('ImmunizationsSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('immunizations')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.immunizationActivity, required]],
            dataKey: 'immunizations'
          }
        ]
      }
    ]
  };
}

export function payersSection(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.18'),
          fieldLevel.templateCode('PayersSection'),
          fieldLevel.templateTitle('PayersSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('payers')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.coverageActivity, required]],
            dataKey: 'payers'
          }
        ]
      }
    ]
  };
}

export function planOfCareSection(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.10'),
          fieldLevel.templateCode('PlanOfCareSection'),
          fieldLevel.templateTitle('PlanOfCareSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('plan_of_care')
          },
          htmlHeader,
          entryLevel.planOfCareActivityAct,
          entryLevel.planOfCareActivityObservation,
          entryLevel.planOfCareActivityProcedure,
          entryLevel.planOfCareActivityEncounter,
          entryLevel.planOfCareActivitySubstanceAdministration,
          entryLevel.planOfCareActivitySupply,
          entryLevel.planOfCareActivityInstructions
        ]
      }
    ]
  };
}

export function socialHistorySection(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.17'),
          fieldLevel.templateCode('SocialHistorySection'),
          fieldLevel.templateTitle('SocialHistorySection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('social_history')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [entryLevel.smokingStatusObservation, entryLevel.socialHistoryObservation],
            dataKey: 'social_history'
          }
        ]
      }
    ],
    notImplemented: ['pregnancyObservation', 'tobaccoUse']
  };
}

export function vitalSignsSectionEntriesOptional(htmlHeader, na) {
  return {
    key: 'component',
    content: [
      {
        key: 'section',
        nullFlavor: {
          value: 'NI',
          existsWhen: condition.keyDoesntExist('vitals')
        },
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.4'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.4.1'),
          fieldLevel.templateCode('VitalSignsSection'),
          fieldLevel.templateTitle('VitalSignsSection'),
          {
            key: 'text',
            text: na,
            existsWhen: condition.keyDoesntExist('vitals')
          },
          htmlHeader,
          {
            key: 'entry',
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.vitalSignsOrganizer, required]],
            dataKey: 'vitals'
          }
        ]
      }
    ]
  };
}
