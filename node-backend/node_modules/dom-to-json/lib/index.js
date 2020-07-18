/* eslint-disable no-undef */
'use strict';

// convert to json
export const toJSON =(node) =>{
    node = node || this;
    let obj = {
        nodeType: node.nodeType
    };
    if (node.tagName) {
        obj.tagName = node.tagName.toLowerCase();
    } else
    if (node.nodeName) {
        obj.nodeName = node.nodeName;
    }
    if (node.nodeValue) {
        obj.nodeValue = node.nodeValue;
    }
    let attrs = node.attributes;
    let childNodes = node.childNodes;
    let length;
    let arr;
    if (attrs) {
        length = attrs.length;
        arr = obj.attributes = new Array(length);
        for (let i = 0; i < length; i++) {
            const attr = attrs[i];
            arr[i] = [attr.nodeName, attr.nodeValue];
        }
    }
    if (childNodes) {
        length = childNodes.length;
        arr = obj.childNodes = new Array(length);
        for (let i = 0; i < length; i++) {
            arr[i] = toJSON(childNodes[i]);
        }
    }
    return obj;
}

// consvert json to dom
export const toDOM = (obj) => {
    if (typeof obj == 'string') {
        obj = JSON.parse(obj);
    }
    let node, nodeType = obj.nodeType;
    switch (nodeType) {
        case 1: //ELEMENT_NODE
            node = document.createElement(obj.tagName);
            let attributes = obj.attributes || [];
            for (let i = 0, len = attributes.length; i < len; i++) {
                const attr = attributes[i];
                node.setAttribute(attr[0], attr[1]);
            }
            break;
        case 3: //TEXT_NODE
            // eslint-disable-next-line no-undef
            node = document.createTextNode(obj.nodeValue);
            break;
        case 8: //COMMENT_NODE
            node = document.createComment(obj.nodeValue);
            break;
        case 9: //DOCUMENT_NODE
            node = document.implementation.createDocument();
            break;
        case 10: //DOCUMENT_TYPE_NODE
            node = document.implementation.createDocumentType(obj.nodeName);
            break;
        case 11: //DOCUMENT_FRAGMENT_NODE
            node = document.createDocumentFragment();
            break;
        default:
            return node;
    }
    if (nodeType == 1 || nodeType == 11) {
        const childNodes = obj.childNodes || [];
        for (let i = 0,  len = childNodes.length; i < len; i++) {
            node.appendChild(toDOM(childNodes[i]));
        }
    }
    return node;
}

// convert htmlnode to string
export const  outerHTML = (node)  =>{
    return node.outerHTML || new XMLSerializer().serializeToString(node);
}