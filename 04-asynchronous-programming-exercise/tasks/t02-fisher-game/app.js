function attachEvents() {
    const addCatchElements = {
        inputAngler: document.querySelector('#addForm input.angler'),
        inputWeight: document.querySelector('#addForm input.weight'),
        inputSpecies: document.querySelector('#addForm input.species'),
        inputLocation: document.querySelector('#addForm input.location'),
        inputBait: document.querySelector('#addForm input.bait'),
        inputCaptureTime: document.querySelector('#addForm input.captureTime'),
        buttonAdd: document.querySelector('#addForm button.add'),
    };

    const buttonLoad = document.getElementsByClassName('load')[0];
    const divCatchesContainer = document.getElementById('catches');

    const urls = {
        /**
         * Returns an object in format
         * { <uniqueKey>: {"angler", "bait", "captureTime", "location", "species", "weight" }, ... }
         */
        allCatches: 'https://fisher-game.firebaseio.com/catches.json',
        createCatch: 'https://fisher-game.firebaseio.com/catches.json',
        updateCatch: catchId => `https://fisher-game.firebaseio.com/catches/${catchId}.json`,
        deleteCatch: catchId => `https://fisher-game.firebaseio.com/catches/${catchId}.json`,
    };

    const catchGenerator = (() => {
        const divCatchTemplate = domLib.createElement('div', 'catch');

        const createLabelAndInputAndHr = (labelTextContent, inputClass, inputType) => {
            const fragment = document.createDocumentFragment();

            const label = document.createElement('label');
            label.textContent = labelTextContent;
            const input = domLib.createElement('input', inputClass);
            input.setAttribute('type', inputType);
            const hr = document.createElement('hr');

            [label, input, hr].forEach(e => fragment.appendChild(e));

            return fragment;
        };

        const angler = createLabelAndInputAndHr('Angler', 'angler', 'text');
        const weight = createLabelAndInputAndHr('Weight', 'weight', 'number');
        const species = createLabelAndInputAndHr('Species', 'species', 'text');
        const location = createLabelAndInputAndHr('Location', 'location', 'text');
        const bait = createLabelAndInputAndHr('Bait', 'bait', 'text');
        const captureTime = createLabelAndInputAndHr('Capture Time', 'captureTime', 'number');

        const buttonUpdate = domLib.createElement('button', 'update');
        buttonUpdate.textContent = 'Update';
        const buttonDelete = domLib.createElement('button', 'delete');
        buttonDelete.textContent = 'Delete';

        domLib.addAllChildren(divCatchTemplate, angler, weight, species, location, bait, captureTime,
            buttonUpdate, buttonDelete);

        return {
            generate: (dataId, angler, weight, species, location, bait, captureTime) => {
                const result = divCatchTemplate.cloneNode(true);
                result.setAttribute('data-id', dataId);

                result.getElementsByClassName('angler')[0].value = angler;
                result.getElementsByClassName('weight')[0].value = weight;
                result.getElementsByClassName('species')[0].value = species;
                result.getElementsByClassName('location')[0].value = location;
                result.getElementsByClassName('bait')[0].value = bait;
                result.getElementsByClassName('captureTime')[0].value = captureTime;

                return result;
            }
        }
    })();

    const reloadCatchesContainer = () => {
        domLib.removeAllChildren(divCatchesContainer);

        fetch(urls.allCatches)
            .then(response => response.json())
            .then(catchesObj => {
                domLib.removeAllChildren(divCatchesContainer);

                const fragment = document.createDocumentFragment();

                for (const key of Object.keys(catchesObj)) {
                    const currentCatch = catchesObj[key];

                    const currentCatchElement = catchGenerator.generate(
                        key, currentCatch.angler, currentCatch.weight, currentCatch.species,
                        currentCatch.location, currentCatch.bait, currentCatch.captureTime
                    );

                    fragment.appendChild(currentCatchElement);
                }

                divCatchesContainer.appendChild(fragment);
            });
    };

    buttonLoad.addEventListener('click', () => {
        reloadCatchesContainer();
    });

    addCatchElements.buttonAdd.addEventListener('click', () => {
        const catchBody = JSON.stringify({
            angler: domLib.popValue(addCatchElements.inputAngler),
            weight: domLib.popValue(addCatchElements.inputWeight),
            species: domLib.popValue(addCatchElements.inputSpecies),
            location: domLib.popValue(addCatchElements.inputLocation),
            bait: domLib.popValue(addCatchElements.inputBait),
            captureTime: domLib.popValue(addCatchElements.inputCaptureTime),
        });

        fetch(urls.createCatch, {
            method: 'POST',
            body: catchBody,
        }).then(() => {
            reloadCatchesContainer();
        }).catch(err => console.error(err));
    });

    divCatchesContainer.addEventListener('click', ev => {
        if (ev.target.tagName === 'BUTTON') {
            const currentCatchContainer = ev.target.parentNode;

            if (ev.target.classList.contains('update')) {
                const catchBody = JSON.stringify({
                    angler: currentCatchContainer.getElementsByClassName('angler')[0].value,
                    weight: currentCatchContainer.getElementsByClassName('weight')[0].value,
                    species: currentCatchContainer.getElementsByClassName('species')[0].value,
                    location: currentCatchContainer.getElementsByClassName('location')[0].value,
                    bait: currentCatchContainer.getElementsByClassName('bait')[0].value,
                    captureTime: currentCatchContainer.getElementsByClassName('captureTime')[0].value,
                });

                fetch(urls.updateCatch(currentCatchContainer.getAttribute('data-id')), {
                    method: 'PUT',
                    body: catchBody,
                }).catch(err => console.error(err));
            } else if (ev.target.classList.contains('delete')) {
                const id = currentCatchContainer.getAttribute('data-id');

                fetch(urls.deleteCatch(id), {
                    method: 'DELETE',
                }).then(reloadCatchesContainer)
                    .catch(err => console.error(err));
            }
        }
    });
}

attachEvents();

