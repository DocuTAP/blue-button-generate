import { clinicalStatements } from './clinicalStatements';
import { sections } from './sections';
import { sectionEntries } from './sectionEntries';
import { templates } from './templates';

export const ccda = {
  clinicalStatements,
  document: {
    name: 'CCDA',
    templateId: '2.16.840.1.113883.10.20.22.1.1'
  },
  sections,
  sectionEntries,
  templates
};
