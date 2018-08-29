import * as bbu from 'blue-button-util';
import * as condition from './condition';
import * as contentModifier from './contentModifier';
import * as leafLevel from './leafLevel';

const required = contentModifier.required;
const bbud = bbu.datetime;
const bbuo = bbu.object;

const nda = 'No Data Available';

const allergiesTextHeaders = [
  'Substance',
  'Overall Severity',
  'Reaction',
  'Reaction Severity',
  'Status'
];
const allergiesTextRow = [
  leafLevel.deepInputProperty('observation.allergen.name', ''),
  leafLevel.deepInputProperty('observation.severity.code.name', ''),
  leafLevel.deepInputProperty('observation.reactions.0.reaction.name', ''),
  leafLevel.deepInputProperty('observation.reactions.0.severity.code.name', ''),
  leafLevel.deepInputProperty('observation.status.name', '')
];

exports.allergiesSectionEntriesRequiredHtmlHeader = getText(
  'allergies',
  allergiesTextHeaders,
  allergiesTextRow
);

const medicationsTextHeaders = ['Medication Class', 'Number of fills', 'Last fill date'];
const medicationsTextRow = [
  // Name, did not find class in the medication blue-button-data
  (input) => {
    let value = bbuo.deepValue(input, 'product.product.name');
    if (!bbuo.exists(value)) {
      value = bbuo.deepValue(input, 'product.unencoded_name');
    }
    if (!bbuo.exists(value)) {
      return '';
    } else {
      return value;
    }
  },
  leafLevel.deepInputProperty('supply.repeatNumber', ''),
  leafLevel.deepInputDate('supply.date_time.point', '')
];

exports.medicationsSectionEntriesRequiredHtmlHeader = getText(
  'medications',
  medicationsTextHeaders,
  medicationsTextRow
);

const problemsTextHeaders = [
  'Condition',
  'Severity',
  'Age at Onset',
  'Problem Status',
  'Problem Start',
  'Problem End',
  'Patient Health Status'
];
const problemsTextRow = [
  leafLevel.deepInputProperty('problem.code.name', nda),
  leafLevel.deepInputProperty('problem.severity.code.name', nda),
  (problem) => `${problem.onset_age} ${problem.onset_age_unit}s Old`,
  leafLevel.deepInputProperty('status.name', nda),
  leafLevel.deepInputDate('status.date_time.low', nda),
  leafLevel.deepInputDate('status.date_time.high', nda),
  leafLevel.deepInputProperty('patient_status', nda)
];

exports.problemsSectionEntriesRequiredHtmlHeader = getText(
  'problems',
  problemsTextHeaders,
  problemsTextRow
);

