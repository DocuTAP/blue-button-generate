'use strict';

import * as bbm from 'blue-button-meta';
import * as uuid from 'uuid';

import * as condition from './condition';
import * as leafLevel from './leafLevel';
import * as translate from './translate';
import * as contentModifier from './contentModifier';

const templateCodes = bbm.CCDA.sections_entries_codes.codes;

const key = contentModifier.key;
const required = contentModifier.required;

import * as moment from 'moment'

export function templateId(id) {
  return {
    key: 'templateId',
    attributes: {
      root: id
    }
  };
}

export function templateCode(name) {
  var raw = templateCodes[name];
  var result = {
    key: 'code',
    attributes: {
      code: raw.code,
      displayName: raw.name,
      codeSystem: raw.code_system,
      codeSystemName: raw.code_system_name
    }
  };
  return result;
}

export function templateTitle(name) {
  var raw = templateCodes[name];
  var result = {
    key: 'title',
    text: raw.name
  };
  return result;
}

export const id = {
  key: 'id',
  attributes: {
    root: leafLevel.inputProperty('identifier'),
    extension: leafLevel.inputProperty('extension')
  },
  dataKey: 'identifiers',
  existsWhen: condition.keyExists('identifier'),
  required: true
};

export const uniqueId = {
  key: 'id',
  attributes: {
    root: function(input, context) {
      return context.rootId;
    },
    extension: function() {
      return uuid.v4();
    }
  },
  existsWhen: function(input, context) {
    return context.rootId;
  }
};

export const statusCodeCompleted = {
  key: 'statusCode',
  attributes: {
    code: 'completed'
  }
};

export const statusCode = {
  key: 'statusCode',
  attributes: {
    code: leafLevel.inputProperty('status')
  }
};

export const statusCodeActive = {
  key: 'statusCode',
  attributes: {
    code: 'active'
  }
};

export const statusCodeNew = {
  key: 'statusCode',
  attributes: {
    code: 'new'
  }
};

export const effectiveTimeNow = {
  key: 'effectiveTime',
  attributes: {
    value: moment().format('YYYYMMDDHHMMSSZZ')
  }
};

export const timeNow = {
  key: 'time',
  attributes: {
    value: moment().format('YYYYMMDDHHMMSSZZ')
  }
};

export const effectiveTime = {
  key: 'effectiveTime',
  attributes: {
    value: (input) =>
      condition.keyExists('point')(input) ? leafLevel.time(input.point) : undefined,
    'xsi:type': (input) =>
      condition.eitherKeyExists('low', 'high', 'center')(input) ? 'IVL_TS' : undefined
  },
  content: [
    {
      key: 'low',
      attributes: {
        value: leafLevel.time
      },
      dataKey: 'low'
    },
    {
      key: 'high',
      attributes: {
        value: leafLevel.time
      },
      dataKey: 'high'
    },
    {
      key: 'center',
      attributes: {
        value: leafLevel.time
      },
      dataKey: 'center'
    }
  ],
  dataKey: 'date_time',
  existsWhen: condition.eitherKeyExists('point', 'low', 'high', 'center')
};

export function text(referenceMethod) {
  return {
    key: 'text',
    text: leafLevel.inputProperty('free_text'),
    content: {
      key: 'reference',
      attributes: {
        value: referenceMethod
      }
    }
  };
}

export function nullFlavor(name) {
  return {
    key: name,
    attributes: {
      nullFlavor: 'UNK'
    }
  };
}

export const usRealmAddress = {
  key: 'addr',
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
      key: 'streetAddressLine',
      text: leafLevel.input,
      dataKey: 'street_lines'
    }
  ],
  dataKey: 'addresses'
};

export const usRealmName = {
  key: 'name',
  content: [
    {
      key: 'family',
      text: leafLevel.inputProperty('family')
    },
    {
      key: 'given',
      text: leafLevel.input,
      dataKey: 'given'
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
  dataTransform: translate.name
};

export const telecom = {
  key: 'telecom',
  attributes: {
    value: leafLevel.inputProperty('value'),
    use: leafLevel.inputProperty('use')
  },
  dataTransform: translate.telecom
};

export const representedOrganization = {
  key: 'representedOrganization',
  content: [
    id,
    {
      key: 'id',
      attributes: {
        extension: leafLevel.inputProperty('extension'),
        root: leafLevel.inputProperty('root')
      },
      dataKey: 'identity'
    },
    {
      key: 'name',
      text: leafLevel.input,
      dataKey: 'name'
    },
    telecom,
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
      existsWhen: condition.keyExists('value'),
      dataKey: 'phone'
    },
    usRealmAddress
  ],
  dataKey: 'organization'
};

export const assignedEntity = {
  key: 'assignedEntity',
  content: [
    id,
    {
      key: 'code',
      attributes: leafLevel.code,
      dataKey: 'code'
    },

    usRealmAddress,
    telecom,
    {
      key: 'assignedPerson',
      content: usRealmName,
      existsWhen: condition.keyExists('name')
    },
    representedOrganization
  ],
  existsWhen: condition.eitherKeyExists('address', 'identifiers', 'organization', 'name')
};

export const author = {
  key: 'author',
  content: [
    {
      key: 'time',
      attributes: { value: leafLevel.time },
      dataKey: 'date_time.point',
      required: true
    },
    {
      key: 'assignedAuthor',
      content: [
        id,
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
        {
          key: 'assignedPerson',
          content: usRealmName
        },
        representedOrganization
      ]
    }
  ],
  dataKey: 'author'
};

export const performer = {
  key: 'performer',
  content: [[assignedEntity, required]],
  dataKey: 'performer'
};
