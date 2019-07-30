const printStuff = (async function(templateContainerPath, templateContentPath) {
    const containerResponse = await fetch(templateContainerPath);
    const containerContent = await containerResponse.text();
    const containerFunc = Handlebars.compile(containerContent);

    const contentResponse = await fetch(templateContentPath);
    const contentContent = await contentResponse.text();

    Handlebars.registerPartial('contact-template', contentContent);

    const contextObj = {
        contacts: [
            {name: 'Aleksandar', email: 'blabla@abv.bg'},
            {name: 'Pesho', email: 'blabla@gmail.com'},
            {email: 'blabla@yahoo.com'},
        ],
    };

    const result = containerFunc(contextObj);
    console.log(result);

    const divElement = document.getElementById('template');
    divElement.innerHTML = result;
})('./templates/random.hbs', './templates/contact-template.hbs');

const consolePrint = () => {
    console.log('Hello from button clicked from hbs!');
};

