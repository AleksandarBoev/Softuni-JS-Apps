async function returnMessageAfterTime () {
    const time1 = 4500;
    let time1Result;

    await setTimeout(() => {
            console.log('Just waited ' + time1 / 1000 + ' seconds');
            time1Result = 'aaaa';
        }, time1);
    console.log(time1Result);

    const time2 = 2000;

    await setTimeout(() => {
        console.log('Just waited ' + time2 / 1000 + ' seconds');
    }, time2);
}

returnMessageAfterTime(); //logs 2 sec wait, then 4.5
