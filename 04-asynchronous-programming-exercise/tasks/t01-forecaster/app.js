function attachEvents() {
    const symbols = {
        Sunny: '☀',
        'Partly sunny': '⛅',
        Overcast: '☁',
        Rain: '☂',
        Degrees: '°',
    };

    const urls = {
        /**
         * Fetch url, returning array of objects in format
         * { name: locationName, code: locationCode }
         * @type {string}
         */
        base: 'https://judgetests.firebaseio.com/locations.json',

        /**
         * Fetch url, returning an object in format
         * {
        name: locationName,
        forecast: { low: temp,
              high: temp,
              condition: condition }
        }
         * @param locationCode
         * @returns {string}
         */
        currentForecast: locationCode => `https://judgetests.firebaseio.com/forecast/today/${locationCode}.json`,

        /**
         * Fetch url, returning an object in format
         * {
        name: locationName,
        forecast: [{ low: temp,
               high: temp,
               condition: condition }, … ]
       }

         * @param locationCode
         * @returns {string}
         */
        upcomingForecast: locationCode => `https://judgetests.firebaseio.com/forecast/upcoming/${locationCode}.json`,
    };

    const buildMinMaxDegrees = (min, max) => `${min}${symbols.Degrees}/${max}${symbols.Degrees}`;

    const initialElements = {
        inputLocation: document.getElementById('location'),
        inputSubmit: document.getElementById('submit'),
        divForecastContainer: document.getElementById('forecast'),
        divCurrentForecast: document.getElementById('current'),
        divUpcomingForecast: document.getElementById('upcoming'),
        h1Error: document.getElementById('error'),
    };

    const errorMessages = {
        locationNotFound: locationName => `Location with name "${locationName}" was not found!`,
    };

    const currentForecastElements = (() => {
        const divElementForecasts = domLib.createElement('div', 'forecasts');
        const spanElementConditionSymbol = domLib.createElement('span', 'condition', 'symbol');

        const spanElementConditionContainer = domLib.createElement('span', 'condition');
        const spanElementForecastLocation = domLib.createElement('span', 'forecast-data');
        const spanElementForecastDegrees = domLib.createElement('span', 'forecast-data');
        const spanElementForecastCondition = domLib.createElement('span', 'forecast-data');

        [spanElementForecastLocation, spanElementForecastDegrees, spanElementForecastCondition]
            .forEach(e => spanElementConditionContainer.appendChild(e));

        [spanElementConditionSymbol, spanElementConditionContainer]
            .forEach(e => divElementForecasts.appendChild(e));

        initialElements.divCurrentForecast.appendChild(divElementForecasts);

        return {
            changeConditionSymbol: newConditionSymbol => spanElementConditionSymbol.textContent = newConditionSymbol,
            changeForecastLocation: newForecastLocation => spanElementForecastLocation.textContent = newForecastLocation,
            changeForecastDegrees: newForecastDegrees => spanElementForecastDegrees.textContent = newForecastDegrees,
            changeForecastCondition: newForecastCondition => spanElementForecastCondition.textContent = newForecastCondition,
        }
    })();

    const upcomingForecastElements = (() => {
        const divElementForecastInfo = domLib.createElement('div', 'forecast-info');

        const spanElementUpcomingTemplate = domLib.createElement('div', 'upcoming');
        const spanSymbol = domLib.createElement('span', 'symbol');
        const spanDegrees = domLib.createElement('span', 'forecast-data');
        const spanCondition = domLib.createElement('span', 'forecast-data');

        [spanSymbol, spanDegrees, spanCondition]
            .forEach(e => spanElementUpcomingTemplate.appendChild(e));

        initialElements.divUpcomingForecast.appendChild(divElementForecastInfo);

        return {
            /**
             * Objects have to be in format
             * [ {"condition": {String}, "high": {Number}, "low": {Number} }, ... ]
             * @param arrayOfObjects {Array}
             */
            changeUpcomingForecast: arrayOfObjects => {
                const fragment = document.createDocumentFragment();

                arrayOfObjects.forEach(obj => {
                    const newForecast = spanElementUpcomingTemplate.cloneNode(true);
                    newForecast.children[0].textContent = symbols[obj.condition];
                    newForecast.children[1].textContent = buildMinMaxDegrees(obj.low, obj.high);
                    newForecast.children[2].textContent = obj.condition;

                    fragment.appendChild(newForecast);
                });

                domLib.removeAllChildren(divElementForecastInfo);
                divElementForecastInfo.appendChild(fragment);
            },
        }
    })();

    initialElements.inputSubmit.addEventListener('click', () => {
        const locationName = initialElements.inputLocation.value;

        fetch(urls.base)
            .then(response => response.json())
            .then(arrayOfObjects => {
                const foundLocation = arrayOfObjects.filter(obj => obj.name === locationName)[0];

                if (!foundLocation) {
                    throw new Error(errorMessages.locationNotFound(locationName));
                }

                const locationCode = foundLocation.code;

                const currentForecastPromise = fetch(urls.currentForecast(locationCode))
                    .then(response => response.json());

                const upcomingForecastPromise = fetch(urls.upcomingForecast(locationCode))
                    .then(response => response.json());

                Promise.all([currentForecastPromise, upcomingForecastPromise]).then(promiseResults => {
                    const currentForecastObj = promiseResults[0];

                    const condition = currentForecastObj.forecast.condition;
                    currentForecastElements.changeConditionSymbol(symbols[condition]);
                    currentForecastElements.changeForecastCondition(condition);
                    currentForecastElements.changeForecastDegrees(buildMinMaxDegrees(
                        currentForecastObj.forecast.low,
                        currentForecastObj.forecast.high)
                    );
                    currentForecastElements.changeForecastLocation(currentForecastObj.name);

                    const upcomingForecastObj = promiseResults[1];

                    upcomingForecastElements.changeUpcomingForecast(upcomingForecastObj.forecast);

                    initialElements.divForecastContainer.style.display = 'block';
                    initialElements.h1Error.style.display = 'none';
                });
            })
            .catch(err => {
                initialElements.h1Error.style.display = 'block';
                initialElements.h1Error.textContent = err.message;
                initialElements.divForecastContainer.style.display = 'none';
            });
    })
}

attachEvents();