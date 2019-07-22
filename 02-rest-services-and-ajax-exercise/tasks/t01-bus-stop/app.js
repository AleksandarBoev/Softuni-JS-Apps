const getInfo = (function () {
    const inputElementStopId = document.querySelector('#stopId');
    const divElementStopName = document.querySelector('#stopName');
    const ulElementBuses = document.querySelector('#buses');

    const liElementTemplate = document.createElement('li');

    const createLiElementBusInfo = (busId, busArrivalMinutes) => {
        const result = liElementTemplate.cloneNode(true);
        result.textContent = `Bus ${busId} arrives in ${busArrivalMinutes}`;
        return result;
    };

    const clearBuses = () => {
        while (ulElementBuses.lastChild) {
            ulElementBuses.removeChild(ulElementBuses.lastChild);
        }
    };

    function resultFunction() {
        clearBuses();

        fetch(`https://judgetests.firebaseio.com/businfo/${inputElementStopId.value}.json`)
            .then(response => response.json())
            .then(busStopInfoJson => {
                divElementStopName.textContent = busStopInfoJson.name;

                const busesInfoObject = busStopInfoJson.buses;

                for (const busId of Object.keys(busesInfoObject)) {
                    const busArrivalTime = busesInfoObject[busId];
                    const newLiElementCurrentBus = createLiElementBusInfo(busId, busArrivalTime);

                    ulElementBuses.appendChild(newLiElementCurrentBus);
                }
            })
            .catch(() => divElementStopName.textContent = 'Error');
    }

    return resultFunction;
})();