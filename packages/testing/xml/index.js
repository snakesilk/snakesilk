const fs = require('fs');
const {JSDOM} = require('jsdom');

function createDoc(xml) {
    const dom = new JSDOM(xml, {
        contentType: "text/xml",
    });
    return dom.window.document;
}

function createNode(xml) {
    return createDoc(xml).childNodes[0];
}

function readXMLFile(file) {
    const xml = fs.readFileSync(file, 'utf8');
    return createDoc(xml);
}

module.exports = {
    createDoc,
    createNode,
    readXMLFile,
};
