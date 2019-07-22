const domLib = (() => {
    /**
     * Removes all child nodes
     * @param node {HTMLElement}
     */
    const removeAllChildren = node => {
        while (node.lastChild) {
            node.lastChild.remove();
        }
    };

    /**
     * Appends all children in the provided order, using fragment
     * @param node {HTMLElement}
     * @param children {HTMLElement}
     */
    const addAllChildren = (node, ...children) => {
        const fragment = document.createDocumentFragment();
        children.forEach(c => fragment.appendChild(c));
        node.appendChild(fragment);
    };

    const createElement = (tagname, ...classes) => {
        const result = document.createElement(tagname);
        classes.forEach(c => result.classList.add(c));
        return result;
    };

    /**
     * Returns the .value of provided element and sets it to empty string
     * @param element {HTMLElement} 'input' or 'textArea'
     * @returns {string} the element.value
     */
    const popValue = element => {
        const result = element.value;
        element.value = '';
        return result;
    };

    return {removeAllChildren, createElement, addAllChildren, popValue};
})();