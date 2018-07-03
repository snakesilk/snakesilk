const {find, ensure} = require('../util/traverse');
const Parser = require('./Parser');
const ActionParser = require('./ActionParser');

class EventParser extends Parser
{
    constructor(loader) {
        super(loader);
        this.actionParser = new ActionParser(loader);
    }

    getEvents(node) {
        ensure(node, 'events');

        const context = {
            events: [],
        };

        return Promise.all([
            this.parseEvents(node, context),
        ]).then(() => {
            return context;
        });
    }

    parseEvents(node, {events}) {
        const actionNodes = find(node, 'event > action');
        for (let actionNode, i = 0; actionNode = actionNodes[i++];) {
            const name = this.getAttr(actionNode.parentNode, 'name');
            const action = this.actionParser.getAction(actionNode);
            events.push({
                name: name,
                callback: action,
            });
        }
    }
}

module.exports = EventParser;
