(function (scope) {
    const printGreeting = () => console.log('Hello!');

    const getSpecialNumber = () => 6;

    const sumNumbers = (num1, num2) => num1 + num2;

    let someVariable = 'some variable!';

    const someObj = {
        name: 'Aleksandar',
        age: 23,
    };
    const uselessFunc = () => console.log('wazaaa');

    scope.randomStuffLib = {
        printGreeting,
        getSpecialNumber,
        sumNumbers,
        someVariable,
        someObj};
})(window);

const fatArrowLib = (() => {
    const printGoodbye = () => console.log('GoodBye');

    return {
        printGoodbye,
    }
})();