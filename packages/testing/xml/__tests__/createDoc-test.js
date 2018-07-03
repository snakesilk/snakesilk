const expect = require('expect.js');

const {createDoc} = require('../index');

describe('createDoc()', () => {
  it('returns Document based on XML string', () => {
    const doc = createDoc('<root/>');
    expect(doc.querySelector('root').tagName).to.equal('root');
  });
});
