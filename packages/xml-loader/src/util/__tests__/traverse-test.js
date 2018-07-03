const expect = require('expect.js');
const {createNode} = require('@snakesilk/testing/xml');

const {children, ensure, find} = require('../traverse');

describe('XML Traverse Utils', () => {
  describe('children()', () => {
    it('returns matching immediate children', () => {
      const node = createNode(`<scope>
        <child/>
        <child/>
        <non-child/>
        <out-of-scope>
          <child/>
          <child/>
        </out-of-scope>
      </scope>`)
      const matches = children(node, 'child');
      expect(matches.length).to.be(2);
      expect(matches[0]).to.be(node.children[0]);
      expect(matches[1]).to.be(node.children[1]);
    });
  });

  describe('ensure()', () => {
    it('throws a TypeError if node is not a node', () => {
      expect(() => {
        ensure('string', 'camera');
      }).to.throwError(error => {
        expect(error).to.be.a(TypeError);
        expect(error.message).to.be('string is not an XML node');
      });
    });

    it('throws a TypeError if node not matching selector', () => {
      const node = createNode(`<animations/>`);
      expect(() => {
        ensure(node, 'camera');
      }).to.throwError(error => {
        expect(error).to.be.a(TypeError);
        expect(error.message).to.be('<animations></animations> must match selector "camera"');
      });
    });

    it('does nothing when node matches selector', () => {
      const node = createNode(`<good-node/>`);
      expect(ensure(node, 'good-node')).to.be(undefined);
    });
  });

  describe('find()', () => {
    it('returns all matching children from the current scope', () => {
      const node = createNode(`<parent>
        <child/>
        <from-here>
          <parent>
            <child/>
          </parent>
          <further-down>
            <parent>
              <child/>
            </parent>
          </further-down>
        </from-here>
      </parent>`)
      const matches = find(node, 'parent > child');
      expect(matches.length).to.be(2);
      expect(matches[0]).to.be(node.children[1].children[0].children[0]);
      expect(matches[1]).to.be(node.children[1].children[1].children[0].children[0]);
    });
  });
});
