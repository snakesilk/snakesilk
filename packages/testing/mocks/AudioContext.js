const sinon = require('sinon');

function AudioContextMock()
{
  this.createBufferSource = function() {
    return new BufferSourceMock();
  };
  this.resume = sinon.spy();
  this.suspend = sinon.spy();
}

function BufferSourceMock()
{
  this.addEventListener = sinon.spy();
  this.connect = sinon.spy();
  this.buffer = null;
  this.playbackRate = {
    value: 1,
  };
  this.start = sinon.spy();
  this.stop = sinon.spy();
}

function mock()
{
  global.AudioContext = AudioContextMock;
}

function restore()
{
  delete global.AudioContext;
}

module.exports = {
  mock,
  restore,
  AudioContext: AudioContextMock,
  BufferSource: BufferSourceMock,
};
