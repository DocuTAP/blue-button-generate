import CodeSystem from './codeSystem';
import { oids } from './oids';

export function findFromOid(oid) {
  return oids.hasOwnProperty(oid) ? new CodeSystem(oid) : undefined;
}

export function findFromName(name) {
  const oid = Object.keys(oids).find((key) => oids[key].name === name);
  return findFromOid(oid);
}
