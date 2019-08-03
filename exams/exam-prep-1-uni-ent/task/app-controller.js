const sammyApp = Sammy('#root', function () {
    //Note: paths to .hbs files depend on where the html file (which uses the js file) is located, not the js file itself!
    const fromHtmlToHbsFolderPath = './handlebar-files/';
    const hbsFilePaths = {
        header: fromHtmlToHbsFolderPath + 'common/header.hbs',
        footer: fromHtmlToHbsFolderPath + 'common/footer.hbs',
        pageTemplate: fromHtmlToHbsFolderPath + 'common/page-template.hbs',
        homeLoggedIn: fromHtmlToHbsFolderPath + 'home.hbs',
        eventDetails: fromHtmlToHbsFolderPath + 'event-details.hbs',
        profile: fromHtmlToHbsFolderPath + 'profile.hbs',
        createEvent: fromHtmlToHbsFolderPath + 'forms/create-event.hbs',
        edit: fromHtmlToHbsFolderPath + 'forms/edit-event.hbs',
        register: fromHtmlToHbsFolderPath + 'forms/register.hbs',
        login: fromHtmlToHbsFolderPath + 'forms/sign-in.hbs',
    };

    this.use('Handlebars', 'hbs');

    function loadPage(mainPartialPath, context = {}) {
        this.loadPartials({
            headerPartial: hbsFilePaths.header,
            mainPartial: mainPartialPath,
            footerPartial: hbsFilePaths.footer,
        }).then(function () {
            context.username = sessionStorage.getItem('username');
            context.authToken = sessionStorage.getItem('authToken');
            this.partial(hbsFilePaths.pageTemplate, context);
        });
    }

    function isLoggedIn() {
        return sessionStorage.getItem('authToken') !== undefined
            && sessionStorage.getItem('authToken') !== null;
    }

    function redirectIfNotLoggedIn() {
        if (!isLoggedIn()) {
            this.redirect('#/home');
        }
    }

    function redirectIfLoggedIn() { //TODO fix this
        if (isLoggedIn()) {
            this.redirect('#/home');
            return true;
        }
    }

    this.get('#/home', function () {
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                loadPage.call(this, hbsFilePaths.homeLoggedIn, {events: responseJson});
            });
    });

    this.get('#/event_details/:eventId', function () {
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const eventId = this.params.eventId;

                const currentEvent = jsonData.filter(ev => ev._id === eventId)[0];

                const currentUserId = sessionStorage.getItem('userId');
                const currentEventCreatorId = currentEvent._acl.creator;

                if (currentEvent._acl.creator === currentUserId) {
                    loadPage.call(this, hbsFilePaths.eventDetails, {isCreator: true, currentEvent})
                } else {
                    loadPage.call(this, hbsFilePaths.eventDetails, {isCreator: false, currentEvent})
                }
            })
    });

    this.get('#/login', function () {
        loadPage.call(this, hbsFilePaths.login, {loggedIn: false});
    });

    this.post('#/login', function () {
        const username = this.params.username;
        const password = this.params.password;

        kinveyRequester.sendLoginRequest(username, password)
            .then(response => {
                if (response.status.code >= 400) {
                    throw Error('Invalid username/password!')
                }

                return response.json();
            }).then(responseData => {
            console.log(responseData);
            sessionStorage.setItem('username', responseData.username);
            sessionStorage.setItem('authToken', responseData._kmd.authtoken);
            sessionStorage.setItem('userId', responseData._id);
            this.redirect('#/home');
        }).catch(error => {
            console.log(error.message);
        });
    });

    this.get('#/register', function () {
        loadPage.call(this, hbsFilePaths.register);
    });

    this.post('#/register', function () {
        const username = this.params.username;
        const password = this.params.password;
        const rePassword = this.params.rePassword;

        if (username.length < 3) {
            console.log('longer username pls');
            this.redirect('#/register');
            return;
        }

        if (password.length < 6) {
            console.log('password is too short!');
            this.redirect('#/register');
            return;
        }

        if (password !== rePassword) {
            console.log('passwords do NOT match!');
            this.redirect('#/register');
            return;
        }

        kinveyRequester.sendRegisterUserRequest(username, password)
            .then(response => {
                console.log(response.statusCode);
                this.redirect('#/home');
            });
    });

    this.get('#/logout', function () {
        kinveyRequester.sendLogoutRequest()
            .then(() => {
                window.sessionStorage.clear();
                this.redirect('#/home');
            });
    });

    this.get('#/create_event', function () {
        loadPage.call(this, hbsFilePaths.createEvent);
    });

    this.post('#/create_event', function () {
        const eventName = this.params.name;
        const dateTime = this.params.dateTime;
        const description = this.params.description;
        const imageUrl = this.params.imageURL;

        const requestBody = {
            name: eventName,
            organizer: sessionStorage.getItem('username'),
            description,
            date: dateTime,
            'image_url': imageUrl,
            'people_interested_in': 0,
        };

        kinveyRequester.sendPostRequestWithAuthToken(requestBody);
        this.redirect('#/home');
    });

    /*
     <a href="#/edit_event/{{currentEvent._id}}" class="btn btn-primary btn-lg">Edit the event</a>
            <a href="#/close_event/{{currentEvent._id}}" class="btn btn-danger btn-lg">Close the event</a>
        {{else}}
            <a href="#/join_event/{{currentEvent._id}}" class="btn btn-info btn-lg">Join the event</a>
     */
    this.get('#/edit_event/:eventId', function () {
        const eventId = this.params.eventId;
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const eventToEdit = jsonData.filter(ev => ev._id === eventId)[0];
                loadPage.call(this, hbsFilePaths.edit, {eventToEdit});
            });
    });

    this.post('#/edit_event/:eventId', function () {
        const eventId = this.params.eventId;
        const newName = this.params.name;
        const newDate = this.params.dateTime;
        const newDescription = this.params.description;
        const newImageUrl = this.params.imageURL;
        const putBody = {
            name: newName,
            date: newDate,
            description: newDescription,
            'image_url': newImageUrl,
        };
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const eventToEdit = jsonData.filter(ev => ev._id === eventId)[0];
                putBody.organizer = eventToEdit.organizer;
                putBody['people_interested_in'] = eventToEdit['people_interested_in'];
                kinveyRequester.sendPutRequestWithAuthTokenRecordId(putBody, eventId)
                    .then(this.redirect('#/home'));
            });
    });

    this.get('#/close_event/:eventId', function () {
        const eventId = this.params.eventId;
        kinveyRequester.sendDeleteRequestWithAuthTokenRecordId(eventId)
            .then(() => {
                this.redirect('#/home');
            });
    });

    this.get('#/join_event/:eventId', function () {
        const eventId = this.params.eventId;

        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const putBody = {};
                const event = jsonData.filter(ev => ev._id === eventId)[0];
                event['people_interested_in'] = Number(event['people_interested_in']) + 1;
                kinveyRequester.sendPutRequestWithAuthTokenRecordId(event, eventId)
                    .then(this.redirect('#/home'));
            });
    });
});

(() => sammyApp.run('#/home'))();