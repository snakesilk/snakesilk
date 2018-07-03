const expect = require('expect.js');

const {createNode} = require('../index');

describe('createNode()', () => {
  it('returns node based on XML string', () => {
    const node = createNode('<root/>');
    expect(node.tagName).to.equal('root');
  });
});
