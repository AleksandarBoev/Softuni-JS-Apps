$(async () => { //this syntax means "execute when the html page is fully loaded"
    const divMonkeysContainer = document.querySelector('section div.monkeys');

    const monkeyTemplateResourceResponse = await fetch('./monkeys-template.hbs');
    const monkeyTemplateContent = await monkeyTemplateResourceResponse.text();
    const monkeyTemplateFunction = Handlebars.compile(monkeyTemplateContent);

    divMonkeysContainer.innerHTML = monkeyTemplateFunction({monkeys});

    divMonkeysContainer.addEventListener('click', ev => {
        if (ev.target.tagName === 'BUTTON') {
            const buttonPressed = ev.target;
            const parentDiv = buttonPressed.parentNode;
            const paragraphInfo = parentDiv.getElementsByTagName('p')[0];

            if (paragraphInfo.style.display === 'block') {
                paragraphInfo.style.display = 'none';
            } else if (paragraphInfo.style.display === 'none') {
                paragraphInfo.style.display = 'block';
            }
        }
    });
});