//TODO unfinished. Only loading and showing data is done.
(function() {
    const elements = {
        inputVenueDate: document.getElementById('venueDate'),
        inputButtonGetVenues: document.getElementById('getVenues'),
        divVenueInfoContainer: document.getElementById('venue-info'),
    };

    const venueGenerator = (() => {
        const venueTemplate = domLib.createElement('div', 'venue');

        const spanVenueName = domLib.createElement('span', 'venue-name');
        const inputButton = domLib.createElement('input', 'info');
        inputButton.setAttribute('type', 'button');
        inputButton.value = 'More info';
        spanVenueName.appendChild(inputButton);
        venueTemplate.appendChild(spanVenueName);

        const divVenueDetailsContainer = domLib.createElement('div', 'venue-details');
        divVenueDetailsContainer.style.display = 'none';

        const table = document.createElement('table');

        const tableRowHead = document.createElement('tr');
        const tableHeadTicketPrice = document.createElement('th');
        tableHeadTicketPrice.textContent = 'Ticket Price';
        const tableHeadQuantity = document.createElement('th');
        tableHeadQuantity.textContent = 'Quantity';
        const tableHead = document.createElement('th'); //just an empty one is needed
        [tableHeadTicketPrice, tableHeadQuantity, tableHead].forEach(th => tableRowHead.appendChild(th));
        table.appendChild(tableRowHead);

        const tableRowBody = document.createElement('tr');
        const tableDataVenuePrice = domLib.createElement('td', 'venue-price');
        const tableDataSelect = document.createElement('td');
        const selectQuantity = domLib.createElement('select', 'quantity');
        const options = [];
        for (let i = 1; i <= 5; i++) {
            const currentOption = document.createElement('option');
            currentOption.textContent = i;
            currentOption.setAttribute('value', '' + i);
            options.push(currentOption);
        }
        options.forEach(o => selectQuantity.appendChild(o));
        tableDataSelect.appendChild(selectQuantity);
        const inputButtonPurchase = domLib.createElement('input', 'purchase');
        inputButtonPurchase.setAttribute('type', 'button');
        inputButtonPurchase.value = 'Purchase';
        [tableDataVenuePrice, tableDataSelect, inputButtonPurchase].forEach(e => tableRowBody.appendChild(e));
        table.appendChild(tableRowBody);

        venueTemplate.appendChild(table);

        const spanHead = domLib.createElement('span', 'head');
        spanHead.textContent = 'Venue description';
        const paragraphDescription1 = domLib.createElement('p', 'description');
        const paragraphDescription2 = domLib.createElement('p', 'description');
        paragraphDescription2.textContent = 'Starting time: ';
        venueTemplate.appendChild(spanHead);
        venueTemplate.appendChild(paragraphDescription1);
        venueTemplate.appendChild(paragraphDescription2);

        return {
            generate: (venueId, name, description, startingHour, price) => {
                const result = venueTemplate.cloneNode(true);
                result.setAttribute('id', venueId);
                console.log(result);

                const spanText = document.createElement('span');
                spanText.textContent = name;
                result.getElementsByClassName('venue-name')[0].appendChild(spanText);

                result.querySelector('td.venue-price').textContent = price;

                result.querySelectorAll('p.description')[0].textContent = description;
                result.querySelectorAll('p.description')[1].textContent += startingHour;

                return result;
            }
        }
    })();

    elements.inputButtonGetVenues.addEventListener('click', () => {
        const postUrl = `https://baas.kinvey.com/rpc/${kinveyInformation.appKey}/custom/calendar?query=${elements.inputVenueDate.value}`;
        kinveyLib.sendPostRequest(postUrl, kinveyInformation.username, kinveyInformation.password, {})
            .then(response => response.json())
            .then(availableVenuesIdsArray => {
                const getUrlConstructor = venueId =>
                    `${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/venues/${venueId}`;

                const promisesArr = [];

                for (const currentVenueId of availableVenuesIdsArray) {
                    promisesArr.push(kinveyLib.sendGetRequest(
                        getUrlConstructor(currentVenueId),
                        kinveyInformation.username,
                        kinveyInformation.password
                    ));
                }

                Promise.all(promisesArr).then(responses => {
                    const responsesArr = [];
                    for (const currentResponse of responses) {
                        responsesArr.push(currentResponse.json());
                    }

                    Promise.all(responsesArr).then(venueObjects => {
                        const fragment = document.createDocumentFragment();

                        for (const currentVenue of venueObjects) {
                            const newVenueDiv = venueGenerator.generate(
                                currentVenue._id,
                                currentVenue.name,
                                currentVenue.description,
                                currentVenue.startingHour,
                                currentVenue.price
                            );

                            fragment.appendChild(newVenueDiv);
                        }

                        elements.divVenueInfoContainer.appendChild(fragment);
                    })
                })
            })
    })
})();