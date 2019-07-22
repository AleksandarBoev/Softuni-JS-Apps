const promise1 = new Promise(resolve => {
    setTimeout(() => {
        console.log('promise 1');
        resolve('promise 1 message, 7sec');
    }, 7000)
});

const promise2 = new Promise(resolve => {
    setTimeout(() => {
        console.log('promise 2');
        resolve('promise 2 message, 3.2sec')
    }, 3200)
});

const promise3 = new Promise(resolve => {
    setTimeout(() => {
        console.log('promise 3');
        resolve('promise 3 message, 1.8sec')
    }, 1800)
});

Promise.all([promise1, promise2, promise3]).then(valuesArray => {
    console.log(valuesArray[0]);
    console.log(valuesArray[1]);
    console.log(valuesArray[2]);
});

console.log('Cya');