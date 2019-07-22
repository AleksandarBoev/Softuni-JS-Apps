function resolveAfter2Seconds() {
    console.log('Working...');

    const promise = new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });

    console.log('Still working...');
    return promise;
}

async function asyncCall() {
    console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
    console.log('Hello!');
}

asyncCall();
/*
calling
Working...
Still working...
resolved
Hello!
 */