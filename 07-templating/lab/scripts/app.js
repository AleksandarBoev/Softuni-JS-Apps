(async function (scope) {
    const allContactsHbsResponse = await fetch('./templates/all-contacts.hbs');
    const allContactsContent = await allContactsHbsResponse.text();
    const allContactsTemplateFunction = Handlebars.compile(allContactsContent);

    const contactCardHbsResponse = await fetch('./templates/contact-card.hbs');
    const contactCardContent = await contactCardHbsResponse.text();

    Handlebars.registerPartial('contact-card', contactCardContent);

    const createdHtml = allContactsTemplateFunction({contacts});
    document.getElementById('contacts').innerHTML = createdHtml;

    const showDetails = id => {
         document.getElementById(id).style.display = 'block';
    };

    window.showDetails = showDetails;
})(window);