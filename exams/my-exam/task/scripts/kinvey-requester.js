/*
    Easy to use requester, based on the PaaS "Kinvey". Unreliable in terms of security

    Most functions have default values for parameters for ease of use. To change them, see "appCredentials" and "defaultUrls".
    Default behaviour of requests, using "authToken", relies on sessionStorage.getItem('authToken')
 */
const kinveyRequester = (() => {
    const appCredentials = { //TODO
        appKey: 'kid_SkjdzCRzH',
        appSecret: 'd173dc100fb842f2911f912cf795a352',
        collectionName: 'offers',
    };

    const defaultUrls = {
        getUrl: `https://baas.kinvey.com/appdata/${appCredentials.appKey}/${appCredentials.collectionName}`,
        postUrl: `https://baas.kinvey.com/appdata/${appCredentials.appKey}/${appCredentials.collectionName}`,
        putUrl: recordId => `https://baas.kinvey.com/appdata/${appCredentials.appKey}/${appCredentials.collectionName}/${recordId}`,
        deleteUrl: recordId => `https://baas.kinvey.com/appdata/${appCredentials.appKey}/${appCredentials.collectionName}/${recordId}`,
        registerUrl: `https://baas.kinvey.com/user/${appCredentials.appKey}/`,
        loginUrl: `https://baas.kinvey.com/user/${appCredentials.appKey}/login`,
        logoutUrl: `https://baas.kinvey.com/user/${appCredentials.appKey}/_logout`,
    };

    const buildCredentialsHeadersObj = (username, password) => {
        return {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
            credentials: "include",
        };
    };

    /**
     *
     * @param authToken {String} default value is sessionStorage.getItem('authToken')
     */
    const buildAuthTokenHeadersObj = (authToken = sessionStorage.getItem('authToken')) => {
        //If no value is provided and there is no value in sessionStorage, then give a value.
        //Error when sending undefined is "Malformed request" and is harder to debug than "Invalid credentials".
        if (!authToken) {
            authToken = 'randomstring';
        }

        return {
            'Content-Type': 'application/json',
            Authorization: 'Kinvey ' + authToken,
            credentials: "include",
        }
    };

    return {
        /**
         * Registers user. Response contains authToken. To access the authentication token you need to
         * call "._kmd.authtoken" to the ".json()" resolved promise of this promise.
         * @param username {String}
         * @param password {String}
         * @param url needs to be in format "https://baas.kinvey.com/user/{app_key}/"
         * @param appKey {String}
         * @param appSecret {String}
         * @returns {Promise<Response>}
         */
        sendRegisterUserRequest: (username, password,
                                  url = defaultUrls.registerUrl,
                                  appKey = appCredentials.appKey,
                                  appSecret = appCredentials.appSecret) => {
            return fetch(url, {
                method: 'POST',
                headers: buildCredentialsHeadersObj(appKey, appSecret),
                body: JSON.stringify({
                    username,
                    password,
                    numberOfPurchases: 0, //just for this exam
                }),
            });
        },
        /**
         *
         * @param username {String}
         * @param password {String}
         * @param url {String} needs to in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}"
         * @returns {Promise<Response>}
         */
        sendGetRequestWithCredentials: (username, password, url = defaultUrls.getUrl) => {
            return fetch(url, {
                method: 'GET',
                headers: buildCredentialsHeadersObj(username, password),
            });
        },
        /**
         * Makes a POST request to a kinvey server and creates a new record
         * @param username {String}
         * @param password {String}
         * @param object {Object} request body
         * @param url {String} needs to in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}"
         * @returns {Promise<Response>}
         */
        sendPostRequestWithCredentials: (username, password, object, url = defaultUrls.postUrl) => {
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(object),
                headers: buildCredentialsHeadersObj(username, password),
            });
        },
        /**
         * Updates an existing record
         * @param username {String}
         * @param password {String}
         * @param object {Object} request body
         * @param url {String} needs to be in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}/{recordId}"
         * @returns {Promise<Response>}
         */
        sendPutRequestWithCredentials: (username, password, object, url) => {
            return fetch(url, {
                method: 'PUT',
                body: JSON.stringify(object),
                headers: buildCredentialsHeadersObj(username, password),
            })
        },
        /**
         * Updates an existing record
         * @param username {String}
         * @param password {String}
         * @param object {Object} request body
         * @param recordId {String} used to build url based on default settings
         * @returns {Promise<Response>}
         */
        sendPutRequestWithCredentialsRecordId: (username, password, object, recordId) => {
            return fetch(defaultUrls.putUrl(recordId), {
                method: 'PUT',
                body: JSON.stringify(object),
                headers: buildCredentialsHeadersObj(username, password),
            })
        },

        /**
         *
         * @param username {String}
         * @param password {String}
         * @param url {String} needs to be in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}/{recordId}"
         * @returns {Promise<Response>}
         */
        sendDeleteRequestWithCredentials: (username, password, url) => {
            return fetch(url, {
                method: 'DELETE',
                headers: buildCredentialsHeadersObj(username, password),
            })
        },
        /**
         *
         * @param username {String}
         * @param password {String}
         * @param recordId {String} used to build url based on default settings
         * @returns {Promise<Response>}
         */
        sendDeleteRequestWithCredentialsRecordId: (username, password, recordId) => {
            return fetch(defaultUrls.deleteUrl(recordId), {
                method: 'DELETE',
                headers: buildCredentialsHeadersObj(username, password),
            })
        },

        /**
         * Logs in user. To access the authentication token you need to
         * call "._kmd.authtoken" to the ".json()" resolved promise of this promise.
         * @param url {String} needs to be in format "https://baas.kinvey.com/user/{appKey}/login"
         * @param username {String}
         * @param password {String}
         * @returns {Promise<Response>} promise, which contains an authentication token
         */
        sendLoginRequest: (username, password, url = defaultUrls.loginUrl) => {
            const bodyLogin = {
                username,
                password,
            };

            return fetch(url, {
                method: 'POST',
                headers: buildCredentialsHeadersObj(username, password),
                body: JSON.stringify(bodyLogin),
            });
        },
        /**
         *
         * @param authToken {String} if not provided, default value will come from sessionStorage.getItem('authToken')
         * @param url {String} needs to in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}"
         * @returns {Promise<Response>}
         */
        sendGetRequestWithAuthToken: (authToken, url = defaultUrls.getUrl) => {
            return fetch(url, {
                method: 'GET',
                headers: buildAuthTokenHeadersObj(authToken),
            });
        },
        /**
         * @param object {Object} request body
         * @param authToken {String}
         * @param url {String} needs to in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}"
         * @returns {Promise<Response>}
         */
        sendPostRequestWithAuthToken: (object, authToken, url = defaultUrls.postUrl) => {
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(object),
                headers: buildAuthTokenHeadersObj(authToken),
            });
        },
        /**
         * Updates an existing record
         * @param object {Object} request body
         * @param authToken {String}
         * @param url {String} needs to be in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}/{recordId}"
         * @returns {Promise<Response>}
         */
        sendPutRequestWithAuthToken: (object, authToken, url) => {
            return fetch(url, {
                method: 'PUT',
                body: JSON.stringify(object),
                headers: buildAuthTokenHeadersObj(authToken),
            })
        },
        /**
         * Updates an existing record
         * @param object {Object} request body
         * @param recordId {String} used to build url based on default settings
         * @param authToken {String}
         * @returns {Promise<Response>}
         */
        sendPutRequestWithAuthTokenRecordId: (object, recordId, authToken) => {
            return fetch(defaultUrls.putUrl(recordId), {
                method: 'PUT',
                body: JSON.stringify(object),
                headers: buildAuthTokenHeadersObj(authToken),
            })
        },
        /**
         *
         * @param authToken {String}
         * @param url {String} needs to be in format "https://baas.kinvey.com/appdata/{app_key}/{collectionName}/{recordId}"
         * @returns {Promise<Response>}
         */
        sendDeleteRequestWithAuthToken: (authToken, url) => {
            return fetch(url, {
                method: 'DELETE',
                headers: buildAuthTokenHeadersObj(authToken),
            })
        },
        /**
         * @param recordId {String} used to build url based on default settings
         * @param authToken {String}
         * @returns {Promise<Response>}
         */
        sendDeleteRequestWithAuthTokenRecordId: (recordId, authToken) => {
            return fetch(defaultUrls.deleteUrl(recordId), {
                method: 'DELETE',
                headers: buildAuthTokenHeadersObj(authToken),
            })
        },
        /**
         *
         * @param authToken {String}
         * @param url {String} needs to be in format https://baas.kinvey.com/user/{appKey}/_logout
         * @returns {Promise<Response>}
         */
        sendLogoutRequest: (authToken, url = defaultUrls.logoutUrl) => {
            return fetch(url, {
                method: 'POST',
                headers: buildAuthTokenHeadersObj(authToken),
            });
        },
    };
})();