function solve() {
    const divElementInfo = document.querySelector('#info');
    const inputButtonElementDepart = document.querySelector('#depart');
    const inputButtonElementArrive = document.querySelector('#arrive');

    const scheduleUrl = busId => `https://judgetests.firebaseio.com/schedule/${busId}.json`;
    let currentStop;
    fetch(scheduleUrl('depot'))
        .then(response => response.json())
    .then(data => {
        currentStop = data;
    });

    function depart() {
        inputButtonElementDepart.setAttribute('disabled', '');
        inputButtonElementArrive.removeAttribute('disabled');

        divElementInfo.textContent = 'Next stop ' + currentStop.name;
    }

    function arrive() {
        inputButtonElementArrive.setAttribute('disabled', '');
        inputButtonElementDepart.removeAttribute('disabled');
        divElementInfo.textContent = 'Arriving at ' + currentStop.name;

        fetch(scheduleUrl(currentStop.next))
            .then(response => response.json())
            .then(data => {
                currentStop = data;
            })
            .catch(() => {
                divElementInfo.textContent = 'Error';
                inputButtonElementArrive.setAttribute('disabled', 'true');
                inputButtonElementDepart.setAttribute('disabled', 'true');
            })
    }

    return {
        depart,
        arrive
    };
}

let result = solve();