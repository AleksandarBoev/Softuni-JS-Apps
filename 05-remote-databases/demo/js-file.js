const doStuff = (() => {
    localStorage.removeItem('authToken');

    const elements = {
        //get
        buttonGetBooks: document.getElementById('get-books'),
        ulAllBooks: document.getElementById('all-books'),
        //post
        inputTitlePost: document.getElementById('title'),
        inputAuthorPost: document.getElementById('author'),
        inputIsbnPost: document.getElementById('isbn'),
        buttonPost: document.getElementById('create'),
        //delete
        inputDelete: document.getElementById('delete'),
        buttonDelete: document.getElementById('delete-btn'),
        //update
        inputTitleUpdate: document.getElementById('title-update'),
        inputAuthorUpdate: document.getElementById('author-update'),
        inputIsbnUpdate: document.getElementById('isbn-update'),
        inputUpdateId: document.getElementById('update-id'),
        buttonUpdate: document.getElementById('update-btn'),
        //login logout
        buttonLogin: document.getElementById('login'),
        buttonPostCustom: document.getElementById('post-custom-object'),
        buttonLogout: document.getElementById('logout'),
        buttonGetBooksAuth: document.getElementById('get-books-auth'),
        ulAllBooksAuth: document.getElementById('all-books-auth'),
    };

    const baseUrl = 'https://baas.kinvey.com/appdata';
    const appKey = 'kid_ry_vkGIGB';
    const collectionName = 'books';
    const postUrl = `${baseUrl}/${appKey}/${collectionName}`;

    const username = 'guest';
    const password = 'guest';
    const basicAuthorizationString = 'Basic ' + btoa(`${username}:${password}`);
    const headersObj = {
        'Content-Type': 'application/json',
        Authorization: basicAuthorizationString,
        credentials: "include",
    };

    elements.buttonGetBooks.addEventListener('click', () => {
        fetch(`${baseUrl}/${appKey}/${collectionName}`, {
            method: 'GET',
            headers: headersObj,
        })
            .then(response => response.json())
            .then(arrayOfBooks => {
                elements.ulAllBooks.innerHTML = ''; //empty it
                const fragment = document.createDocumentFragment();

                for (const book of arrayOfBooks) {
                    const text = `Title: ${book.title} | Author: ${book.author} | ISBN: ${book.isbn} | Entity id: ${book._id}`;
                    const newLiElement = document.createElement('li');
                    newLiElement.textContent = text;
                    fragment.appendChild(newLiElement);
                }

                elements.ulAllBooks.appendChild(fragment);
            })
    });

    elements.buttonPost.addEventListener('click', () => {
        const newBookObj = {
            title: elements.inputTitlePost.value,
            author: elements.inputAuthorPost.value,
            isbn: elements.inputIsbnPost.value,
        };

        fetch(postUrl, {
                method: 'POST',
                body: JSON.stringify(newBookObj),
                headers: headersObj,
            }
        ).catch(err => console.error(err));
    });

    elements.buttonDelete.addEventListener('click', () => {
        const id = elements.inputDelete.value;

        fetch(`${baseUrl}/${appKey}/${collectionName}/${id}`, {
                method: 'DELETE',
                headers: headersObj,
            }
        )
    });

    elements.buttonUpdate.addEventListener('click', () => {
        const id = elements.inputUpdateId.value;

        const updatedBook = {
            title: elements.inputTitleUpdate.value,
            author: elements.inputAuthorUpdate.value,
            isbn: elements.inputIsbnUpdate.value,
        };

        fetch(`${baseUrl}/${appKey}/${collectionName}/${id}`, {
            method: 'PUT',
            headers: headersObj,
            body: JSON.stringify(updatedBook),
        })
    });

    elements.buttonLogin.addEventListener('click', () => {
        const username = 'guest';
        const password = 'guest';
        const loginUrl = `https://baas.kinvey.com/user/${appKey}/login`;
        const bodyLogin = {
            username,
            password,
        };

        fetch(loginUrl, {
            method: 'POST',
            headers: {
                credentials: 'include',
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa(`${username}:${password}`),
            },
            body: JSON.stringify(bodyLogin),
        }).then(response => response.json()
        ).then(jsonResponse => {
            console.log(jsonResponse);
            localStorage.setItem('authToken', jsonResponse._kmd.authtoken);
            console.log('Login successful! Current auth token: ' + jsonResponse._kmd.authtoken);
        }).catch(err => console.error(err));
    });

    elements.buttonPostCustom.addEventListener('click', () => {
        const customObj = {
            title: 'Some title',
            author: 'Some author',
            isbn: 'Some isbn',
        };

        const postUrl = `${baseUrl}/${appKey}/${collectionName}`;
        fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
                Authorization: 'Kinvey ' + localStorage.getItem('authToken'),
            },
            body: JSON.stringify(customObj),
        }).then(response => {
            if (response.status === 401) {
                throw Error('Unauthorized entry! Stahp!');
            }
        }).catch(err => console.log(err.message));
    });

    elements.buttonLogout.addEventListener('click', () => {
        const url = `https://baas.kinvey.com/user/${appKey}/_logout`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Kinvey ' + localStorage.getItem('authToken'),
            }
        }).then(response => {
            console.log(response);
        })
    });

    elements.buttonGetBooksAuth.addEventListener('click', () => {
        elements.ulAllBooksAuth.innerHTML = ''; //empty it

        fetch(`${baseUrl}/${appKey}/${collectionName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Kinvey ' + localStorage.getItem('authToken'),
                credentials: "include",
            },
        })
            .then(response => {
                if (response.status >= 400) {
                    throw Error('Auth token is missing or invalid! It could be invalid if: you logged out or too much time has passed');
                }

                return response.json();
            })
            .then(arrayOfBooks => {
                const fragment = document.createDocumentFragment();

                for (const book of arrayOfBooks) {
                    const text = `Title: ${book.title} | Author: ${book.author} | ISBN: ${book.isbn} | Entity id: ${book._id}`;
                    const newLiElement = document.createElement('li');
                    newLiElement.textContent = text;
                    fragment.appendChild(newLiElement);
                }

                elements.ulAllBooksAuth.appendChild(fragment);
            }).catch(err => console.log(err.message));
    });

})();
