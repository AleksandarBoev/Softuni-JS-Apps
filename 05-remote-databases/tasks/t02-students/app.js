(function () {
    const collectionName = 'students';

    const elements = {
        tableBody: document.getElementsByTagName('tbody')[0],
        buttonLoadStudents: document.getElementById('load-students'),
        buttonCreateStudent: document.getElementById('create-student'),
        divForm: document.getElementById('form'),
        formElements: {
            inputFirstName: document.getElementById('first-name'),
            inputLastName: document.getElementById('last-name'),
            inputFacultyNumber: document.getElementById('faculty-number'),
            inputGrade: document.getElementById('grade'),
            divConfirmCreate: document.getElementById('confirm-create'),
            divCancel: document.getElementById('cancel'),
        },
    };

    const tableRowGenerator = (() => {
        const tableRowTemplate = document.createElement('tr');
        const tableDataId = domLib.createElement('td', 'id');
        const tableDataFirstName = domLib.createElement('td', 'first-name');
        const tableDataLastName = domLib.createElement('td', 'last-name');
        const tableDataFacultyNumber = domLib.createElement('td', 'faculty-number');
        const tableDataGrade = domLib.createElement('td', 'grade');

        [tableDataId, tableDataFirstName, tableDataLastName, tableDataFacultyNumber, tableDataGrade]
            .forEach(e => tableRowTemplate.appendChild(e));

        return {
            generate: (id, firstName, lastName, facultyNumber, grade) => {
                const result = tableRowTemplate.cloneNode(true);

                result.getElementsByClassName('id')[0].textContent = id;
                result.getElementsByClassName('first-name')[0].textContent = firstName;
                result.getElementsByClassName('last-name')[0].textContent = lastName;
                result.getElementsByClassName('faculty-number')[0].textContent = facultyNumber;
                result.getElementsByClassName('grade')[0].textContent = grade;

                return result;
            }
        }
    })();

    const loadStudents = () => {
        elements.tableBody.innerHTML = '';
        const getUrl = `${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/${collectionName}`;
        kinveyLib.sendGetRequest(getUrl, kinveyInformation.username, kinveyInformation.password)
            .then(response => response.json())
            .then(arrayOfStudents => {
                const fragment = document.createDocumentFragment();
                arrayOfStudents = arrayOfStudents.sort((s1, s2) => s1._id.localeCompare(s2._id));

                for (const student of arrayOfStudents) {
                    const newTableRow = tableRowGenerator.generate(
                        student._id,
                        student['first_name'],
                        student['last_name'],
                        student['faculty_number'],
                        student.grade
                    );

                    fragment.appendChild(newTableRow);
                }

                elements.tableBody.appendChild(fragment);
            })
    };

    elements.buttonLoadStudents.addEventListener('click', () => {
        loadStudents();
    });

    elements.buttonCreateStudent.addEventListener('click', () => {
        elements.divForm.style.display = 'block';
    });

    elements.formElements.divConfirmCreate.addEventListener('click', () => {
        elements.divForm.style.display = 'none';

        const newStudentObj = {
            'first_name': domLib.popInputValue(elements.formElements.inputFirstName),
            'last_name': domLib.popInputValue(elements.formElements.inputLastName),
            'faculty_number': domLib.popInputValue(elements.formElements.inputFacultyNumber),
            grade: domLib.popInputValue(elements.formElements.inputGrade),
        };

        const postUrl = `${kinveyInformation.baseUrl}/${kinveyInformation.appKey}/${collectionName}`;
        kinveyLib.sendPostRequest(postUrl, kinveyInformation.username, kinveyInformation.password, newStudentObj)
            .then(() => {
                loadStudents()
            });
    });

    elements.formElements.divCancel.addEventListener('click', () => {
        elements.divForm.style.display = 'none';
        [elements.formElements.inputGrade, elements.formElements.inputLastName, elements.formElements.inputFirstName]
            .forEach(e => {
                e.value = ''
            });
    });
})();