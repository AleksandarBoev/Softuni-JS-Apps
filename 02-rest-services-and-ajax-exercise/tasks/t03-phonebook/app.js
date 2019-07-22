function attachEvents() {
    const buttonElementLoadPhoneNumbers = document.querySelector('#btnLoad');
    const buttonElementCreatePhoneNumber = document.querySelector('#btnCreate');
    const ulElementPhoneBook = document.querySelector('#phonebook');
    const inputElementPersonName = document.querySelector('#person');
    const inputElementPersonPhoneNumber = document.querySelector('#phone');

    const phoneBookUrl = 'https://phonebook-nakov.firebaseio.com/phonebook.json';
    const createDeleteUrl = key => `https://phonebook-nakov.firebaseio.com/phonebook/${key}.json`;

    const liElementPhoneNumberTemplate = document.createElement('li');
    const spanElementPersonDetails = document.createElement('span');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    liElementPhoneNumberTemplate.appendChild(spanElementPersonDetails);
    liElementPhoneNumberTemplate.appendChild(deleteButton);

    const createLiElementPhoneNumber = (name, phoneNumber, key) => {
        const result = liElementPhoneNumberTemplate.cloneNode(true);
        result.querySelector('span').textContent = `${name}: ${phoneNumber}`;

        result.querySelector('button').addEventListener('click', ev => {
            fetch(createDeleteUrl(key), {method: 'DELETE'}).catch(err => console.log(err));
            ev.target.parentNode.remove();
        });

        return result;
    };

    const clearUlElement = () => {
        while (ulElementPhoneBook.lastChild) {
            ulElementPhoneBook.removeChild(ulElementPhoneBook.lastChild);
        }
    };

    const loadContacts = function () {
        clearUlElement();

        fetch(phoneBookUrl)
            .then(response => response.json())
            .then(data => {
                for (const weirdKey of Object.keys(data)) {
                    const currentPhoneNumber = data[weirdKey];
                    const newLiElement =
                        createLiElementPhoneNumber(currentPhoneNumber.person, currentPhoneNumber.phone, weirdKey);
                    ulElementPhoneBook.appendChild(newLiElement);
                }
            });
    };

    buttonElementLoadPhoneNumbers.addEventListener('click', () => {
        loadContacts();
    });

    buttonElementCreatePhoneNumber.addEventListener('click', () => {
        const newContact = {
            person: inputElementPersonName.value,
            phone: inputElementPersonPhoneNumber.value,
        };

        inputElementPersonName.value = '';
        inputElementPersonPhoneNumber.value = '';
        fetch(phoneBookUrl, {method: 'POST', body: JSON.stringify(newContact)})
            .then(() => loadContacts())
            .catch(err => console.log(err));
    })
}

attachEvents();