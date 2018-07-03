function ensure(node, selector) {
    if (typeof node !== 'object' || !node.tagName) {
        throw new TypeError(`${node} is not an XML node`);
    }

    if (!node.matches(selector)) {
        throw new TypeError(`${node.outerHTML.substr(0, 64)} must match selector "${selector}"`);
    }
}

function children(parent, selector) {
    const next = [];
    for (let i = 0, node; node = parent.children[i]; ++i) {
        if (node.matches(selector)) {
            next.push(node);
        }
    }
    return next;
}

function find(parent, selector) {
    return children(parent, '*').reduce((all, child) => {
        return all.concat(Array.from(child.querySelectorAll(selector)));
    }, []);
}

function closest(node, selector) {
    for (; node && node !== node.ownerDocument; node = node.parentNode) {
        if (node.matches(selector)) {
            return node;
        }
    }
}

module.exports = {
    ensure,
    find,
    children,
    closest,
};
