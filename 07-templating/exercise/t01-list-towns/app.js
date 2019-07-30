(() => {
    const elements = {
        inputTown: document.getElementById('towns'),
        buttonLoadTowns: document.getElementById('btnLoadTowns'),
        divTownContainer: document.getElementById('root'),
    };

    let townTemplateFunctionPromise = (async () => {
        const templateFileResponse = await fetch('./towns-template.hbs');
        const templateString = await templateFileResponse.text();
        return Handlebars.compile(templateString);
    })();

    const extractTownData = string => {
        const towns = string
            .split(', ')
            .filter(t => t) //empty strings are falsy
            .map(t => {
                return {name: t};
            });

        return {towns};
    };

    (async function () {
        const townTemplateFunction = await townTemplateFunctionPromise;
        elements.buttonLoadTowns.addEventListener('click', () => {
            const townsContext = extractTownData(elements.inputTown.value);
            elements.divTownContainer.innerHTML = townTemplateFunction(townsContext);
        });
    })();
})();