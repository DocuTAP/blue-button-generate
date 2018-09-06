import { oids } from './oids';

export default class CodeSystem {
  public oid: any;
  public codes: any;
  public name: string;
  public parentCodeSystem: any;

  constructor(oid) {
    this.oid = oid;
    this.codes = oids[oid].codes;
    this.name = oids[oid].name;
    this.parentCodeSystem = oids[oid].parentCodeSystem;
  }

  public codeDisplayName(code) {
    return this.codes && this.codes[code];
  }

  public displayNameCode(name) {
    return Object.keys(this.codes || {}).find((key) => this.codes[key] === name);
  }

  public systemId() {
    return this.parentCodeSystem
      ? {
          codeSystem: this.parentCodeSystem,
          codeSystemName: oids[this.parentCodeSystem].name
        }
      : {
          codeSystem: this.oid,
          codeSystemName: this.name
        };
  }
}
