//GazeButton.js

//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject
//@input SceneObject activatedObject

//@input SceneObject[] objectsToDisable
//@input SceneObject[] enableObjects
//@input Component.ScriptComponent[] scriptsToEnable
//@input Component.ScriptComponent[] disableScripts


//@input float lookThreshold = 0.9
//@input float loadTime = 1.0
//@input Component.ScriptComponent countdownScript



var wasLooking = false;
var isLoading = false;
var loadTimer = 0;

//stability buffer
var lookAwayTimer = 0;
var lookAwayThreshold = 0.15;
var ownsCountdown = false;

if (global.activeLoader === undefined) {
    global.activeLoader = null;
}

//----------------------------------
//CHECK LOOKING
//----------------------------------

function isLookingAt() {

    var camTransform = script.camera.getTransform();
    var targetTransform = script.target.getTransform();

    var camPos = camTransform.getWorldPosition();
    var camForward = camTransform.forward;

    var targetPos = targetTransform.getWorldPosition();

    var dirToTarget = targetPos.sub(camPos).normalize();

    //Lens Studio camera needs to be -1 as in the lookingaway script
    var dot = camForward.dot(dirToTarget) * -1;

    return dot > script.lookThreshold;

}

//Function to reference
function activateButton() {

    print("button activated");

            script.loadingObject.enabled = false;
            if (global.activeLoader === script.loadingObject) {
                global.activeLoader = null;
            }

            //disables old template
            for (var i = 0; i < script.objectsToDisable.length; i++) {
                if (script.objectsToDisable[i]) {
                    script.objectsToDisable[i].enabled = false;
                }
            }

            //diables scripts so no loading circke appears once the close button is hit
            for (var i = 0; i < script.scriptsToEnable.length; i++) {
                if (script.scriptsToEnable[i]) {
                    script.scriptsToEnable[i].enabled = false;
                }
            }
            // if (script.objectToDisable) {
            //     script.objectToDisable.enabled = false;
            //     script.objectToDisable2.enabled = false;
            //     script.objectToDisable3.enabled = true; //lights go back on
            //      //buttonloader
            //     script.rightButtonScript.enabled = false;
            //     script.leftButtonScript.enabled = false;
            //     script.mainButtonScript.enabled = false;
            //     script.lifeButtonScript.enabled = false;
            //     script.insideButtonScript.enabled = false;
            //     script.playButtonScript.enabled = false;
            //     script.closeButtonScript.enabled = false;
            // }
            
            //enables new template
            script.activatedObject.enabled = true;
            //enables lighths
            for (var i = 0; i < script.enableObjects.length; i++) {
                if (script.enableObjects[i]) {
                    script.enableObjects[i].enabled = true;
                }
            }

            for (var i = 0; i < script.disableScripts.length; i++) {
                script.disableScripts[i].enabled = false;
            }

            isLoading = false;
            ownsCountdown = false;
}
//----------------------------------
//UPDATE LOOP
//----------------------------------

script.createEvent("UpdateEvent").bind(function(eventData) {

    var dt = eventData.getDeltaTime();

    var isLooking = isLookingAt();

    //-------------------------
    //START LOOKING
    //-------------------------

    if (!wasLooking && isLooking && !script.activatedObject.enabled) {

    print("started looking at button");

    //disables previous active loader
    if (global.activeLoader && global.activeLoader !== script.loadingObject) {
        global.activeLoader.enabled = false;
    }

    //sets loader as active
    global.activeLoader = script.loadingObject;

    script.countdownScript.startTimer();

    ownsCountdown = true;

    script.loadingObject.enabled = true;

    isLoading = true;

    loadTimer = 0;
}


    //-------------------------
    //LOADING
    //-------------------------

    if (isLooking && isLoading && !script.activatedObject.enabled) {

        loadTimer += dt;

        if (loadTimer >= script.loadTime) {

            activateButton();
        }
    }


    // -------------------------
    //LOOK AWAY
    // -------------------------

    if (!isLooking) {

        lookAwayTimer += dt;
        
        if (ownsCountdown) { 
            script.countdownScript.stopTimer();
            ownsCountdown = false; 
            }

        if (lookAwayTimer >= lookAwayThreshold) {

            //resets loading only if not activated yet
            if (!script.activatedObject.enabled) {

                script.loadingObject.enabled = false;
                if (global.activeLoader === script.loadingObject) {
                    global.activeLoader = null;
                }

                isLoading = false;

                loadTimer = 0;
            }
        }

    } else {

        lookAwayTimer = 0;
    }

    wasLooking = isLooking;
});
script.activateButton = activateButton;