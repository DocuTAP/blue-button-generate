'use strict';

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:     A bug fix' },
    { value: 'WIP [skip ci]', name: 'WIP:     Work in progress, skip ci' },
    { value: 'chore', name: 'chore:     Changes to the build process or auxiliary tools' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'style', name: 'style:     Changes that do not affect the meaning of the code' },
    {
      value: 'refactor',
      name: 'refactor:     A code change that neither fixes a bug nor adds a feature'
    },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests' }
  ],
  messages: {
    type: "Select the type of change that you're committing:",
    scope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:',
    body: '[OPTIONAL] Provide a LONGER description of the change. Use "|" to break new line:',
    breaking: '[OPTIONAL] List any BREAKING CHANGES:',
    footer: 'Jira Card related to this change. E.g.: ETL-31, FIRE-3:'
  },
  footerPrefix: 'Jira:'
};
