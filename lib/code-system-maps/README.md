# Code maps for common OIDs and code systems

## Usage

Various metadata is directly available

``` javascript
import * as CCDA from './ccda'

//CCDA Document OID
console.log(CCDA.document.templateId);

//list of CCDA Templates and their OIDs
console.log(CCDA.templates);

//list of CCDA Sections and their OIDs
console.log(CCDA.sections);

//list of CCDA Clinical Statements and their OIDs
console.log(CCDA.statements);

```

Code system oid to name and name to oid maps are available

``` javascript
import * as codeSystems from './codeSystems'

const csGender = codeSystems.findFromOid('2.16.840.1.113883.5.1');
console.log(csGender.name); // "HL7 AdministrativeGender"

const oid = codeSystems.findFromName("HL7 AdministrativeGender");
console.log(oid); // '2.16.840.1.113883.5.1'
```

For a subset of smaller code systems code to display name and display name to code methods are available

``` javascript
console.log(csGender.codeDisplayName('F'));      // 'Female'
console.log(csGender.displayNameCode('Female')); // 'F'
```

For ValueSets similar methods are available

``` javascript
const csPS = codeSystems.findFromOid('2.16.840.1.113883.3.88.12.3221.6.8');
console.log(csPS.name); // "Problem Severity"

console.log(csPS.codeDisplayName('255604002')); // 'Mild';
console.log(csPS.displayNameCode('Mild'));      // '255604002';
```

In addition the parent code system is available

``` javascript
const id = csPS.systemId();
console.log(id.codeSystem);     // '2.16.840.1.113883.6.96'
console.log(id.codeSystemName); // 'SNOMED CT'
```

## License

This portion of the [@docutap/blue-button-generate](https://github.com/DocuTAP/blue-button-generate) project is a derivative work from [amida-tech/blue-button-meta](https://github.com/amida-tech/blue-button-meta)

Licensed under [Apache 2.0](../../LICENSE)
