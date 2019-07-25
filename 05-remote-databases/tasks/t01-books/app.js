(function () {
    const initialElements = {
        buttonLoadBooks: document.getElementById('loadBooks'),
        tableBody: document.getElementsByTagName('tbody')[0],
        form: document.getElementsByTagName('form')[0],
        formElements: {
            //heading: this.form.getElementsByTagName('h3')[0], //does not work
            heading: document.querySelector('form h3'),
            inputTitle: document.getElementById('title'),
            inputAuthor: document.getElementById('author'),
            inputIsbn: document.getElementById('isbn'),
            buttonSubmit: document.getElementById('form-submit'),
            buttonConfirmEdit: document.getElementById('form-edit'),
            buttonCancel: document.getElementById('form-cancel'),
        }
    };

    const tableRowGenerator = (() => {
        const tableRowTemplate = document.createElement('tr');
        const tableDataTitle = domLib.createElement('td', 'title');
        const tableDataAuthor = domLib.createElement('td', 'author');
        const tableDataIsbn = domLib.createElement('td', 'isbn');
        const tableDataButtonContainer = document.createElement('td');
        const buttonEdit = domLib.createElement('button', 'edit');
        buttonEdit.textContent = 'Edit';
        const buttonDelete = domLib.createElement('button', 'delete');
        buttonDelete.textContent = 'Delete';

        tableDataButtonContainer.appendChild(buttonEdit);
        tableDataButtonContainer.appendChild(buttonDelete);

        [tableDataTitle, tableDataAuthor, tableDataIsbn, tableDataButtonContainer]
            .forEach(e => tableRowTemplate.appendChild(e));

        return {
            /**
             *
             * @param id Generated id from kinvey
             * @param title
             * @param author
             * @param isbn
             * @returns {Node}
             */
            generate: (id, title, author, isbn) => {
                const result = tableRowTemplate.cloneNode(true);
                result.setAttribute('kinvey-id', id);

                result.getElementsByClassName('title')[0].textContent = title;
                result.getElementsByClassName('author')[0].textContent = author;
                result.getElementsByClassName('isbn')[0].textContent = isbn;

                return result;
            }
        }
    })();

    const loadBooks = () => {
        kinveyLib.sendGetRequest(`${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/books`, kinveyInformation.username, kinveyInformation.password)
            .then(response => response.json())
            .then(arrayOfBookObjects => {
                domLib.removeAllChildren(initialElements.tableBody);
                const tableRowsFragment = document.createDocumentFragment();

                arrayOfBookObjects.forEach(book => {
                    const newTableRow = tableRowGenerator.generate(book._id, book.title, book.author, book.isbn);
                    tableRowsFragment.appendChild(newTableRow);
                });

                initialElements.tableBody.appendChild(tableRowsFragment);
            });
    };

    initialElements.buttonLoadBooks.addEventListener('click', () => {
        loadBooks();
    });

    initialElements.formElements.buttonSubmit.addEventListener('click', ev => {
        ev.preventDefault(); //stop from reloading the page

        const newBookObj = {
            title: domLib.popInputValue(initialElements.formElements.inputTitle),
            author: domLib.popInputValue(initialElements.formElements.inputAuthor),
            isbn: domLib.popInputValue(initialElements.formElements.inputIsbn),
        };

        const postUrl = `${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/books`;
        kinveyLib.sendPostRequest(postUrl, kinveyInformation.username, kinveyInformation.password, newBookObj)
            .then(() => {
                loadBooks();
            });
    });

    const switchToEdit = node => {
        initialElements.formElements.heading.textContent = 'EDIT';
        initialElements.formElements.buttonSubmit.style.display = 'none';
        initialElements.formElements.buttonConfirmEdit.style.display = 'inline-block';
        initialElements.formElements.buttonCancel.style.display = 'inline-block';

        initialElements.formElements.inputTitle.value = node.getElementsByClassName('title')[0].textContent;
        initialElements.formElements.inputAuthor.value = node.getElementsByClassName('author')[0].textContent;
        initialElements.formElements.inputIsbn.value = node.getElementsByClassName('isbn')[0].textContent;

        initialElements.form.setAttribute('kinvey-id', node.getAttribute('kinvey-id'));
    };

    const switchToForm = () => {
        initialElements.formElements.heading.textContent = 'FORM';
        initialElements.formElements.buttonSubmit.style.display = 'block';
        initialElements.formElements.buttonConfirmEdit.style.display = 'none';
        initialElements.formElements.buttonCancel.style.display = 'none';
    };

    initialElements.tableBody.addEventListener('click', ev => {
        if (ev.target.tagName === 'BUTTON') {
            const buttonPressed = ev.target;
            const tableRow = buttonPressed.parentNode.parentNode;

            if (buttonPressed.classList.contains('edit')) {
                switchToEdit(tableRow);
            } else if (buttonPressed.classList.contains('delete')) {
                const recordId = tableRow.getAttribute('kinvey-id');
                tableRow.remove();

                const deleteUrl = `${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/books/${recordId}`;
                kinveyLib.sendDeleteRequest(deleteUrl, kinveyInformation.username, kinveyInformation.password);
            }
        }
    });

    initialElements.formElements.buttonConfirmEdit.addEventListener('click', ev => {
        ev.preventDefault(); //stop from reloading the page

        const editedBook = {
            title: domLib.popInputValue(initialElements.formElements.inputTitle),
            author: domLib.popInputValue(initialElements.formElements.inputAuthor),
            isbn: domLib.popInputValue(initialElements.formElements.inputIsbn),
        };

        const id = initialElements.form.getAttribute('kinvey-id');
        const putUrl = `${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/books/${id}`;
        switchToForm();

        kinveyLib.sendPutRequest(putUrl, kinveyInformation.username, kinveyInformation.password, editedBook)
            .then(() => {
                loadBooks();
            })
    });

    initialElements.formElements.buttonCancel.addEventListener('click', ev => {
        ev.preventDefault(); //stop from reloading the page

        initialElements.formElements.inputTitle.value = '';
        initialElements.formElements.inputAuthor.value = '';
        initialElements.formElements.inputIsbn.value = '';
        switchToForm();
    });
})();
