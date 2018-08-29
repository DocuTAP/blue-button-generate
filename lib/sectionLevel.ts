import * as condition from './condition';
import * as contentModifier from './contentModifier';
import * as entryLevel from './entryLevel';
import * as fieldLevel from './fieldLevel';
import * as leafLevel from './leafLevel';

const required = contentModifier.required;

export function allergiesSectionEntriesRequired(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.6'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.6.1'),
          fieldLevel.templateCode('AllergiesSection'),
          fieldLevel.templateTitle('AllergiesSection'),
          {
            existsWhen: condition.keyDoesntExist('allergies'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.allergyProblemAct, required]],
            dataKey: 'allergies',
            key: 'entry'
          }
        ],
        key: 'section',
        nullFlavor: {
          existsWhen: condition.keyDoesntExist('allergies'),
          value: 'NI'
        }
      }
    ],
    key: 'component'
  };
}

export function medicationsSectionEntriesRequired(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.1'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.1.1'),
          fieldLevel.templateCode('MedicationsSection'),
          fieldLevel.templateTitle('MedicationsSection'),
          {
            existsWhen: condition.keyDoesntExist('medications'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.medicationActivity, required]],
            dataKey: 'medications',
            key: 'entry'
          }
        ],
        key: 'section',
        nullFlavor: {
          existsWhen: condition.keyDoesntExist('medications'),
          value: 'NI'
        }
      }
    ],
    key: 'component'
  };
}

export function problemsSectionEntriesRequired(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.5'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.5.1'),
          fieldLevel.templateCode('ProblemSection'),
          fieldLevel.templateTitle('ProblemSection'),
          {
            existsWhen: condition.keyDoesntExist('problems'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.problemConcernAct, required]],
            dataKey: 'problems',
            key: 'entry',
            required: true
          },
          {
            content: {
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
              ],
              key: 'act'
            },
            dataKey: 'demographics.meta',
            existsWhen: condition.keyExists('problems_comment'),
            key: 'entry'
          }
        ],
        key: 'section'
      }
    ],
    key: 'component'
  };
}

export function proceduresSectionEntriesRequired(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.7'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.7.1'),
          fieldLevel.templateCode('ProceduresSection'),
          fieldLevel.templateTitle('ProceduresSection'),
          {
            existsWhen: condition.keyDoesntExist('procedures'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: (input) => {
                return input.procedure_type === 'procedure' ? 'DRIV' : undefined;
              }
            },
            content: [
              entryLevel.procedureActivityAct,
              entryLevel.procedureActivityProcedure,
              entryLevel.procedureActivityObservation
            ],
            dataKey: 'procedures',
            key: 'entry'
          }
        ],
        key: 'section'
      }
    ],
    key: 'component',
    notImplemented: ['entry required']
  };
}

export function resultsSectionEntriesRequired(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.3'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.3.1'),
          fieldLevel.templateCode('ResultsSection'),
          fieldLevel.templateTitle('ResultsSection'),
          {
            existsWhen: condition.keyDoesntExist('results'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.resultOrganizer, required]],
            dataKey: 'results',
            key: 'entry',
            required: true
          }
        ],
        key: 'section'
      }
    ],
    key: 'component'
  };
}

export function encountersSectionEntriesOptional(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.22'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.22.1'),
          fieldLevel.templateCode('EncountersSection'),
          fieldLevel.templateTitle('EncountersSection'),
          {
            existsWhen: condition.keyDoesntExist('encounters'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.encounterActivities, required]],
            dataKey: 'encounters',
            key: 'entry'
          }
        ],
        key: 'section'
      }
    ],
    key: 'component'
  };
}

export function immunizationsSectionEntriesOptional(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.2'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.2.1'),
          fieldLevel.templateCode('ImmunizationsSection'),
          fieldLevel.templateTitle('ImmunizationsSection'),
          {
            existsWhen: condition.keyDoesntExist('immunizations'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.immunizationActivity, required]],
            dataKey: 'immunizations',
            key: 'entry'
          }
        ],
        key: 'section',
        nullFlavor: {
          existsWhen: condition.keyDoesntExist('immunizations'),
          value: 'NI'
        }
      }
    ],
    key: 'component'
  };
}

export function payersSection(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.18'),
          fieldLevel.templateCode('PayersSection'),
          fieldLevel.templateTitle('PayersSection'),
          {
            existsWhen: condition.keyDoesntExist('payers'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.coverageActivity, required]],
            dataKey: 'payers',
            key: 'entry'
          }
        ],
        key: 'section'
      }
    ],
    key: 'component'
  };
}

export function planOfCareSection(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.10'),
          fieldLevel.templateCode('PlanOfCareSection'),
          fieldLevel.templateTitle('PlanOfCareSection'),
          {
            existsWhen: condition.keyDoesntExist('plan_of_care'),
            key: 'text',
            text: na
          },
          htmlHeader,
          entryLevel.planOfCareActivityAct,
          entryLevel.planOfCareActivityObservation,
          entryLevel.planOfCareActivityProcedure,
          entryLevel.planOfCareActivityEncounter,
          entryLevel.planOfCareActivitySubstanceAdministration,
          entryLevel.planOfCareActivitySupply,
          entryLevel.planOfCareActivityInstructions
        ],
        key: 'section'
      }
    ],
    key: 'component'
  };
}

export function socialHistorySection(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.17'),
          fieldLevel.templateCode('SocialHistorySection'),
          fieldLevel.templateTitle('SocialHistorySection'),
          {
            existsWhen: condition.keyDoesntExist('social_history'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [entryLevel.smokingStatusObservation, entryLevel.socialHistoryObservation],
            dataKey: 'social_history',
            key: 'entry'
          }
        ],
        key: 'section'
      }
    ],
    key: 'component',
    notImplemented: ['pregnancyObservation', 'tobaccoUse']
  };
}

export function vitalSignsSectionEntriesOptional(htmlHeader, na) {
  return {
    content: [
      {
        content: [
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.4'),
          fieldLevel.templateId('2.16.840.1.113883.10.20.22.2.4.1'),
          fieldLevel.templateCode('VitalSignsSection'),
          fieldLevel.templateTitle('VitalSignsSection'),
          {
            existsWhen: condition.keyDoesntExist('vitals'),
            key: 'text',
            text: na
          },
          htmlHeader,
          {
            attributes: {
              typeCode: 'DRIV'
            },
            content: [[entryLevel.vitalSignsOrganizer, required]],
            dataKey: 'vitals',
            key: 'entry'
          }
        ],
        key: 'section',
        nullFlavor: {
          existsWhen: condition.keyDoesntExist('vitals'),
          value: 'NI'
        }
      }
    ],
    key: 'component'
  };
}
