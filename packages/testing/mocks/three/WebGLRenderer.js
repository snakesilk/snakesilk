const sinon = require('sinon');
const THREE = require('three');
const DOMNode = require('../DOMNode');

function WebGLRendererMock()
{
  this.domElement = new DOMNode('canvas');
  this.render = sinon.spy();
  this.setSize = sinon.spy();
}

function mock()
{
  sinon.stub(THREE, 'WebGLRenderer', WebGLRendererMock);
}

function restore()
{
  THREE.WebGLRenderer.restore();
}

module.exports = {
  mock,
  restore,
  WebGLRenderer: WebGLRendererMock,
};
