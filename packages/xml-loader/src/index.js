const XMLLoader = require('./XMLLoader');
const Parser = require('./parsers/Parser');
const Util = require('./util/traverse');

Parser.EntityParser = require('./parsers/EntityParser');
Parser.SceneParser = require('./parsers/SceneParser');
Parser.TraitParser = require('./parsers/TraitParser');

module.exports = {
    XMLLoader,
    Parser,
    Util,
};
