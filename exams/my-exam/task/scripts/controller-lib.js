const controllerLib = (() => {
    const fromHtmlToHbsFolderPath = './handlebar-files/'; //TODO
    const hbsFilePaths = {
        header: fromHtmlToHbsFolderPath + 'common/header.hbs',
        footer: fromHtmlToHbsFolderPath + 'common/footer.hbs',
        pageTemplate: fromHtmlToHbsFolderPath + 'common/page-template.hbs',
        home: fromHtmlToHbsFolderPath + 'other/home-page.hbs',
        createOffer: fromHtmlToHbsFolderPath + 'other/create-offer.hbs',
        dashboard: fromHtmlToHbsFolderPath + 'other/dashboard.hbs',
        deleteOffer: fromHtmlToHbsFolderPath + 'other/delete-offer.hbs',
        editOffer: fromHtmlToHbsFolderPath + 'other/edit-offer.hbs',
        login: fromHtmlToHbsFolderPath + 'other/login.hbs',
        notifications: fromHtmlToHbsFolderPath + 'other/notifications.hbs',
        offerDetails: fromHtmlToHbsFolderPath + 'other/offer-details.hbs',
        profile: fromHtmlToHbsFolderPath + 'other/profile.hbs',
        register: fromHtmlToHbsFolderPath + 'other/register.hbs',
    };

    function loadPage(mainPartialPath, hbsContext = {}) {
        this.loadPartials({
            headerPartial: hbsFilePaths.header,
            mainPartial: mainPartialPath,
            footerPartial: hbsFilePaths.footer,
        }).then(function () {
            hbsContext.username = sessionStorage.getItem('username');
            hbsContext.authToken = sessionStorage.getItem('authToken');
            hbsContext.numberOfPurchases = sessionStorage.getItem('numberOfPurchases'); //just for this exam
            hbsContext.numberOfPurchases = sessionStorage.getItem('userId'); //just for this exam
            this.partial(hbsFilePaths.pageTemplate, hbsContext); //hbs files will ALWAYS have access to current username and authToken
        });
    }

    const getEmptyStringErrorMessage = parameterName => `${parameterName} can't be an empty string!`;

    const isValidObject = offerObject => { //shouldn't log in the console, but w/e
        if (!offerObject.product) {
            console.log(getEmptyStringErrorMessage('Product name'));
            return false;
        }

        if (!offerObject.description) {
            console.log(getEmptyStringErrorMessage('Description'));
            return false;
        }

        if (!offerObject.price) {
            console.log(getEmptyStringErrorMessage('Price'));
            return false;
        }

        if (!offerObject.pictureUrl.startsWith('http://')
            && !offerObject.pictureUrl.startsWith('https://')) {
            console.log('Picture url should start with either "http://" or "https://"!');
            return false;
        }

        return true;
    };

    const getHome = sammyContext => {
        loadPage.call(sammyContext, hbsFilePaths.home);
    };

    const getLogin = sammyContext => {
        loadPage.call(sammyContext, hbsFilePaths.login);
    };

    const postLogin = sammyContext => {
        console.log('Trying to get the username!');
        const username = sammyContext.params.username;
        console.log('Got the username!');
        const password = sammyContext.params.password;

        kinveyRequester.sendLoginRequest(username, password)
            .then(response => {
                if (response.status === 401) {
                    throw Error('Invalid username/password!')
                }

                return response.json();
            })
            .then(responseData => {
                console.log(responseData);
                sessionStorage.setItem('username', responseData.username);
                sessionStorage.setItem('authToken', responseData._kmd.authtoken);
                sessionStorage.setItem('userId', responseData._id);
                sessionStorage.setItem('numberOfPurchases', responseData.numberOfPurchases);
                sammyContext.redirect('#/home');
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    const getRegister = sammyContext => {
        loadPage.call(sammyContext, hbsFilePaths.register);
    };

    /**
     By given username and password, the app should register a new user in the system.
     The following validations should be made:
     The username and password must be non-empty string
     The re-password should be equal to the password
     After a successful registration, home page should be displayed with the right navbar.
     Keep the user session data in the browser's session or local storage.
     */
    const postRegister = sammyContext => {
        const username = sammyContext.params.username;
        const password = sammyContext.params.password;
        const rePassword = sammyContext.params.rePassword;

        if (!username) { //empty strings are falsy
            console.log(getEmptyStringErrorMessage('Username'));
            sammyContext.redirect('#/register');
            return;
        }

        if (!password) {
            console.log(getEmptyStringErrorMessage('Password'));
            sammyContext.redirect('#/register');
            return;
        }

        if (password !== rePassword) {
            console.log('Password and re-password do NOT match!');
            sammyContext.redirect('#/register');
            return;
        }

        kinveyRequester.sendRegisterUserRequest(username, password)
            .then(response => {
                sammyContext.redirect('#/home');
            });
    };

    const getLogout = sammyContext => {
        kinveyRequester.sendLogoutRequest()
            .then(() => {
                sessionStorage.clear();
                sammyContext.redirect('#/home');
            });
    };

    const getCreateOffer = sammyContext => {
        loadPage.call(sammyContext, hbsFilePaths.createOffer);
    };

    /*
    The input fields for product, description and price should be non-empty strings
    The input field for imageUrl, must be valid url refering to picture
     */
    const postCreateOffer = sammyContext => {
        const product = sammyContext.params.product;
        const description = sammyContext.params.description;
        const price = sammyContext.params.price;
        const pictureUrl = sammyContext.params.pictureUrl;

        const newProductBody = {
            product,
            description,
            price,
            pictureUrl,
        };

        if (!isValidObject(newProductBody)) {
            return;
        }

        kinveyRequester.sendPostRequestWithAuthToken(newProductBody)
            .then(() => {
                sammyContext.redirect('#/dashboard');
            });
    };

    const getDashboard = sammyContext => {
        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(arrayOfOfferObjects => {
                //"._acl.creator"
                console.log(arrayOfOfferObjects);
                let counter = 0;
                arrayOfOfferObjects.map(currentOffer => {
                    const offerCreatorId = currentOffer._acl.creator;
                    const currentUserId = sessionStorage.getItem('userId');

                    if (offerCreatorId === currentUserId) {
                        currentOffer.isOwnedByCurrentLoggedInUser = true;
                    } else {
                        currentOffer.isOwnedByCurrentLoggedInUser = false;
                    }
                    currentOffer.orderNumber = ++counter;

                    return currentOffer;
                });

                loadPage.call(sammyContext, hbsFilePaths.dashboard, {offers: arrayOfOfferObjects});
            });
    };

    const getOfferDetails = sammyContext => {
        const offerId = sammyContext.params.offerId;

        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(arrayOfOfferObjects => {
                const offerSelected = arrayOfOfferObjects.filter(o => o._id === offerId)[0];

                loadPage.call(sammyContext, hbsFilePaths.offerDetails, offerSelected);
            });
    };

    const getEdit = sammyContext => {
        const offerId = sammyContext.params.offerId;

        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(arrayOfOfferObjects => {
                const offerToEdit = arrayOfOfferObjects.filter(o => o._id === offerId)[0];

                loadPage.call(sammyContext, hbsFilePaths.editOffer, offerToEdit);
            });
    };

    const postEdit = sammyContext => {
        const offerId = sammyContext.params.offerId;
        console.log('Editing offer with id ' + offerId);

        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(arrayOfOfferObjects => {
                const offerToEdit = arrayOfOfferObjects.filter(o => o._id === offerId)[0];

                const product = sammyContext.params.product;
                const description = sammyContext.params.description;
                const price = sammyContext.params.price;
                const pictureUrl = sammyContext.params.pictureUrl;

                const editedOffer = {
                    product,
                    description,
                    price,
                    pictureUrl,
                };

                console.log('Validating object!');
                if (!isValidObject(editedOffer)) {
                    return;
                }

                console.log('Object is valid!');

                kinveyRequester.sendPutRequestWithAuthTokenRecordId(editedOffer, offerId)
                    .then(sammyContext.redirect('#/home'));
                //redirecting to dashboard makes it look like the edit did not happen. But it does happen.
                //Async funcs are messing things up
            });
    };

    const getDeleteOffer = sammyContext => {
        const offerId = sammyContext.params.offerId;

        kinveyRequester.sendGetRequestWithAuthToken()
            .then(response => response.json())
            .then(arrayOfOfferObjects => {
                const offerToDelete = arrayOfOfferObjects.filter(o => o._id === offerId)[0];

                loadPage.call(sammyContext, hbsFilePaths.deleteOffer, offerToDelete);
            });
    };

    const postDeleteOffer = sammyContext => {
        const offerId = sammyContext.params.offerId;
        kinveyRequester.sendDeleteRequestWithAuthTokenRecordId(offerId)
            .then(() => {
                sammyContext.redirect('#/home');
            })
    };

    const getProfile = sammyContext => {
        loadPage.call(sammyContext, hbsFilePaths.profile);
    };

    return {
        getHome,
        getLogin,
        postLogin,
        getRegister,
        postRegister,
        getLogout,
        getCreateOffer,
        postCreateOffer,
        getDashboard,
        getOfferDetails,
        getEdit,
        postEdit,
        getDeleteOffer,
        postDeleteOffer,
        getProfile,
    }
})();

