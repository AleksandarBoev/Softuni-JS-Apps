const controllerLib = (() => {
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

    const getHome = context => {
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                loadPage.call(context, hbsFilePaths.homeLoggedIn, {events: responseJson});
            });
    };

    const getEventDetails = context => {
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const eventId = context.params.eventId;

                const currentEvent = jsonData.filter(ev => ev._id === eventId)[0];

                const currentUserId = sessionStorage.getItem('userId');
                const currentEventCreatorId = currentEvent._acl.creator;

                if (currentEvent._acl.creator === currentUserId) {
                    loadPage.call(context, hbsFilePaths.eventDetails, {isCreator: true, currentEvent})
                } else {
                    loadPage.call(context, hbsFilePaths.eventDetails, {isCreator: false, currentEvent})
                }
            })
    };

    const getLogin = context => {
        loadPage.call(context, hbsFilePaths.login, {loggedIn: false});
    };

    const postLogin = context => {
        console.log('Trying to get the username!');
        const username = context.params.username;
        console.log('Got the username!');
        const password = context.params.password;

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
            context.redirect('#/home');
        }).catch(error => {
            console.log(error.message);
        });
    };

    const getRegister = context => {
        loadPage.call(context, hbsFilePaths.register);
    };

    const postRegister = context => {
        const username = context.params.username;
        const password = context.params.password;
        const rePassword = context.params.rePassword;

        if (username.length < 3) {
            console.log('longer username pls');
            context.redirect('#/register');
            return;
        }

        if (password.length < 6) {
            console.log('password is too short!');
            context.redirect('#/register');
            return;
        }

        if (password !== rePassword) {
            console.log('passwords do NOT match!');
            context.redirect('#/register');
            return;
        }

        kinveyRequester.sendRegisterUserRequest(username, password)
            .then(response => {
                console.log(response.statusCode);
                context.redirect('#/home');
            });
    };

    const getLogout = context => {
        kinveyRequester.sendLogoutRequest()
            .then(() => {
                sessionStorage.clear();
                context.redirect('#/home');
            });
    };

    const getCreateEvent = context => {
        loadPage.call(context, hbsFilePaths.createEvent);
    };

    const postCreateEvent = context => {
        const eventName = context.params.name;
        const dateTime = context.params.dateTime;
        const description = context.params.description;
        const imageUrl = context.params.imageURL;

        const requestBody = {
            name: eventName,
            organizer: sessionStorage.getItem('username'),
            description,
            date: dateTime,
            'image_url': imageUrl,
            'people_interested_in': 0,
        };

        kinveyRequester.sendPostRequestWithAuthToken(requestBody);
        context.redirect('#/home');
    };

    const getEventEdit = context => {
        const eventId = context.params.eventId;
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const eventToEdit = jsonData.filter(ev => ev._id === eventId)[0];
                loadPage.call(context, hbsFilePaths.edit, {eventToEdit});
            });
    };

    const postEventEdit = context => {
        const eventId = context.params.eventId;
        const newName = context.params.name;
        const newDate = context.params.dateTime;
        const newDescription = context.params.description;
        const newImageUrl = context.params.imageURL;
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
                    .then(context.redirect('#/home'));
            });
    };

    const getCloseEvent = context => {
        const eventId = context.params.eventId;
        kinveyRequester.sendDeleteRequestWithAuthTokenRecordId(eventId)
            .then(() => {
                context.redirect('#/home');
            });
    };

    const getJoinEvent = context => {
        const eventId = context.params.eventId;

        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                const putBody = {};
                const event = jsonData.filter(ev => ev._id === eventId)[0];
                event['people_interested_in'] = Number(event['people_interested_in']) + 1;
                kinveyRequester.sendPutRequestWithAuthTokenRecordId(event, eventId)
                    .then(context.redirect('#/home'));
            });
    };

    const getProfile = context => {
        const currentUsername = sessionStorage.getItem('username');
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(jsonData => {
                //kinda unreliable. If usernames were unique, maybe this would be fine. But it would be better with the users id.
                const userEvents = jsonData.filter(ev => ev.organizer === currentUsername);
                const pageContext = {
                    username: currentUsername,
                    numberOfEvents: userEvents.length,
                    userEvents,
                };

                loadPage.call(context, hbsFilePaths.profile, pageContext);
            });
    };

    return {
        getHome,
        getEventDetails,
        getLogin,
        postLogin,
        getRegister,
        postRegister,
        getLogout,
        getCreateEvent,
        postCreateEvent,
        getEventEdit,
        postEventEdit,
        getCloseEvent,
        getJoinEvent,
        getProfile,
    }
})();