export const proceduresSectionEntriesRequiredHtmlHeader = {
  content: [
    {
      content: [
        {
          content: [
            {
              content: {
                attributes: {
                  colspan: '5'
                },
                key: 'th',
                text: 'Procedures'
              },
              key: 'tr'
            },
            {
              content: [
                {
                  dataTransform: () => {
                    return [
                      'Service',
                      'Procedure code',
                      'Service date',
                      'Servicing provider',
                      'Phone#'
                    ];
                  },
                  key: 'th',
                  text: leafLevel.input
                }
              ],
              key: 'tr'
            }
          ],
          key: 'thead'
        },
        {
          content: [
            {
              content: [
                {
                  attributes: { ID: leafLevel.nextReferenceId('procedure') },
                  key: 'td',
                  text: leafLevel.deepInputProperty('procedure.name', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('procedure.code', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputDate('date_time.point', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('performer.0.organization.0.name.0', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty(
                    'performer.0.organization.0.phone.0.value.number',
                    nda
                  )
                }
              ],
              key: 'tr'
            }
          ],
          dataKey: 'procedures',
          key: 'tbody'
        }
      ],
      key: 'table'
    }
  ],
  existsWhen: condition.keyExists('procedures'),
  key: 'text'
};

export const resultsSectionEntriesRequiredHtmlHeader = {
  content: [
    {
      content: [
        {
          content: [
            {
              content: {
                attributes: {
                  colspan: '7'
                },
                key: 'th',
                text: 'Laboratory Results'
              },
              key: 'tr'
            },
            {
              content: [
                {
                  dataTransform: () => {
                    return ['Test', 'Result', 'Units', 'Ref low', 'Ref high', 'Date', 'Source'];
                  },
                  key: 'th',
                  text: leafLevel.input
                }
              ],
              key: 'tr'
            }
          ],
          key: 'thead'
        },
        {
          content: [
            {
              content: [
                {
                  attributes: {
                    colspan: '7'
                  },
                  key: 'td',
                  text: leafLevel.deepInputProperty('result_set.name', nda)
                }
              ],
              key: 'tr'
            },
            {
              content: [
                {
                  attributes: { ID: leafLevel.nextReferenceId('result') },
                  key: 'td',
                  text: leafLevel.deepInputProperty('result.name', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('value', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('unit', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('reference_range.low', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('reference_range.high', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputDate('date_time.point', nda)
                },
                {
                  key: 'td',
                  text: nda
                }
              ],
              dataKey: 'results',
              key: 'tr'
            }
          ],
          dataKey: 'results',
          key: 'tbody'
        }
      ],
      key: 'table'
    }
  ],
  existsWhen: condition.keyExists('results'),
  key: 'text'
};

export const encountersSectionEntriesOptionalHtmlHeader = {
  content: [
    {
      content: [
        {
          key: 'caption',
          text: 'Encounters'
        },
        {
          content: [
            {
              content: [
                {
                  dataTransform: () => {
                    return ['Type', 'Facility', 'Date of Service', 'Diagnosis/Complaint'];
                  },
                  key: 'th',
                  text: leafLevel.input
                }
              ],
              key: 'tr'
            }
          ],
          key: 'thead'
        },
        {
          content: [
            {
              content: [
                {
                  attributes: { ID: leafLevel.nextReferenceId('encounter') },
                  key: 'td',
                  text: leafLevel.deepInputProperty('encounter.name', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('locations.0.name', nda)
                },
                {
                  key: 'td',
                  text: (input) => {
                    let value = bbuo.deepValue(input, 'date_time.point');
                    if (value) {
                      value = bbud.modelToDate({
                        date: value.date,
                        precision: value.precision // workaround a bug in bbud.  Changes precision.
                      });
                      if (value) {
                        const vps = value.split('-');
                        if (vps.length === 3) {
                          return [vps[1], vps[2], vps[0]].join('/');
                        }
                      }
                    }
                    return nda;
                  }
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('findings.0.value.name', nda)
                }
              ],
              key: 'tr'
            }
          ],
          dataKey: 'encounters',
          key: 'tbody'
        }
      ],
      key: 'table'
    }
  ],
  existsWhen: condition.keyExists('encounters'),
  key: 'text'
};

const immunizationsTextHeaders = [
  'Vaccine',
  'Manufacturer',
  'Lot Number',
  'Immunization Date',
  'Status',
  'Patient Instructions'
];
const immunizationsTextRow = [
  leafLevel.deepInputProperty('product.product.name', nda),
  leafLevel.deepInputProperty('product.manufacturer', nda),
  leafLevel.deepInputProperty('product.lot_number', nda),
  leafLevel.deepInputDate('date_time.point', nda),
  leafLevel.deepInputProperty('status', nda),
  leafLevel.deepInputProperty('instructions.free_text', nda)
];

exports.immunizationsSectionEntriesOptionalHtmlHeader = getText(
  'immunizations',
  immunizationsTextHeaders,
  immunizationsTextRow
);

export const payersSectionHtmlHeader = {
  content: [
    {
      content: [
        {
          content: [
            {
              content: {
                attributes: {
                  colspan: '5'
                },
                key: 'th',
                text: 'Payers'
              },
              key: 'tr'
            },
            {
              content: [
                {
                  dataTransform: () => {
                    return [
                      'Payer Name',
                      'Group ID',
                      'Member ID',
                      'Eligibility Start Date',
                      'Eligibility End Date'
                    ];
                  },
                  key: 'th',
                  text: leafLevel.input
                }
              ],
              key: 'tr'
            }
          ],
          key: 'thead'
        },
        {
          content: [
            {
              content: [
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty(
                    'policy.insurance.performer.organization.0.name.0',
                    nda
                  )
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('policy.identifiers.0.extension', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty(
                    'participant.performer.identifiers.0.extension',
                    nda
                  )
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('participant.date_time.low.date', nda)
                },
                {
                  key: 'td',
                  text: leafLevel.deepInputProperty('participant.date_time.high.date', nda)
                }
              ],
              key: 'tr'
            }
          ],
          dataKey: 'payers',
          key: 'tbody'
        }
      ],
      key: 'table'
    }
  ],
  existsWhen: condition.keyExists('payers'),
  key: 'text'
};

const planOfCareTextHeaders = ['Planned Procedure', 'Planned Date'];
const planOfCareTextRow = [
  leafLevel.deepInputProperty('plan.name', nda),
  leafLevel.deepInputDate('date_time.point', nda)
];

exports.planOfCareSectionHtmlHeader = getText(
  'plan_of_care',
  planOfCareTextHeaders,
  planOfCareTextRow
);

const socialHistoryTextHeaders = ['Social History Element', 'Start Date', 'End Date'];
const socialHistoryTextRow = [
  (socialHistory) => `${socialHistory.code.name}: ${socialHistory.value}`,
  leafLevel.deepInputDate('date_time.low', '-'),
  leafLevel.deepInputDate('date_time.high', '-')
];

exports.socialHistorySectionHtmlHeader = getText(
  'social_history',
  socialHistoryTextHeaders,
  socialHistoryTextRow
);

const vitalSignsTextHeaders = ['Vitals', 'Value', 'Interpretation', 'Date'];
const vitalSignsTextRow = [
  leafLevel.deepInputProperty('vital.name', nda),
  (vitalsMeasurement) => `${vitalsMeasurement.value} ${vitalsMeasurement.unit}`,
  leafLevel.deepInputProperty('interpretation', nda),
  leafLevel.deepInputDate('date_time.point', nda)
];
exports.vitalSignsSectionEntriesOptionalHtmlHeader = getText(
  'vitals',
  vitalSignsTextHeaders,
  vitalSignsTextRow
);

exports.allergiesSectionEntriesRequiredHtmlHeaderNA = 'Not Available';
exports.medicationsSectionEntriesRequiredHtmlHeaderNA = 'Not Available';
exports.problemsSectionEntriesRequiredHtmlHeaderNA = 'Not Available';
exports.proceduresSectionEntriesRequiredHtmlHeaderNA = 'Not Available';
exports.resultsSectionEntriesRequiredHtmlHeaderNA = 'Not Available';
exports.encountersSectionEntriesOptionalHtmlHeaderNA = 'Not Available';
exports.immunizationsSectionEntriesOptionalHtmlHeaderNA = 'Not Available';
exports.payersSectionHtmlHeaderNA = 'Not Available';
exports.planOfCareSectionHtmlHeaderNA = 'Not Available';
exports.socialHistorySectionHtmlHeaderNA = 'Not Available';
exports.vitalSignsSectionEntriesOptionalHtmlHeaderNA = 'Not Available';

function getText(topArrayKey, headers, values) {
  const result = {
    content: [
      {
        attributes: {
          border: '1',
          width: '100%'
        },
        content: [
          {
            content: [
              {
                content: [],
                key: 'tr'
              }
            ],
            key: 'thead'
          },
          {
            content: [
              {
                content: [],
                dataKey: topArrayKey,
                key: 'tr'
              }
            ],
            key: 'tbody'
          }
        ],
        key: 'table'
      }
    ],
    existsWhen: condition.keyExists(topArrayKey),
    key: 'text'
  };
  const headerTarget = result.content[0].content[0].content[0].content;
  headers.forEach((header) => {
    const element = {
      key: 'th',
      text: header
    };
    headerTarget.push(element);
  });
  const valueTarget = result.content[0].content[1].content[0].content;
  values.forEach((value, valueIndex) => {
    let data;
    if (typeof value !== 'function') {
      data = leafLevel.deepInputProperty(value, '');
    } else {
      data = value;
    }

    const referenceName = headers[valueIndex].replace(/\s/g, '_').toLowerCase();

    const element = {
      attributes: { ID: leafLevel.nextReferenceId(referenceName) },
      key: 'td',
      text: data
    };
    valueTarget.push(element);
  });
  return result;
}
