function attachEvents() {
    const selectElementPosts = document.getElementById('posts');
    const buttonElementViewPost = document.getElementById('btnViewPost');
    const buttonElementLoadPosts = document.getElementById('btnLoadPosts');
    const h1ElementPostTitle = document.getElementById('post-title');
    const ulElementPostBody = document.getElementById('post-body');
    const ulElementPostComments = document.getElementById('post-comments');

    const optionElementTemplate = document.createElement('option');
    const liElementTemplate = document.createElement('li');

    const createElement = (template, textContent, value, id) => {
        const result = template.cloneNode(true);

        if (textContent) {
            result.textContent = textContent;
        }

        if (value) {
            result.value = value;
        }

        if (id) {
            result.id = id;
        }

        return result;
    };

    const initialUrl = 'https://blog-apps-c12bf.firebaseio.com/';
    const postsUrl = initialUrl + 'posts.json';
    const commentsUrl = initialUrl + 'comments.json';

    buttonElementLoadPosts.addEventListener('click', () => {
        fetch(postsUrl)
            .then(response => response.json())
            .then(dataInJsonFormat => {
                library.removeAllChildren(selectElementPosts);
                const optionsFragment = document.createDocumentFragment();

                for (const key of Object.keys(dataInJsonFormat)) {
                    const title = dataInJsonFormat[key].title;
                    const newOptionElement = createElement(optionElementTemplate, title, key);
                    optionsFragment.appendChild(newOptionElement);
                }

                selectElementPosts.appendChild(optionsFragment);
            }).catch(err => console.error(err));
    });

    buttonElementViewPost.addEventListener('click', () => {
        const postPromise = fetch(postsUrl)
            .then(response => response.json())
            .then(dataInJsonFormat => {
                const selectedIndex = selectElementPosts.selectedIndex;
                const optionValue = selectElementPosts.options[selectedIndex].value;
                const post = dataInJsonFormat[optionValue];

                h1ElementPostTitle.textContent = post.title;
                ulElementPostBody.textContent = post.body;

                return post.id;
            });

        const commentPromise = fetch(commentsUrl)
            .then(response => response.json());

        Promise.all([postPromise, commentPromise]).then(valuesArray => {
            const postId = valuesArray[0];
            const allCommentsObject = valuesArray[1];
            const liElementsFragment = document.createDocumentFragment();
            library.removeAllChildren(ulElementPostComments);

            for (const key of Object.keys(allCommentsObject)) {
                if (allCommentsObject[key].postId !== postId) {
                    continue;
                }

                const newLiElement = createElement(liElementTemplate, allCommentsObject[key].text, null, postId);
                liElementsFragment.appendChild(newLiElement);
            }

            ulElementPostComments.appendChild(liElementsFragment);
        })
    });


}

attachEvents();