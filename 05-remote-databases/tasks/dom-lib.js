const domLib = (() => {
    /**
     *
     * @param tagName {String}
     * @param classes {String}
     * @returns {Node}
     */
    const createElement = (tagName, ...classes) => {
        const result = document.createElement(tagName);
        classes.forEach(c => result.classList.add(c));
        return result;
    };

    /**
     * Removes all children
     * @param parentNode {Node}
     */
    const removeAllChildren = parentNode => {
        while (parentNode.lastChild)  {
            parentNode.removeChild(parentNode.lastChild);
        }
    };

    /**
     * Returns the ".value" of the node and sets it to an empty string
     * @param inputNode {Node}
     * @returns {string}
     */
    const popInputValue = inputNode => {
        const value = inputNode.value;
        inputNode.value = '';
        return value;
    };

    return {
        createElement,
        removeAllChildren,
        popInputValue,
    }
})();