const {ensure} = require('../util/traverse');
const Parser = require('./Parser');

class TraitParser extends Parser
{
    static createFactory(TraitConstructor) {
      return function factory(parser, node) {
        const props = parser.parsePrimitives(node);

        return function createTrait() {
          const trait = new TraitConstructor();
          props.forEach((value, key) => {
            if (trait.hasOwnProperty(key)) {
              trait[key] = value;
            }
          });
          return trait;
        };
      };
    }

    parsePrimitives(node) {
        const props = new Map();

        for (let attr, i = 0; attr = node.attributes[i++];) {
            const {name, value} = attr;

            const number = parseFloat(value);
            if (isFinite(number)) {
                props.set(name, number);
            } else if (value === 'true' || value === 'false') {
                const bool = value === 'true' ? true : false;
                props.set(name, bool);
            } else {
                props.set(name, value);
            }
        }

        return props;
    }

    parseTrait(node) {
        const name = this.getAttr(node, 'name') || node.tagName;
        const factory = this.loader.traits.resolve(name);
        if (!factory) {
            throw new TypeError(`Trait factory "${name}" does not exist.`);
        }
        return Promise.resolve(factory(this, node));
    }

    parseTraits(node) {
        ensure(node, 'traits');
        return Promise.all([...node.children].map(node => {
            return this.parseTrait(node);
        }));
    }
}

module.exports = TraitParser;
