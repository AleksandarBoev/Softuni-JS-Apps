var resolveAfter6Seconds = function() {
    console.log("starting slow promise");
    return new Promise(resolve => {
        setTimeout(function() {
            resolve("slow");
            console.log("slow promise is done");
        }, 6000);
    });
};

var resolveAfter3Seconds = function() {
    console.log("starting fast promise");
    return new Promise(resolve => {
        setTimeout(function() {
            resolve("fast");
            console.log("faster promise is done");
        }, 3000);
    });
};

var sequentialStart = async function() {
    console.log('==SEQUENTIAL START==');

    // 1. Execution gets here almost instantly
    const slow = await resolveAfter6Seconds();
    console.log(slow); // 2. this runs 2 seconds after 1.

    const fast = await resolveAfter3Seconds();
    console.log(fast); // 3. this runs 3 seconds after 1.
}

var concurrentStart = async function() {
    console.log('==CONCURRENT START with await==');
    const slow = resolveAfter6Seconds(); // starts timer immediately (prints "starting slow promise")
    const fast = resolveAfter3Seconds(); // starts timer immediately (prints "starting fast promise")

    // 1. Execution gets here almost instantly
    console.log(await slow); //
    console.log(await fast); //
}

var concurrentPromise = function() {
    console.log('==CONCURRENT START with Promise.all==');
    return Promise.all([resolveAfter6Seconds(), resolveAfter3Seconds()]).then((messages) => {
        console.log(messages[0]); // slow
        console.log(messages[1]); // fast
    });
}

var parallel = async function() {
    console.log('==PARALLEL with await Promise.all==');

    // Start 2 "jobs" in parallel and wait for both of them to complete
    await Promise.all([
        (async()=>console.log(await resolveAfter6Seconds()))(),
        (async()=>console.log(await resolveAfter3Seconds()))()
    ]);
}




// This function does not handle errors. See warning below!
var parallelPromise = function() {
    console.log('==PARALLEL with Promise.then==');
    resolveAfter6Seconds().then((message)=>console.log(message));
    resolveAfter3Seconds().then((message)=>console.log(message));
}

// sequentialStart(); // after 2 seconds, logs "slow", then after 4 more second, "fast"

/*
==SEQUENTIAL START==
starting slow promise
slow promise is done
slow
starting fast promise
faster promise is done
fast
 */

// wait above to finish
// concurrentStart();

/*
==CONCURRENT START with await==
starting slow promise
starting fast promise
faster promise is done
slow promise is done
slow
fast
 */

// wait again
// concurrentPromise();

// wait again
parallel(); // truly parallel: after 1 second, logs "fast", then after 1 more second, "slow"

// wait again
// setTimeout(parallelPromise, 13000); // same as parallel