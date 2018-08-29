'use strict';

import * as condition from './condition';
import * as contentModifier from './contentModifier';
import * as fieldLevel from './fieldLevel';
import * as headerLevel from './headerLevel';
import * as leafLevel from './leafLevel';
import * as sectionLevel from './sectionLevel';

const required = contentModifier.required;
const dataKey = contentModifier.dataKey;

export function ccd(htmlRenderer) {
  const ccdTemplate = {
    attributes: {
      xmlns: 'urn:hl7-org:v3',
      'xmlns:cda': 'urn:hl7-org:v3',
      'xmlns:sdtc': 'urn:hl7-org:sdtc',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    },
    content: [
      {
        attributes: {
          code: 'US'
        },
        key: 'realmCode'
      },
      {
        attributes: {
          extension: 'POCD_HD000040',
          root: '2.16.840.1.113883.1.3'
        },
        key: 'typeId'
      },
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.1.1'),
      fieldLevel.templateId('2.16.840.1.113883.10.20.22.1.2'),
      [fieldLevel.id, dataKey('meta.identifiers')],
      {
        attributes: {
          code: '34133-9',
          codeSystem: '2.16.840.1.113883.6.1',
          codeSystemName: 'LOINC',
          displayName: 'Summarization of Episode Note'
        },
        key: 'code'
      },
      {
        dataKey: 'meta.ccda_header',
        key: 'title',
        text: leafLevel.inputProperty('title')
      },
      [fieldLevel.effectiveTimeNow, required],
      {
        attributes: leafLevel.codeFromName('2.16.840.1.113883.5.25'),
        dataKey: 'meta.confidentiality',
        key: 'confidentialityCode'
      },
      {
        attributes: {
          code: 'en-US'
        },
        key: 'languageCode'
      },
      {
        attributes: {
          extension: leafLevel.inputProperty('extension'),
          root: leafLevel.inputProperty('identifier')
        },
        dataKey: 'meta.set_id',
        existsWhen: condition.keyExists('identifier'),
        key: 'setId'
      },
      {
        attributes: {
          value: leafLevel.inputProperty('version')
        },
        dataKey: 'meta.set_id',
        existsWhen: condition.keyExists('identifier'),
        key: 'versionNumber'
      },
      headerLevel.recordTarget,
      headerLevel.headerAuthor,
      headerLevel.headerInformant,
      headerLevel.headerCustodian,
      headerLevel.providers,
      {
        content: {
          content: [
            [
              sectionLevel.allergiesSectionEntriesRequired(
                htmlRenderer.allergiesSectionEntriesRequiredHtmlHeader,
                htmlRenderer.allergiesSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.medicationsSectionEntriesRequired(
                htmlRenderer.medicationsSectionEntriesRequiredHtmlHeader,
                htmlRenderer.medicationsSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.problemsSectionEntriesRequired(
                htmlRenderer.problemsSectionEntriesRequiredHtmlHeader,
                htmlRenderer.problemsSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.proceduresSectionEntriesRequired(
                htmlRenderer.proceduresSectionEntriesRequiredHtmlHeader,
                htmlRenderer.proceduresSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            [
              sectionLevel.resultsSectionEntriesRequired(
                htmlRenderer.resultsSectionEntriesRequiredHtmlHeader,
                htmlRenderer.resultsSectionEntriesRequiredHtmlHeaderNA
              ),
              required
            ],
            sectionLevel.encountersSectionEntriesOptional(
              htmlRenderer.encountersSectionEntriesOptionalHtmlHeader,
              htmlRenderer.encountersSectionEntriesOptionalHtmlHeaderNA
            ),
            sectionLevel.immunizationsSectionEntriesOptional(
              htmlRenderer.immunizationsSectionEntriesOptionalHtmlHeader,
              htmlRenderer.immunizationsSectionEntriesOptionalHtmlHeaderNA
            ),
            sectionLevel.payersSection(
              htmlRenderer.payersSectionHtmlHeader,
              htmlRenderer.payersSectionHtmlHeaderNA
            ),
            sectionLevel.planOfCareSection(
              htmlRenderer.planOfCareSectionHtmlHeader,
              htmlRenderer.planOfCareSectionHtmlHeaderNA
            ),
            sectionLevel.socialHistorySection(
              htmlRenderer.socialHistorySectionHtmlHeader,
              htmlRenderer.socialHistorySectionHtmlHeaderNA
            ),
            sectionLevel.vitalSignsSectionEntriesOptional(
              htmlRenderer.vitalSignsSectionEntriesOptionalHtmlHeader,
              htmlRenderer.vitalSignsSectionEntriesOptionalHtmlHeaderNA
            )
          ],
          key: 'structuredBody',
          notImplemented: [
            'advanceDirectivesSectionEntriesOptional',
            'familyHistorySection',
            'functionalStatusSection',
            'medicalEquipmentSection'
          ]
        },
        dataKey: 'data',
        key: 'component'
      }
    ],
    key: 'ClinicalDocument'
  };
  return ccdTemplate;
}
