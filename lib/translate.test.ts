const translate = require('./translate');

test.each([
  ['year', '2012'],
  ['month', '201209'],
  ['day', '20120916'],
  ['hour', '2012091602'],
  ['minute', '201209160214+0000'],
  ['second', '20120916021442+0000'],
  ['subsecond', '20120916021442.123+0000']
])('converts ISO 8601 to HL7 %s', (precision, expected) => {
  const isoDatetime = '2012-09-16T02:14:42.123Z';
  const input = {
    date: isoDatetime,
    precision
  };
  expect(translate.time(input)).toBe(expected);
});
