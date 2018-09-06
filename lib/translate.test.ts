import * as translate from './translate';

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

test.each([{ date: '', precision: 'day' }, 'Not a date'])(
  'returns "Invalid date" when input is malformed',
  (input) => {
    expect(translate.time(input)).toBe('Invalid date');
  }
);

test('compact will remove undefined values from an object', () => {
  const mockObject = { a: 1, b: undefined, c: 2, d: false };
  expect(translate.compact(mockObject)).toEqual({ a: 1, c: 2, d: false });
});
