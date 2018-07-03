const expect = require('expect.js');
const sinon = require('sinon');
const fs = require('fs');
const {createNode} = require('@snakesilk/testing/xml');

const THREE = require('three');
const {Entity, World} = require('@snakesilk/engine');

const Parser = require('../Parser');

describe('Parser', function() {
  beforeEach(function() {
    global.Image = sinon.spy(function() {
      this.src = '';
      this.onload = undefined;
    });
  });

  afterEach(function() {
    delete global.Image;
  });

  context('#getAttr', function() {
    it('should return null if attribute does not exist', function() {
      const parser = new Parser();
      const node = createNode('<moot/>');
      expect(parser.getAttr(node, 'foo')).to.be(null);
    });

    it('should return string if attribute set', function() {
      const parser = new Parser();
      const node = createNode('<moot foo="bar"/>');
      expect(parser.getAttr(node, 'foo')).to.equal("bar");
    });

    it('should return null if attribute empty', function() {
      const parser = new Parser();
      const node = createNode('<moot foo=""/>');
      expect(parser.getAttr(node, 'foo')).to.equal(null);
    });
  });

  context('#getColor', function() {
    let node, parser;
    it('should parse an RGB color', function() {
      parser = new Parser();
      node = createNode('<node color=".13,.37,.54"/>');
      const color = parser.getColor(node);
      expect(color).to.eql({r: 0.13, g: 0.37, b: 0.54});
    });

    it('should default non-defined to 1', function() {
      node = createNode('<node color=".13,,.54"/>');
      const color = parser.getColor(node);
      expect(color).to.eql({r: 0.13, g: 1, b: 0.54});
    });

    it('should support custom attribute', function() {
      node = createNode('<node moot=".13,,.54"/>');
      const color = parser.getColor(node, 'moot');
      expect(color).to.eql({r: 0.13, g: 1, b: 0.54});
    });
  });

  context('#getColorHex', function() {
    let node, parser;

    it('should parse a hex-color', function() {
      parser = new Parser();
      node = createNode('<node color="#ff06a0"/>');
      const color = parser.getColorHex(node);
      expect(color).to.eql({x: 255, y: 6, z: 160});
    });

    it('should support custom attribute', function() {
      node = createNode('<node moot="#ff06a0"/>');
      const color = parser.getColorHex(node, 'moot');
      expect(color).to.eql({x: 255, y: 6, z: 160});
    });
  });

  context('#getRange', function() {
    let node, range, parser;

    it('should interpret modulus', function() {
      parser = new Parser();
      node = createNode('<node range="0-10/2" />');
      range = parser.getRange(node, 'range', 10);
      expect(range).to.eql([0, 2, 4, 6, 8, 10]);
      node = createNode('<node range="1-9/3" />');
      range = parser.getRange(node, 'range', 10);
      expect(range).to.eql([1, 4, 7]);
    });

    it('should honor ranges', function() {
      node = createNode('<node range="3-13" />');
      range = parser.getRange(node, 'range', 100);
      expect(range).to.eql([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });

    it('should honor wildcard', function() {
      node = createNode('<node range="*" />');
      range = parser.getRange(node, 'range', 19);
      expect(range).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    });

    it('should parse and merge multiple groups', function() {
      node = createNode('<node range="1-3,20-24,500-510/2,1013-1019" />');
      range = parser.getRange(node, 'range');
      expect(range).to.eql([1,2,3,20,21,22,23,24,500,502,504,506,508,510,1013,1014,1015,1016,1017,1018,1019]);
    });
  });

  context('#getVector2', function() {
    it('should return null if any attribute missing', function() {
      const parser = new Parser();
      let node;
      node = createNode('<moot/>');
      expect(parser.getVector2(node)).to.be(null);
      node = createNode('<moot x="" y=""/>');
      expect(parser.getVector2(node)).to.be(null);
      node = createNode('<moot x="12" y=""/>');
      expect(parser.getVector2(node)).to.be(null);
      node = createNode('<moot x="" y="13"/>');
      expect(parser.getVector2(node)).to.be(null);
    });

    it('should default parse x and y attributes', function() {
      const parser = new Parser();
      const node = createNode('<moot x="13" y="17" />');
      expect(parser.getVector2(node)).to.eql({x: 13, y: 17});
    });

    it('should allow attribute key substitution', function() {
      const parser = new Parser();
      let node;
      node = createNode('<moot w="10" h="12"/>');
      expect(parser.getVector2(node, 'w', 'h')).to.eql({x: 10, y: 12});
    });
  });

  context('#getVector3', function() {
    it('should return null if x or y missing', function() {
      const parser = new Parser();
      let node;
      node = createNode('<moot/>');
      expect(parser.getVector3(node)).to.be(null);
      node = createNode('<moot x="" y="" z=""/>');
      expect(parser.getVector3(node)).to.be(null);
      node = createNode('<moot x="12" y="" />');
      expect(parser.getVector3(node)).to.be(null);
      node = createNode('<moot x="" y="13"/>');
      expect(parser.getVector3(node)).to.be(null);
      node = createNode('<moot x="" y="13"/>');
      expect(parser.getVector3(node)).to.be(null);
    });

    it('should default parse x, y, and z attributes', function() {
      const parser = new Parser();
      const node = createNode('<moot x="13" y="17" z="11" />');
      expect(parser.getVector3(node)).to.eql({x: 13, y: 17, z: 11});
    });

    it('should default z to 0 if not available', function() {
      const parser = new Parser();
      const node = createNode('<moot x="13" y="17"/>');
      expect(parser.getVector3(node)).to.eql({x: 13, y: 17, z: 0});
    });

    it('should allow attribute key substitution', function() {
      const parser = new Parser();
      let node;
      node = createNode('<moot w="10" h="12" r="5"/>');
      expect(parser.getVector3(node, 'w', 'h', 'r')).to.eql({x: 10, y: 12, z: 5});
    });

    it('should parse shorthand version if one attribute key supplied', function() {
      const parser = new Parser();
      let node;
      node = createNode('<moot to="1.13,1.19,1.23"/>');
      expect(parser.getVector3(node, 'to')).to.eql({x: 1.13, y: 1.19, z: 1.23});
    });

    context('when parsing shorthand version', function() {
      it('should set unspecified values to undefined', function() {
        const parser = new Parser();
        let node;
        node = createNode('<moot to=",1.19,"/>');
        expect(parser.getVector3(node, 'to')).to.eql({x: undefined, y: 1.19, z: undefined});
        node = createNode('<moot to="1.13,,"/>');
        expect(parser.getVector3(node, 'to')).to.eql({x: 1.13, y: undefined, z: undefined});
        node = createNode('<moot to=",,1.14"/>');
        expect(parser.getVector3(node, 'to')).to.eql({x: undefined, y: undefined, z: 1.14});
      });

      it('should not misinterpret 0 as undefined', function() {
        const parser = new Parser();
        let node;
        node = createNode('<moot to="0,1,"/>');
        expect(parser.getVector3(node, 'to')).to.eql({x: 0, y: 1, z: undefined});
      });
    });
  });
});
