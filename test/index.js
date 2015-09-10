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
        {case: '111',           expected: '%#\''},
        {case: '000',           expected: '$#'},
        {case: '1010101010',    expected: '%**J'},
        {case: '0101010101',    expected: '%*%5'},
        {case: '1110010101',    expected: '%*.5'},
        {case: '0101010101',    expected: '%*%5'}
    ];

    describe('should encode correctly', function(){
        tests.forEach(function(test) {
            it(test.case + ' -> ' + test.expected, function() {
                BarcodeEncoder.encode(test.case).should.equal(test.expected);
            });
        });
    });
})

describe('encodeRCE()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.encodeRCE("").should.equal("")
    });

    it('should remove trailing empty characters', function(){
        var padding = "";
        for(var i=0;i<62;i++){
            BarcodeEncoder.encodeRCE("01"+padding).should.equal("$"+BarcodeEncoder.encodeTable[2+padding.length]+"!!!")
            padding += "0";
        }
    });
})

describe('encodeASCII()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.encodeASCII("").should.equal("")
    });
})

describe('decode()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.decode("").should.equal("")
    });

    var tests = [
        {case: '$$',                        expected: '0000'},
        {case: '%$/',                       expected: '1111'},
        {case: '%&J',                       expected: '101010'},
        {case: '%&X',                       expected: '111000'},
        {case: '%,3H',                      expected: '010011101000'},
        {case: '%,9X',                      expected: '011001111000'},
        {case: '(!X4##',                    expected: '000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111'},
        {case: ')!Q4KJJEJIJJJJK5NF5:F5',    expected: '10100101011101010101010100101101010101001101010101010101010101010101011010101101110100110010101011010100110010101'}
    ];

    tests.forEach(function(test) {
        it('should decode  ' + test.case, function() {
            BarcodeEncoder.decode(test.case).should.equal(test.expected);
        });
    });
})

describe('decodeRCE()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.decode("").should.equal("")
    });

    var tests = [
        {case: '$$',            expected: '0000'},
        {case: '$$! $',         expected: '1111'},
        {case: '$&! !"!!',      expected: '101010'},
        {case: '$&! #',         expected: '111000'},
        {case: '$,!!!!"#!!!',   expected: '010011101000'},
        {case: '$,!!"!"$',      expected: '011001111000'},
        {case: "(!X4##",        expected: '000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111'},
        {case: '(!Q! !!!!!"!!!!!!#&!!!"!!!"$!!!""-!!!!""!!!!"!!#!!!!""!"!"!!!!""!!!""!"!"!!',   expected: '10100101011101010101010100101101010101001101010101010101010101010101011010101101110100110010101011010100110010101'}
    ];

    tests.forEach(function(test) {
        it('should decode  ' + test.case, function() {
            BarcodeEncoder.decodeRCE(test.case).should.equal(test.expected);
        });
    });
})

describe('decodeASCII()', function(){
    it('should return an empty string on empty string', function(){
        BarcodeEncoder.decode("").should.equal("")
    });

    var tests = [
        {case: '%$',                        expected: '0000'},
        {case: '%$/',                       expected: '1111'},
        {case: '%&J',                       expected: '101010'},
        {case: '%&X',                       expected: '111000'},
        {case: '%,3H',                      expected: '010011101000'},
        {case: '%,9X',                      expected: '011001111000'},
        {case: ")!X''''''''''''''''''''",   expected: '000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111000111'},
        {case: ')!Q4KJJEJIJJJJK5NF5:F5',    expected: '10100101011101010101010100101101010101001101010101010101010101010101011010101101110100110010101011010100110010101'}
    ];

    tests.forEach(function(test) {
        it('should decode  ' + test.case, function() {
            BarcodeEncoder.decodeASCII(test.case).should.equal(test.expected);
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
    var tests = ['%#\'', '$#', '%#&', '%#$', '%#%', '%#"', '%#!', '%##'];
    tests.forEach(function(test){
        it('should return '+test, function(){
            BarcodeEncoder.encode(BarcodeEncoder.decode(test)).should.equal(test);
        });
    });
})

describe('encodeRCA(decodeRCA())', function(){
    var tests = ['%#\'', '$#', '%#&', '%#$', '%#%', '%#"', '%#!', '%##'];
    tests.forEach(function(test){
        it('should return '+test, function(){
            BarcodeEncoder.encode(BarcodeEncoder.decode(test)).should.equal(test);
        });
    });

    var tests2 = [
        {case: '$)!! $!!',          expected: '$)!"!#!!'}
    ];
    tests2.forEach(function(test){
        it('should find normal form for '+test.case, function(){
            BarcodeEncoder.encodeRCE(BarcodeEncoder.decodeRCE(test.case)).should.equal(test.expected);
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

describe('Long input string', function(){
    var test = "0011110";
    for(var i=0; i < 5; i++){
        test += test;
    }

    it('should decode correctly for RCE', function() {
        BarcodeEncoder.decodeRCE(BarcodeEncoder.encodeRCE(test)).should.equal(test);
    });

    it('should decode correctly for ASCII', function() {
        BarcodeEncoder.decodeASCII(BarcodeEncoder.encodeASCII(test)).should.equal(test);
    });

    it('should decode correctly for automatic choice', function() {
        BarcodeEncoder.decode(BarcodeEncoder.encode(test)).should.equal(test);
    });
})
