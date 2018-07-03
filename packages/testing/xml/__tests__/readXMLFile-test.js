const expect = require('expect.js');

const {readXMLFile} = require('../index');

describe('readXMLFile()', () => {
  it('returns document based on XML file', () => {
    const node = readXMLFile(__dirname + '/fixtures/test.xml');
    expect(node.querySelector('root').tagName).to.equal('root');
  });
});
