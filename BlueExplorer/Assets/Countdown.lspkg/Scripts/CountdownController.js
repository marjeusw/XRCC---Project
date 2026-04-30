// CountdownController.js
// Version: 0.0.1
// Event: Initialized
// Description: Create a countdown timer.
// Pack: Refinement Pack

//To control the timer from external scripts:
//Start the timer:
//script.startTimer();

//Pause timer:
//script.pauseTimer();

//Stop timer:
//script.stopTimer();

//Global functions:
//global.countdownController.startTimer();
//global.countdownController.pauseTimer();
//global.countdownController.stopTimer();

//@input float totalTime = 10 {"label":"Countdown Time"}

//@ui{"widget":"separator"}
//@input bool playOnStart

//@ui{"widget":"separator"}

//@input Component.ScreenTransform countdownRotation {"label":"Clock Indicator"}

//my edit
//@input SceneObject lookText {"label":"Text Look"}
//@input SceneObject clock {"label":"Clock"}
//@input Component.ScreenTransform occludeCountdownRotation {"label":"Occluder"}

//@ui{"widget":"separator"}
//@ui{"label":"On Timer End:"}
//@input bool callBehavior
//@input string behaviorTrigger {"showIf":"callBehavior"}
//@input bool callFunction
//@input Component.ScriptComponent callbackScript {"showIf":"callFunction"}
//@input string callbackFunction {"showIf":"callFunction"}

var currentTime = 0;
var countdownStarted = false;
var fillAmount = 0;

initiate();

function initiate() {
    reset();    
    script.createEvent("UpdateEvent").bind(onUpdate);
    //script.countdownText.text = currentTime.toFixed(1).toString();
}

if (script.playOnStart) {
    startTimer();
} else {
}

function onUpdate() {
    
    if (countdownStarted) {
        currentTime -= getDeltaTime();
        if (currentTime <= 0) {
            countdownCompleted();
            currentTime = 0;
            countdownStarted = false;
        }
        
        fillAmount = currentTime / script.totalTime;
        
        // if (script.countdownText) {
        //     script.countdownText.text = currentTime.toFixed(1).toString();        
        // }
        
        var rotAngle = fillAmount * 2 * Math.PI;        
        
        if (script.countdownRotation) {
            script.countdownRotation.rotation = quat.fromEulerAngles(0,0,rotAngle);
            script.occludeCountdownRotation.rotation = quat.fromEulerAngles(0,0,rotAngle);
        }
        
        // if (script.countdownBar) {
        //     script.countdownBar.scale = new vec3((1 - fillAmount),1,1);
        // }

    }    
}  

function reset() {
    currentTime = script.totalTime;
}

function startTimer() {
    //my edit
    disableText();
    countdownStarted = true;
    currentTime = script.totalTime;
}

//my edit
function disableText() {
    script.lookText.enabled = false;
    //script.clock.enabled = true; //doing this in the Looking away script

}

//for just the buttons
function startTimerButton() {
    countdownStarted = true;
    currentTime = script.totalTime;
}


function pauseTimer() {
    countdownStarted = false;
}

function stopTimer() {
    countdownStarted = false;
}

function countdownCompleted() {
    if (script.callBehavior && script.behaviorTrigger != "") {
        if (global.behaviorSystem) {
            global.behaviorSystem.sendCustomTrigger(script.behaviorTrigger);
            
        } else {
            print("CountdownController, ERROR: No Behavior script in the scene.");
        }
    }
    
    if (script.callFunction) {
        if (script.callbackScript && script.callbackFunction != "") {
            script.callbackScript[script.callbackFunction]();
        }
    }

}

script.startTimer = startTimer;
script.pauseTimer = pauseTimer;
script.stopTimer = stopTimer;

global.countdownController = script;