'use strict';

var chai = require('chai');

var translate = require('../../lib/translate');

var expect = chai.expect;

describe('time generation', function() {
  const testDate = '2012-09-16T02:14:42.123Z';
  var testCases = [
    {
      hl7: '2012',
      precision: 'year'
    },
    {
      hl7: '201209',
      precision: 'month'
    },
    {
      hl7: '20120916',
      precision: 'day'
    },
    {
      hl7: '2012091602',
      precision: 'hour'
    },
    {
      hl7: '201209160214+0000',
      precision: 'minute'
    },
    {
      hl7: '20120916021442+0000',
      precision: 'second'
    },
    {
      hl7: '20120916021442.123+0000',
      precision: 'subsecond'
    }
  ];

  testCases.forEach(function(testCase) {
    var description = testDate + ' (' + testCase.precision + ')';
    it(description, function() {
      var input = {
        date: testDate,
        precision: testCase.precision
      };
      var hl7 = translate.time(input);
      expect(hl7).to.equal(testCase.hl7);
    });
  });
});
