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

    this.get('#/random_page_2', function() {
        this.loadPartials({
            firstPartial: './templates/header.hbs',
            secondPartial: './templates/random2.hbs',
            thirdPartial: './templates/footer.hbs'
        }).then(function () {
            this.partial('./templates/page-template.hbs');
        });
    });

    this.get('#/goodbye', function() {
        console.log('Noo goodbye, only hello!');
        this.redirect('#/hello');
        console.log('If you see this, then "redirect" does NOT stop the rest of the function code.');
    });
});

(() => sammyApp.run('#/hello'))();