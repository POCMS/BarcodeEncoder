//var assert = require('assert');
var should = require('chai').should()
var BarcodeEncoder = require("../lib/BarcodeEncoder.js");

describe('decodeTable', function(){
    it('should have 107 elements', function(){
        Object.keys(BarcodeEncoder.decodeTable).should.have.length(107);
    });
})

describe('encodeTable', function(){
    it('should have 107 elements', function(){
        BarcodeEncoder.encodeTable.should.have.length(107);
    });
})


describe('encode()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.encode("").should.equal("")
    });
    var tests = [
        {case: '111',         expected: '#! #'},
        {case: '000',      expected: '#'},
        {case: '1010101010',   expected: '*! !$!!'},
        {case: '0101010101',      expected: '*%!!'},
        {case: '1110010101',   expected: '*! #!"!"!!'}
    ];

    describe('should encode correctly', function(){
        tests.forEach(function(test) {
            it(test.case + ' -> ' + test.expected, function() {
                BarcodeEncoder.encode(test.case).should.equal(test.expected);
            });
        });
    });
    it('should remove trailing empty characters', function(){
        var padding = "";
        for(var i=0;i<10;i++){
            BarcodeEncoder.encode("01"+padding).should.equal(BarcodeEncoder.encodeTable[2+padding.length]+"!!!")
            padding += "0";
        }
    });
})

describe('decode()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.decode("").should.equal("")
    });

    var tests = [
        {case: '$',         expected: '0000'},
        {case: '$$ !',      expected: '1111'},
        {case: '&! !"!!',   expected: '101010'},
        {case: '&! #',      expected: '111000'},
        {case: ',!!!!"#!!!',expected: '010011101000'},
        {case: ',!!"!"$',   expected: '011001111000'}
    ];

    tests.forEach(function(test) {
        it('should decode ' + test.case, function() {
            BarcodeEncoder.decode(test.case).should.equal(test.expected);
        });
    });
})


describe('decode(encode())', function(){
    var tests = ['111', '000', '110', '100', '101', '010', '001', '011'];
    tests.forEach(function(test){
        it('should return '+test, function(){
            BarcodeEncoder.decode(BarcodeEncoder.encode(test)).should.equal(test);
        });
    });
})

describe('encode(decode())', function(){
    var tests = ['#! #', '#', '#! "', '#! !', '#! !!!!', '#!!!', '#!"!', '#!!"'];
    tests.forEach(function(test){
        it('should return '+test, function(){
            BarcodeEncoder.encode(BarcodeEncoder.decode(test)).should.equal(test);
        });
    });

    var tests2 = [
        {case: ')!! $!!',          expected: ')!"!#!!'}
    ];
    tests2.forEach(function(test){
        it('should find normal form for '+test.case, function(){
            BarcodeEncoder.encode(BarcodeEncoder.decode(test.case)).should.equal(test.expected);
        });
    });

})

describe('count()', function(){
    var tests = [
        {case: '0000',          expected: 0},
        {case: '1111',          expected: 4},
        {case: '101010',        expected: 3},
        {case: '111000',        expected: 3},
        {case: '101100010111',  expected: 7},
        {case: '011001111000',  expected: 6}
    ];

    tests.forEach(function(test) {
        it('correctly counts ' + test.case + ' ('+BarcodeEncoder.encode(test.case)+')', function() {
            BarcodeEncoder.count(BarcodeEncoder.encode(test.case)).should.equal(test.expected);
        });
    });
})

describe('length()', function(){
    var tests = [
        {case: '0000',          expected: 4},
        {case: '1111',          expected: 4},
        {case: '101010',        expected: 6},
        {case: '111000',        expected: 6},
        {case: '101100010111',  expected: 12},
        {case: '011001111000',  expected: 12}
    ];

    tests.forEach(function(test) {
        it('correctly returns length of ' + test.case + ' ('+BarcodeEncoder.encode(test.case)+')', function() {
            BarcodeEncoder.length(BarcodeEncoder.encode(test.case)).should.equal(test.expected);
        });
    });
})

describe('generate()', function(){
    var tests = [
        {case: '$',         expected: 'Ì$%Î'},
        {case: '$$ !',      expected: 'Ì$$ !1Î'},
        {case: '&! !"!!',   expected: 'Ì&! !"!!DÎ'},
        {case: '&! #',      expected: 'Ì&! #5Î'},
        {case: ',!!!!"#!!!',expected: 'Ì,!!!!"#!!!wÎ'},
        {case: ',!!"!"$',   expected: 'Ì,!!"!"$gÎ'}
    ];

    tests.forEach(function(test) {
        it('should return barcode string for ' + test.case, function() {
            BarcodeEncoder.generate(test.case).should.equal(test.expected);
        });
    });
})
