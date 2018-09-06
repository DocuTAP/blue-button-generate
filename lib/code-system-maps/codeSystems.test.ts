import CodeSystem from './codeSystem';
import * as codeSystems from './codeSystems';
jest.mock('./codeSystem');
jest.mock('./oids', () => ({
  oids: {
    '2.16.840.1.113883.5.1': {
      codes: {
        F: 'Female',
        M: 'Male',
        UN: 'Undifferentiated'
      },
      name: 'HL7 AdministrativeGender'
    }
  }
}));

beforeEach(() => {
  (CodeSystem as jest.Mock<CodeSystem>).mockClear();
});

describe('find codeSystems by OID', () => {
  it('will return a CodeSystem when finding by OID', () => {
    expect(codeSystems.findFromOid('2.16.840.1.113883.5.1')).toBeInstanceOf(CodeSystem);
    expect(CodeSystem).toHaveBeenCalled();
  });

  it('will be falsy when OID is not found', () => {
    expect(codeSystems.findFromOid('not an oid')).toBeFalsy();
    expect(CodeSystem).not.toHaveBeenCalled();
  });
});

describe('find codeSystems by name', () => {
  test('will return a CodeSystem when finding by name', () => {
    expect(codeSystems.findFromName('HL7 AdministrativeGender')).toBeInstanceOf(CodeSystem);
    expect(CodeSystem).toHaveBeenCalled();
  });

  test('will be falsy when name is not found', () => {
    expect(codeSystems.findFromName('not a name')).toBeFalsy();
    expect(CodeSystem).not.toHaveBeenCalled();
  });
});
