const sinon = require('sinon');

function ImageMock() {
  this.height = 0;
  this.width = 0;
}

function mock() {
  global.Image = ImageMock;
}

function restore() {
  delete global.Image;
}

module.exports = {
  ImageMock,
  mock,
  restore,
};
