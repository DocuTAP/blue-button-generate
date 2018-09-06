import * as moment from 'moment';
import * as codeSystems from './code-system-maps/codeSystems';

export function codeFromName(oid) {
  return (input) => {
    const codeSystem = codeSystems.findFromOid(oid);
    const templateCode = codeSystem && codeSystem.displayNameCode(input);
    const systemInfo = codeSystem.systemId();
    return {
      code: templateCode,
      codeSystem: systemInfo.codeSystem,
      codeSystemName: systemInfo.codeSystemName,
      displayName: input
    };
  };
}

export function code(input) {
  return compact({
    code: input.code,
    codeSystem:
      input.codeSystem ||
      (input.codeSystemName && codeSystems.findFromName(input.codeSystemName).oid),
    codeSystemName: input.codeSystemName,
    displayName: input.name
  });
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
  return typeof input === 'object' && input.hasOwnProperty('date')
    ? moment.parseZone(input.date).format(precisionToFormat[input.precision])
    : 'Invalid date';
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

export function compact(inputObject: {}) {
  return Object.keys(inputObject).reduce((newObj, key) => {
    return inputObject[key] === undefined ? delete newObj[key] && newObj : newObj;
  }, inputObject);
}
