const sinon = require('sinon');

function DOMNode()
{
  this._attributes = {};
  this._boundingClientRect = {};
  this._children = [];
  this._events = new Map();
  this._queries = [];

  this.addEventListener = sinon.spy((name, callback) => {
    if (!this._events.has(name)) {
      this._events.set(name, new Set());
    }
    this._events.get(name).add(callback);
  });

  this.removeEventListener = sinon.spy((name, callback) => {
    this._events.get(name).delete(callback);
  });

  this.removeAttribute = sinon.spy((name) => {
    delete this._attributes[name];
  });

  this.appendChild = sinon.spy((element) => {
    this._children.push(element);
  });

  this.getBoundingClientRect = sinon.spy(() => {
    return this._boundingClientRect;
  });

  this.querySelector = sinon.spy(selector => {
    const node = new DOMNode;
    this._queries.push({
      selector,
      node,
    });
    return node;
  });

  this.classList = new Set;
  this.classList.remove = this.classList.delete;
  this.dataset = {};
  this.style = {};
}

DOMNode.prototype.getEvents = function()
{
  return this._events;
}


DOMNode.prototype.getQueries = function()
{
  return this._queries;
}

DOMNode.prototype.setBoundingClientRect = function(rect)
{
  this._boundingClientRect = rect;
}


DOMNode.prototype.triggerEvent = function(name, event)
{
  this._events.get(name).forEach(cb => {cb(event)});
}

module.exports = DOMNode;
