const loadRepos = (function () {
    const inputElementUsername = document.querySelector('#username');
    const ulElementRepos = document.querySelector('#repos');
    const liElementRepo = document.createElement('li');

    const aElementRepo = document.createElement('a');
    liElementRepo.appendChild(aElementRepo);

    const createRepoLiElement = (repoUrl, repoName) => {
        const result = liElementRepo.cloneNode(true);
        result.querySelector('a').href = repoUrl;
        result.querySelector('a').textContent = repoName;

        return result;
    };

    const generateUserReposUrl = username => `https://api.github.com/users/${username}/repos`;

    function loadRepos() {
        while (ulElementRepos.lastChild) {
            ulElementRepos.removeChild(ulElementRepos.lastChild);
        }

        fetch(generateUserReposUrl(inputElementUsername.value))
            .then(response => response.json())
            .then(arrayOfObjects => {
                for (const currentObject of arrayOfObjects) {
                    const repoUrl = currentObject.html_url;
                    const repoFullName = currentObject.full_name;
                    const newLiElement = createRepoLiElement(repoUrl, repoFullName);
                    ulElementRepos.appendChild(newLiElement);
                }
            })
            .catch(error => {
                console.log(error);
                console.log('Not found');
            })
    }

    return loadRepos;
})();

//TODO debug to see if optimization is done correctly!