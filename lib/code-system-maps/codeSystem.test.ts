import CodeSystem from './codeSystem';
jest.mock('./oids', () => ({
  oids: {
    '2.16.840.1.113883.3.88.12.3221.6.8': {
      codes: {
        '24484000': 'Severe',
        '255604002': 'Mild',
        '371923003': 'Mild to moderate',
        '371924009': 'Moderate to severe',
        '399166001': 'Fatal',
        '6736007': 'Moderate'
      },
      name: 'Problem Severity',
      parentCodeSystem: '2.16.840.1.113883.6.96'
    },
    '2.16.840.1.113883.3.88.12.3221.8.9': {
      name: 'Body Site Value Set'
    },
    '2.16.840.1.113883.6.96': {
      codes: {
        '392521001': 'Prior History',
        '421139008': 'On Hold',
        '55561003': 'Active',
        '73425007': 'No Longer Active'
      },
      name: 'SNOMED CT'
    }
  }
}));

describe('CodeSystem object', () => {
  const codeSystem = new CodeSystem('2.16.840.1.113883.6.96');

  it('sets code system variables on new instance', () => {
    expect(codeSystem).toBeTruthy();
    expect(codeSystem.oid).toBe('2.16.840.1.113883.6.96');
    expect(codeSystem.name).toBe('SNOMED CT');
  });

  it('returns undefined for codeDisplayName when code not defined in code system', () => {
    expect(codeSystem.codeDisplayName('123456')).toBeUndefined();
  });

  it('returns undefined for displayNameCode when displayName not defined in code system', () => {
    expect(codeSystem.displayNameCode('Display Name')).toBeUndefined();
  });
});

describe('when then code system contains codes', () => {
  const codeSystem = new CodeSystem('2.16.840.1.113883.6.96');

  it('has codes variable', () => {
    expect(codeSystem).toBeTruthy();
    expect(codeSystem.codes).toEqual({
      '392521001': 'Prior History',
      '421139008': 'On Hold',
      '55561003': 'Active',
      '73425007': 'No Longer Active'
    });
  });

  it('returns the displayName for a code', () => {
    expect(codeSystem.codeDisplayName('55561003')).toBe('Active');
  });

  it('returns the code for a displayName', () => {
    expect(codeSystem.displayNameCode('No Longer Active')).toBe('73425007');
  });
});

describe('when the code system has a parent code system', () => {
  const codeSystem = new CodeSystem('2.16.840.1.113883.3.88.12.3221.6.8');

  it('has parentCodeSystem variable', () => {
    expect(codeSystem).toBeTruthy();
    expect(codeSystem.parentCodeSystem).toBe('2.16.840.1.113883.6.96');
  });

  it('returns the parent code system for the systemId', () => {
    expect(codeSystem.systemId()).toEqual({
      codeSystem: '2.16.840.1.113883.6.96',
      codeSystemName: 'SNOMED CT'
    });
  });
});

describe('when the code system does not have a parent code system', () => {
  const codeSystem = new CodeSystem('2.16.840.1.113883.3.88.12.3221.8.9');

  it('returns the code system itself for the systemId', () => {
    expect(codeSystem.systemId()).toEqual({
      codeSystem: '2.16.840.1.113883.3.88.12.3221.8.9',
      codeSystemName: 'Body Site Value Set'
    });
  });
});
