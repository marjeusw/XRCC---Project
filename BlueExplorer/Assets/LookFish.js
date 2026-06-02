//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject[] enableObjects

//@input float lookThreshold = 0.9

//@input bool autoDisable = true
//@input float disableAfter = 3.0

var timer = 0;
var hasTriggered = false;
var hasCompletedCycle = false;
var waitingToDisable = false;

//----------------------------------
//CHECKS LOOKING
//----------------------------------

function isLookingAt() {

    var camTransform = script.camera.getTransform();
    var targetTransform = script.target.getTransform();

    var camPos = camTransform.getWorldPosition();
    var camForward = camTransform.forward;

    var targetPos = targetTransform.getWorldPosition();

    var dirToTarget = targetPos.sub(camPos).normalize();

    var dot = camForward.dot(dirToTarget) * -1;

    return dot > script.lookThreshold;
}

//----------------------------------
//ENABLES OBJECTS
//----------------------------------

function enableObjects() {

    for (var i = 0; i < script.enableObjects.length; i++) {
        if (script.enableObjects[i]) {
            script.enableObjects[i].enabled = true;
        }
    }

    print("Objects enabled");
}

//----------------------------------
//DISABLES OBJECTS
//----------------------------------

function disableObjects() {

    for (var i = 0; i < script.enableObjects.length; i++) {
        if (script.enableObjects[i]) {
            script.enableObjects[i].enabled = false;
        }
    }

    print("Objects disabled");
}

//----------------------------------
//UPDATE
//----------------------------------

script.createEvent("UpdateEvent").bind(function(eventData) {

    var dt = eventData.getDeltaTime();

    var isLooking = isLookingAt();

    //triggers once when start looking happens
    if (isLooking && !hasTriggered) {

        enableObjects();

        hasTriggered = true;

        waitingToDisable = false;

        timer = 0;
    }

    //disables after some time
    if (waitingToDisable && script.autoDisable) {
        //print("Timer: " + timer);
        timer += dt;

        if (timer >= script.disableAfter) {
            
           

            disableObjects();

            hasTriggered = false;

            waitingToDisable = false;

            timer = 0;
        }
    }

    //retrigger when looking away
    if (!isLooking && hasTriggered && !waitingToDisable) {
      

        waitingToDisable = true;

        timer = 0;
    }
});