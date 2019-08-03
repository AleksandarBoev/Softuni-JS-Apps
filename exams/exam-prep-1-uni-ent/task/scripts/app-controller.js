const sammyApp = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', controllerLib.getHome);

    this.get('#/event_details/:eventId', controllerLib.getEventDetails);

    this.get('#/login', controllerLib.getLogin);

    this.post('#/login', controllerLib.postLogin);

    this.get('#/register', controllerLib.getRegister);

    this.post('#/register', controllerLib.postRegister);

    this.get('#/logout', controllerLib.getLogout);

    this.get('#/create_event', controllerLib.getCreateEvent);

    this.post('#/create_event', controllerLib.postCreateEvent);

    this.get('#/edit_event/:eventId', controllerLib.getEventEdit);

    this.post('#/edit_event/:eventId', controllerLib.postEventEdit);

    this.get('#/close_event/:eventId', controllerLib.getCloseEvent);

    this.get('#/join_event/:eventId', controllerLib.getJoinEvent);

    this.get('#/profile/:username', controllerLib.getProfile);
});

(() => sammyApp.run('#/home'))();