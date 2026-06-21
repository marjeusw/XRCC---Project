//@input SceneObject imageTwo

var timeDelay = 1.5;


//async function acting like a coroutine (this way we can have as many img as we want)

function wait(seconds) {
    return new Promise(function(resolve) {
        var delayEvent = script.createEvent("DelayedCallbackEvent");
        delayEvent.bind(resolve);
        delayEvent.reset(seconds);
    });
}

async function runCoroutineSequence() {
    while (true) {
    
        await wait(timeDelay); //wait 2 seconds
        script.imageTwo.enabled = false;
        await wait(timeDelay); //wait 1 more second

        script.imageTwo.enabled = true;
    }
}


runCoroutineSequence();


//in case we need more than one img
//@input SceneObject[] images

// var currentIndex = 0;

// async function runCoroutineSequence() {

//     while (true) {

//         await wait(timeDelay);

//         script.images[currentIndex].enabled = false;

//         currentIndex = (currentIndex + 1) % script.images.length;

//         script.images[currentIndex].enabled = true;
//     }
// }