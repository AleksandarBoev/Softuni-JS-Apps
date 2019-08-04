const sammyApp = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/hello', function () {
        this.loadPartials({
            firstPartial: './templates/header.hbs',
            secondPartial: './templates/random.hbs',
            thirdPartial: './templates/footer.hbs'
        }).then(function () {
            this.partial('./templates/page-template.hbs', {name: 'Aleksandar', age: 28});
        });
    });

    this.get('#/goodbye', function() {
        console.log('Noo goodbye, only hello!');
        this.redirect('#/hello');
    });

    this.get('', function() {
        this.redirect('#/hello');
        console.log('Welcome to the app!');
    })
});

(() => sammyApp.run('#/hello'))();