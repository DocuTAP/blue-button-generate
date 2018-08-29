'use strict';

import * as bbm from 'blue-button-meta';
import * as moment from 'moment';

const css = bbm.code_systems;
export function codeFromName(OID) {
  return (input) => {
    const cs = css.find(OID);
    const templateCode = cs ? cs.displayNameCode(input) : undefined;
    const systemInfo = cs.systemId(OID);
    return {
      code: templateCode,
      codeSystem: systemInfo.codeSystem,
      codeSystemName: systemInfo.codeSystemName,
      displayName: input
    };
  };
}

export function code(input) {
  const result: any = {};
  if (input.code) {
    result.code = input.code;
  }

  if (input.name) {
    result.displayName = input.name;
  }

  const codeSystem =
    input.code_system || (input.code_system_name && css.findFromName(input.code_system_name));
  if (codeSystem) {
    result.codeSystem = codeSystem;
  }

  if (input.code_system_name) {
    result.codeSystemName = input.code_system_name;
  }

  return result;
}

const precisionToFormat = {
  day: 'YYYYMMDD',
  hour: 'YYYYMMDDHH',
  minute: 'YYYYMMDDHHmmZZ',
  month: 'YYYYMM',
  second: 'YYYYMMDDHHmmssZZ',
  subsecond: 'YYYYMMDDHHmmss.SSSZZ',
  year: 'YYYY'
};

export function time(input) {
  const m = moment.parseZone(input.date);
  const formatSpec = precisionToFormat[input.precision];
  const result = m.format(formatSpec);
  return result;
}

export function acronymize(inputString) {
  let ret = inputString.split(' ');
  let fL = ret[0].slice(0, 1);
  let lL = ret[1].slice(0, 1);
  fL = fL.toUpperCase();
  lL = lL.toUpperCase();
  ret = fL + lL;
  if (ret === 'PH') {
    ret = 'HP';
  }
  if (ret === 'HA') {
    ret = 'H';
  }
  return ret;
}

export function telecom(telecomInput) {
  const transformPhones = (input) => {
    const phones = input.phone;
    if (phones) {
      return phones.reduce((r, phone) => {
        if (phone && phone.number) {
          const attrs: any = {
            value: 'tel:' + phone.number
          };
          if (phone.type) {
            attrs.use = acronymize(phone.type);
          }
          r.push(attrs);
        }
        return r;
      }, []);
    } else {
      return [];
    }
  };

  const transformEmails = (input) => {
    const emails = input.email;
    if (emails) {
      return emails.reduce((r, email) => {
        if (email && email.address) {
          const attrs: any = {
            value: 'mailto:' + email.address
          };
          if (email.type) {
            attrs.use = acronymize(email.type);
          }
          r.push(attrs);
        }
        return r;
      }, []);
    } else {
      return [];
    }
  };

  const result = [].concat(transformPhones(telecomInput), transformEmails(telecomInput));
  return result.length === 0 ? undefined : result;
}

const nameSingle = (input) => {
  let given;
  if (input.first) {
    given = [input.first];
    if (input.middle && input.middle[0]) {
      given.push(input.middle[0]);
    }
  }
  return {
    family: input.last,
    given,
    prefix: input.prefix,
    suffix: input.suffix
  };
};

export function name(input) {
  if (Array.isArray(input)) {
    return input.map((e) => {
      return nameSingle(e);
    });
  } else {
    return nameSingle(input);
  }
}
