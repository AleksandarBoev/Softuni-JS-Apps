(async () => {
    const sectionAllCats = document.getElementById('all-cats');

    const catsTemplateResourceResponse = await fetch('./cats-template.hbs');
    const catsTemplateContent = await catsTemplateResourceResponse.text();
    const catsTemplateFunction = Handlebars.compile(catsTemplateContent);

    const catsWithFixedImgLocation = JSON.parse(JSON.stringify(cats)); //copy the array
    catsWithFixedImgLocation.forEach(c => {
        c.imageLocation = 'images/' + c.imageLocation + '.jpg';
    });

    sectionAllCats.innerHTML = catsTemplateFunction({cats: catsWithFixedImgLocation});
    // sectionAllCats.innerHTML = catsTemplateFunction({cats: []});
    sectionAllCats.addEventListener('click', ev => {
        if (ev.target.tagName === 'BUTTON') {
            const buttonPressed = ev.target;
            const buttonParentDiv = buttonPressed.parentNode;
            const divStatus = buttonParentDiv.getElementsByClassName('status')[0];

            if (divStatus.style.display === 'none') {
                buttonPressed.textContent = 'Hide status code';
                divStatus.style.display = 'block';
            } else if (divStatus.style.display === 'block') {
                buttonPressed.textContent = 'Show status code';
                divStatus.style.display = 'none';
            }
        }
    });
})();
