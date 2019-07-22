(function (scope) {
    const removeAllChildren = parentNode => {
        while (parentNode.lastChild) {
            parentNode.lastChild.remove();
        }
    };

    scope.library = {removeAllChildren};
})(window);

