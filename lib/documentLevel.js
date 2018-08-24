'use strict';

var headerLevel = require('./headerLevel');
var fieldLevel = require('./fieldLevel');
var leafLevel = require('./leafLevel');
var sectionLevel = require('./sectionLevel');
var contentModifier = require('./contentModifier');
var condition = require('./condition');

var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

exports.ccd = function(html_renderer) {
  var ccd_template = {
    key: 'ClinicalDocument',
    attributes: {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      xmlns: 'urn:hl7-org:v3',
      'xmlns:cda': 'urn:hl7-org:v3',
      'xmlns:sdtc': 'urn:hl7-org:sdtc'
    },
    content: [
      {
        key: 'realmCode',
        attributes: {
          code: 'US'
        }
      },
      {
        key: 'typeId',
        attributes: {
          root: '2.16.840.1.113883.1.3',
          extension: 'POCD_HD000040'
        }
      },
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.1.1'),
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.1.2'),
      [fieldLevel.id, dataKey('meta.identifiers')],
      {
        key: 'code',
        attributes: {
          codeSystem: '2.16.840.1.113883.6.1',
          codeSystemName: 'LOINC',
          code: '34133-9',
          displayName: 'Summarization of Episode Note'
        }
      },
      {
        key: 'title',
        text: leafLevel.inputProperty('title'),
        dataKey: 'meta.ccda_header'
      },
      [fieldLevel.effectiveTimeNow, required],
      {
        key: 'confidentialityCode',
        attributes: leafLevel.codeFromName('2.16.840.1.113883.5.25'),
        dataKey: 'meta.confidentiality'
      },
      {
        key: 'languageCode',
        attributes: {
          code: 'en-US'
        }
      },
      {
        key: 'setId',
        attributes: {
          root: leafLevel.inputProperty('identifier'),
          extension: leafLevel.inputProperty('extension')
        },
        existsWhen: condition.keyExists('identifier'),
        dataKey: 'meta.set_id'
      },
      {
        key: 'versionNumber',
        attributes: {
          value: leafLevel.inputProperty('version')
        },
        dataKey: 'meta.set_id',
        existsWhen: condition.keyExists('identifier')
      },
      headerLevel.recordTarget,
      headerLevel.headerAuthor,
      headerLevel.headerInformant,
      headerLevel.headerCustodian,
      headerLevel.providers,
      {
        key: 'component',
        content: {
          key: 'structuredBody',
          content: [
            [
              sectionLevel.allergiesSectionEntriesRequired(
                html_renderer.allergiesSectionEntriesRequiredHtmlHeader,
                html_renderer.allergiesSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.medicationsSectionEntriesRequired(
                html_renderer.medicationsSectionEntriesRequiredHtmlHeader,
                html_renderer.medicationsSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.problemsSectionEntriesRequired(
                html_renderer.problemsSectionEntriesRequiredHtmlHeader,
                html_renderer.problemsSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.proceduresSectionEntriesRequired(
                html_renderer.proceduresSectionEntriesRequiredHtmlHeader,
                html_renderer.proceduresSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.resultsSectionEntriesRequired(
                html_renderer.resultsSectionEntriesRequiredHtmlHeader,
                html_renderer.resultsSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            sectionLevel.encountersSectionEntriesOptional(
              html_renderer.encountersSectionEntriesOptionalHtmlHeader,
              html_renderer.encountersSectionEntriesOptionalHtmlHeaderNA
            ),
            sectionLevel.immunizationsSectionEntriesOptional(
              html_renderer.immunizationsSectionEntriesOptionalHtmlHeader,
              html_renderer.immunizationsSectionEntriesOptionalHtmlHeaderNA
            ),
            sectionLevel.payersSection(
              html_renderer.payersSectionHtmlHeader,
              html_renderer.payersSectionHtmlHeaderNA
            ),
            sectionLevel.planOfCareSection(
              html_renderer.planOfCareSectionHtmlHeader,
              html_renderer.planOfCareSectionHtmlHeaderNA
            ),
            sectionLevel.socialHistorySection(
              html_renderer.socialHistorySectionHtmlHeader,
              html_renderer.socialHistorySectionHtmlHeaderNA
            ),
            sectionLevel.vitalSignsSectionEntriesOptional(
              html_renderer.vitalSignsSectionEntriesOptionalHtmlHeader,
              html_renderer.vitalSignsSectionEntriesOptionalHtmlHeaderNA
            )
          ],
          notImplemented: [
            'advanceDirectivesSectionEntriesOptional',
            'familyHistorySection',
            'functionalStatusSection',
            'medicalEquipmentSection'
          ]
        },
        dataKey: 'data'
      }
    ]
  };
  return ccd_template;
};
