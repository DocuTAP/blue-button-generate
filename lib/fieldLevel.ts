import * as bbm from 'blue-button-meta';
import * as uuid from 'uuid';
import * as condition from './condition';
import * as contentModifier from './contentModifier';
import * as leafLevel from './leafLevel';
import * as translate from './translate';

const templateCodes = bbm.CCDA.sections_entries_codes.codes;

const key = contentModifier.key;
const required = contentModifier.required;

import * as moment from 'moment';

export function templateId(templateOid) {
  return {
    attributes: {
      root: templateOid
    },
    key: 'templateId'
  };
}

export function templateCode(name) {
  const raw = templateCodes[name];
  const result = {
    attributes: {
      code: raw.code,
      codeSystem: raw.code_system,
      codeSystemName: raw.code_system_name,
      displayName: raw.name
    },
    key: 'code'
  };
  return result;
}

export function templateTitle(name) {
  const raw = templateCodes[name];
  const result = {
    key: 'title',
    text: raw.name
  };
  return result;
}

export const id = {
  attributes: {
    extension: leafLevel.inputProperty('extension'),
    root: leafLevel.inputProperty('identifier')
  },
  dataKey: 'identifiers',
  existsWhen: condition.keyExists('identifier'),
  key: 'id',
  required: true
};

export const uniqueId = {
  attributes: {
    extension: () => {
      return uuid.v4();
    },
    root: (input, context) => {
      return context.rootId;
    }
  },
  existsWhen: (input, context) => {
    return context.rootId;
  },
  key: 'id'
};

export const statusCodeCompleted = {
  attributes: {
    code: 'completed'
  },
  key: 'statusCode'
};

export const statusCode = {
  attributes: {
    code: leafLevel.inputProperty('status')
  },
  key: 'statusCode'
};

export const statusCodeActive = {
  attributes: {
    code: 'active'
  },
  key: 'statusCode'
};

export const statusCodeNew = {
  attributes: {
    code: 'new'
  },
  key: 'statusCode'
};

export const effectiveTimeNow = {
  attributes: {
    value: moment().format('YYYYMMDDHHMMSSZZ')
  },
  key: 'effectiveTime'
};

export const timeNow = {
  attributes: {
    value: moment().format('YYYYMMDDHHMMSSZZ')
  },
  key: 'time'
};

export const effectiveTime = {
  attributes: {
    value: (input) =>
      condition.keyExists('point')(input) ? leafLevel.time(input.point) : undefined,
    'xsi:type': (input) =>
      condition.eitherKeyExists('low', 'high', 'center')(input) ? 'IVL_TS' : undefined
  },
  content: [
    {
      attributes: {
        value: leafLevel.time
      },
      dataKey: 'low',
      key: 'low'
    },
    {
      attributes: {
        value: leafLevel.time
      },
      dataKey: 'high',
      key: 'high'
    },
    {
      attributes: {
        value: leafLevel.time
      },
      dataKey: 'center',
      key: 'center'
    }
  ],
  dataKey: 'date_time',
  existsWhen: condition.eitherKeyExists('point', 'low', 'high', 'center'),
  key: 'effectiveTime'
};

export function text(referenceMethod) {
  return {
    content: {
      attributes: {
        value: referenceMethod
      },
      key: 'reference'
    },
    key: 'text',
    text: leafLevel.inputProperty('free_text')
  };
}

export function nullFlavor(name) {
  return {
    attributes: {
      nullFlavor: 'UNK'
    },
    key: name
  };
}

export const usRealmAddress = {
  attributes: {
    use: leafLevel.codeOnlyFromName('2.16.840.1.113883.5.1119', 'use')
  },
  content: [
    {
      key: 'country',
      text: leafLevel.inputProperty('country')
    },
    {
      key: 'state',
      text: leafLevel.inputProperty('state')
    },
    {
      key: 'city',
      text: leafLevel.inputProperty('city')
    },
    {
      key: 'postalCode',
      text: leafLevel.inputProperty('zip')
    },
    {
      dataKey: 'street_lines',
      key: 'streetAddressLine',
      text: leafLevel.input
    }
  ],
  dataKey: 'addresses',
  key: 'addr'
};

export const usRealmName = {
  content: [
    {
      key: 'family',
      text: leafLevel.inputProperty('family')
    },
    {
      dataKey: 'given',
      key: 'given',
      text: leafLevel.input
    },
    {
      key: 'prefix',
      text: leafLevel.inputProperty('prefix')
    },
    {
      key: 'suffix',
      text: leafLevel.inputProperty('suffix')
    }
  ],
  dataKey: 'name',
  dataTransform: translate.name,
  key: 'name'
};

export const telecom = {
  attributes: {
    use: leafLevel.inputProperty('use'),
    value: leafLevel.inputProperty('value')
  },
  dataTransform: translate.telecom,
  key: 'telecom'
};

export const representedOrganization = {
  content: [
    id,
    {
      attributes: {
        extension: leafLevel.inputProperty('extension'),
        root: leafLevel.inputProperty('root')
      },
      dataKey: 'identity',
      key: 'id'
    },
    {
      dataKey: 'name',
      key: 'name',
      text: leafLevel.input
    },
    telecom,
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
      existsWhen: condition.keyExists('value'),
      key: 'telecom'
    },
    usRealmAddress
  ],
  dataKey: 'organization',
  key: 'representedOrganization'
};

export const assignedEntity = {
  content: [
    id,
    {
      attributes: leafLevel.code,
      dataKey: 'code',
      key: 'code'
    },

    usRealmAddress,
    telecom,
    {
      content: usRealmName,
      existsWhen: condition.keyExists('name'),
      key: 'assignedPerson'
    },
    representedOrganization
  ],
  existsWhen: condition.eitherKeyExists('address', 'identifiers', 'organization', 'name'),
  key: 'assignedEntity'
};

export const author = {
  content: [
    {
      attributes: { value: leafLevel.time },
      dataKey: 'date_time.point',
      key: 'time',
      required: true
    },
    {
      content: [
        id,
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
        {
          content: usRealmName,
          key: 'assignedPerson'
        },
        representedOrganization
      ],
      key: 'assignedAuthor'
    }
  ],
  dataKey: 'author',
  key: 'author'
};

export const performer = {
  content: [[assignedEntity, required]],
  dataKey: 'performer',
  key: 'performer'
};
