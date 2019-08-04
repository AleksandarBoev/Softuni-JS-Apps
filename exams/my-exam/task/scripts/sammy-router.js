const sammyApp = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', controllerLib.getHome);

    this.get('#/login', controllerLib.getLogin);
    this.post('#/login', controllerLib.postLogin);

    this.get('#/register', controllerLib.getRegister);
    this.post('#/register', controllerLib.postRegister);

    this.get('#/logout', controllerLib.getLogout);

    this.get('#/create_offer', controllerLib.getCreateOffer);
    this.post('#/create_offer', controllerLib.postCreateOffer);

    this.get('#/dashboard', controllerLib.getDashboard);

    this.get('#/offer_details/:offerId', controllerLib.getOfferDetails);

    this.get('#/edit_offer/:offerId', controllerLib.getEdit);
    this.post('#/edit_offer/:offerId', controllerLib.postEdit);

    this.get('#/delete_offer/:offerId', controllerLib.getDeleteOffer);
    this.post('#/delete_offer/:offerId', controllerLib.postDeleteOffer);

    this.get('#/profile/:userId', controllerLib.getProfile);
});

(() => sammyApp.run('#/home'))();