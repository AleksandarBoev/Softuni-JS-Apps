const getCharacter = (function () {
    const inputElementCharacterId = document.querySelector('#character-id');
    const spanElementCharacterName = document.querySelector('#character-name');
    const spanElementCharacterGender = document.querySelector('#character-gender');
    const searchUrl = 'https://swapi.co/api/people/';
    const divElementCharacterInformation = document.querySelector('#character-id');

    function getCharacter() { //blocked by cors
        fetch(searchUrl + inputElementCharacterId.value, {mode: "no-cors"})
            .then(response => response.json())
            .then(jsonData => {
                spanElementCharacterName.textContent = jsonData.name;
                spanElementCharacterGender.textContent = jsonData.gender;
                divElementCharacterInformation.style.display = 'block';
            })
            .catch((error) => console.error(error))
    }

    return getCharacter;
})();