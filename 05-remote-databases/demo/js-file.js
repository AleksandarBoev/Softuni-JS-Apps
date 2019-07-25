const doStuff = (() => {
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
    })

})();
