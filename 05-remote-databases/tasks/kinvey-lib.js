const kinveyLib = (() => {
    const buildHeadersObj = (username, password) => {
        return {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
            credentials: "include",
        };
    };

    return {
        /**
         *
         * @param getUrl {String} needs to in format "https://baas.kinvey.com/appdata/{appId}/{collectionName}"
         * @param username {String}
         * @param password {String}
         * @returns {Promise<Response>}
         */
        sendGetRequest: (getUrl, username, password) => {
            return fetch(getUrl, {
                method: 'GET',
                headers: buildHeadersObj(username, password),
            });
        },
        /**
         * Makes a POST request to a kinvey server and creates a new record
         * @param postUrl {String} needs to in format "https://baas.kinvey.com/appdata/{appId}/{collectionName}"
         * @param username {String}
         * @param password {String}
         * @param object {Object}
         * @returns {Promise<Response>}
         */
        sendPostRequest: (postUrl, username, password, object) => {
            return fetch(postUrl, {
                method: 'POST',
                body: JSON.stringify(object),
                headers: buildHeadersObj(username, password),
            });
        },
        /**
         *
         * @param putUrl {String} needs to be in format "https://baas.kinvey.com/appdata/{appId}/{collectionName}/{recordId}"
         * @param username
         * @param password
         * @param object {Object}
         * @returns {Promise<Response>}
         */
        sendPutRequest: (putUrl, username, password, object) => {
            return fetch(putUrl, {
                method: 'PUT',
                body: JSON.stringify(object),
                headers: buildHeadersObj(username, password),
            })
        },

        /**
         *
         * @param deleteUrl {String} needs to be in format "https://baas.kinvey.com/appdata/{appId}/{collectionName}/{recordId}"
         * @param username {String}
         * @param password {String}
         * @returns {Promise<Response>}
         */
        sendDeleteRequest: (deleteUrl, username, password) => {
            return fetch(deleteUrl, {
                method: 'DELETE',
                headers: buildHeadersObj(username, password),
            })
        }
    };
})();