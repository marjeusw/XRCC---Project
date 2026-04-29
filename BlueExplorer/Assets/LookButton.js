//GazeButton.js

//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject
//@input SceneObject activatedObject
//@input SceneObject objectToDisable
//@input SceneObject objectToDisable2
//@input SceneObject objectToDisable3

//@input float lookThreshold = 0.9
//@input float loadTime = 1.0

var wasLooking = false;
var isLoading = false;
var loadTimer = 0;

//stability buffer
var lookAwayTimer = 0;
var lookAwayThreshold = 0.15;
var ownsCountdown = false;


//----------------------------------
// CHECK LOOKING
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
        countdownControllerButtons.startTimer();
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

            print("button activated");

            script.loadingObject.enabled = false;

            //disables old template
            if (script.objectToDisable) {
                script.objectToDisable.enabled = false;
                script.objectToDisable2.enabled = false;
                script.objectToDisable3.enabled = false;
            }
            
            //enables new template
            script.activatedObject.enabled = true;


            isLoading = false;
            ownsCountdown = false;
        }
    }


    // -------------------------
    // LOOK AWAY
    // -------------------------

    if (!isLooking) {

        lookAwayTimer += dt;
        
        if (ownsCountdown) { 
            countdownControllerButtons.stopTimer(); 
            ownsCountdown = false; 
            }

        if (lookAwayTimer >= lookAwayThreshold) {

            // reset loading ONLY if not activated yet
            if (!script.activatedObject.enabled) {

                script.loadingObject.enabled = false;

                isLoading = false;

                loadTimer = 0;
            }
        }

    } else {

        lookAwayTimer = 0;
    }

    wasLooking = isLooking;
});