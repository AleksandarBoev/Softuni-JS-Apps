function attachEvents() {
    const textAreaElementMessages = document.getElementById('messages');
    const inputElementAuthor = document.getElementById('author');
    const inputElementContent = document.getElementById('content');
    const buttonElementSubmit = document.getElementById('submit');
    const buttonElementRefresh = document.getElementById('refresh');

    const messagesUrl = 'https://rest-messanger.firebaseio.com/messanger.json';

    const loadMessages = () => {
        fetch(messagesUrl)
            .then(response => response.json())
            .then(data => {
                textAreaElementMessages.value = '';
                let allMessages = '';
                for (const weirdKey of Object.keys(data)) {
                    const currentMessageObj = data[weirdKey];
                    allMessages += `${currentMessageObj.author}: ${currentMessageObj.content}\n`;
                }

                textAreaElementMessages.value = allMessages.trim();
            }).catch(err => console.log(err));
    };

    loadMessages();

    buttonElementRefresh.addEventListener('click', () => {
        loadMessages();
    });

    buttonElementSubmit.addEventListener('click', () => {
        fetch(messagesUrl, {
            method: 'POST',
            body: JSON.stringify({
                author: inputElementAuthor.value,
                content: inputElementContent.value,
            })
        }).then(() => {
            inputElementAuthor.value = '';
            inputElementContent.value = '';
        })
            .catch(err => console.log(err));
    });
}

attachEvents();