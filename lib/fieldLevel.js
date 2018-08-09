'use strict';

var bbm = require('blue-button-meta');
var uuid = require('uuid');

var condition = require('./condition');
var leafLevel = require('./leafLevel');
var translate = require('./translate');
var contentModifier = require('./contentModifier');

var templateCodes = bbm.CCDA.sections_entries_codes.codes;

var key = contentModifier.key;
var required = contentModifier.required;

var moment = require('moment');

exports.templateId = function(id) {
  return {
    key: 'templateId',
    attributes: {
      root: id
    }
  };
};

exports.templateCode = function(name) {
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
};

exports.templateTitle = function(name) {
  var raw = templateCodes[name];
  var result = {
    key: 'title',
    text: raw.name
  };
  return result;
};

var id = (exports.id = {
  key: 'id',
  attributes: {
    root: leafLevel.inputProperty('identifier'),
    extension: leafLevel.inputProperty('extension')
  },
  dataKey: 'identifiers',
  existsWhen: condition.keyExists('identifier'),
  required: true
});

exports.uniqueId = {
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

exports.statusCodeCompleted = {
  key: 'statusCode',
  attributes: {
    code: 'completed'
  }
};

exports.statusCode = {
  key: 'statusCode',
  attributes: {
    code: leafLevel.inputProperty('status')
  }
};

exports.statusCodeActive = {
  key: 'statusCode',
  attributes: {
    code: 'active'
  }
};

exports.statusCodeNew = {
  key: 'statusCode',
  attributes: {
    code: 'new'
  }
};

var effectiveTimeNow = (exports.effectiveTimeNow = {
  key: 'effectiveTime',
  attributes: {
    value: moment().format('YYYYMMDDHHMMSSZZ')
  }
});

var timeNow = (exports.timeNow = {
  key: 'time',
  attributes: {
    value: moment().format('YYYYMMDDHHMMSSZZ')
  }
});

var effectiveTime = (exports.effectiveTime = {
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
});

exports.text = function(referenceMethod) {
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
};

exports.nullFlavor = function(name) {
  return {
    key: name,
    attributes: {
      nullFlavor: 'UNK'
    }
  };
};

var usRealmAddress = (exports.usRealmAddress = {
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
});

var usRealmName = (exports.usRealmName = {
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
});

var telecom = (exports.telecom = {
  key: 'telecom',
  attributes: {
    value: leafLevel.inputProperty('value'),
    use: leafLevel.inputProperty('use')
  },
  dataTransform: translate.telecom
});

var representedOrganization = (exports.representedOrganization = {
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
});

var assignedEntity = (exports.assignedEntity = {
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
});

exports.author = {
  key: 'author',
  content: [
    [effectiveTime, required, key('time')],
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

exports.performer = {
  key: 'performer',
  content: [[assignedEntity, required]],
  dataKey: 'performer'
};
