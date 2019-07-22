function loadCommits() {
    const removeAllChildren = library.removeAllChildren;

    const constructUrl = (username, repo) => `https://api.github.com/repos/${username}/${repo}/commits`;
    const constructLiContent = (username, repo) => `${username}: ${repo}`;

    const liElementTemplate = document.createElement('li');

    const createLiElementByTemplate = (liElementTemplate, textContent) => {
        const result = liElementTemplate.cloneNode(true);
        result.textContent = textContent;
        return result;
    };


    const inputElementUsername = document.getElementById('username');
    const inputElementRepo = document.getElementById('repo');
    const ulElementCommits = document.getElementById('commits');
    const buttonElementLoadCommits = document.getElementsByTagName('button')[0];

    buttonElementLoadCommits.addEventListener('click', () => {
        fetch(constructUrl(inputElementUsername.value, inputElementRepo.value))
            .then(response => response.json())
            .then(arrayOfCommitObjects => {
                removeAllChildren(ulElementCommits);
                arrayOfCommitObjects = arrayOfCommitObjects.map(element => element.commit);

                for (const currentCommit of arrayOfCommitObjects) {
                    const authorName = currentCommit.author.name;
                    const commitMessage = currentCommit.message;

                    const newLiElement =
                        createLiElementByTemplate(liElementTemplate, constructLiContent(authorName, commitMessage));
                    ulElementCommits.appendChild(newLiElement);
                }
            });
    });

}