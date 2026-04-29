//GazeButton.js

//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject


//@input float lookThreshold = 0.9
//@input float loadTime = 1.0
//@input Component.ScriptComponent countdownScript
//@input SceneObject frameObject
//@input float followDistance = 60.0
//@input float followSpeed = 5.0

var wasLooking = false;
var isLoading = false;
var loadTimer = 0;
var followEnabled = false;
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

function toggleLook(){
    followEnabled = !followEnabled;
         
           

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

    if (!wasLooking && isLooking && !isLoading) {

    print("started looking at button");
    //print("isLooking: " + isLooking);

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

    if (isLooking && isLoading) {

        loadTimer += dt;

        if (loadTimer >= script.loadTime) {

            print("follow toggled");

            script.loadingObject.enabled = false;

            if (global.activeLoader === script.loadingObject) {
                global.activeLoader = null;
            }

            toggleLook()
        //    followEnabled = !followEnabled;
         
           

        //     isLoading = false;
        //     ownsCountdown = false;
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
            if (isLoading) {

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

//----------------------------------
// FOLLOW CAMERA
//----------------------------------

    if (followEnabled) {

        var camTransform = script.camera.getTransform();

        var camPos = camTransform.getWorldPosition();
        var camForward = camTransform.forward;

        //lens Studio camera forward is inverted
        var targetPos = camPos.add(camForward.uniformScale(-script.followDistance));

        var frameTransform = script.frameObject.getTransform();

        //smooth movement
        var currentPos = frameTransform.getWorldPosition();

        var newPos = vec3.lerp(
        currentPos,
        targetPos,
        eventData.getDeltaTime() * script.followSpeed
        );

        frameTransform.setWorldPosition(newPos);

        //face camera
        var direction = camPos.sub(frameTransform.getWorldPosition()).normalize();

        var rotation = quat.lookAt(direction, vec3.up());

        frameTransform.setWorldRotation(rotation);
    }

    wasLooking = isLooking;
});