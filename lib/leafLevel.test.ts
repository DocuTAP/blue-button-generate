import * as leafLevel from './leafLevel';
test.each([
  {
    expected: '20120916',
    inputValue: {
      supply: {
        date_time: {
          point: {
            date: '2012-09-16T02:14:42.123Z',
            precision: 'day'
          }
        }
      }
    },
    path: 'supply.date_time.point'
  },
  {
    defaultValue: 'No Data',
    expected: 'No Data',
    inputValue: {
      supply: {
        date_time: {
          point: {
            date: '',
            precision: 'day'
          }
        }
      }
    },
    path: 'supply.date_time.point'
  },
  {
    defaultValue: 'No Data',
    expected: 'No Data',
    inputValue: 'Not a date',
    path: 'supply.date_time.point'
  },
  {
    defaultValue: 'No Data Available',
    expected: 'No Data Available',
    inputValue: undefined,
    path: 'supply.date_time.point'
  }
])('converts ISO 8601 to HL7 value or sets to default', (testData) => {
  expect(leafLevel.deepInputDate(testData.path, testData.defaultValue)(testData.inputValue)).toBe(
    testData.expected
  );
});
