//script to check if the user is looking at the target (fish) or looking away
//since the behaviour script with the lookat function wasn't customizable enough
//@input Component.ScriptComponent countdownScript

//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject
//@input SceneObject selectionObject
//@input SceneObject selectionNoMore //lights
//@input SceneObject fishCard //fishcard on top of fish 

//@input vec3 selectionPosition {"label":"Selection Position"} //assigns vector of UI position in inspectpr

//@input float lookThreshold = 0.75   // relaxed from 0.9
//@input float loadTime = 3.0         // loading time

//print("Script started");

var wasLooking = false;
var isLoading = false;
var loadTimer = 0;


//buffer for gaze stability
var lookAwayTimer = 0;
var lookAwayThreshold = 0.2; // seconds

function isLookingAt() {
    var camTransform = script.camera.getTransform();
    var targetTransform = script.target.getTransform();

    var camPos = camTransform.getWorldPosition();
    var camForward = camTransform.forward;

    var targetPos = targetTransform.getWorldPosition();
    var dirToTarget = targetPos.sub(camPos).normalize();

    var dot = camForward.dot(dirToTarget) * -1; //somehow flipped because camera in lensstudio is weird
    return dot > script.lookThreshold;
}

var event = script.createEvent("UpdateEvent");

event.bind(function(eventData) {
    var dt = eventData.getDeltaTime();
    var isLooking = isLookingAt();
    
    
    // -------------------------
    // START LOOKING
    // -------------------------
    if (!wasLooking && isLooking && !script.selectionObject.enabled) {
        print("Started looking");

        script.loadingObject.enabled = true;
        script.selectionObject.enabled = false;
        // script.selectionNoMore.enabled = true;
        // script.fishCard.enabled = false; //do this one when closing

        isLoading = true;
        loadTimer = 0;

        script.countdownScript.startTimer();

        
    }

    // -------------------------
    // LOADING PROGRESS
    // -------------------------
    if (isLooking && isLoading) {
        //keeps loading visible
        script.loadingObject.enabled = true;

        loadTimer += dt;

        if (loadTimer >= script.loadTime) {
            print("Loading complete");

            script.loadingObject.enabled = false;

            //moves selection object
            var selectionTransform = script.selectionObject.getTransform();
            selectionTransform.setLocalPosition(script.selectionPosition);
            
            script.selectionObject.enabled = true;
            script.selectionNoMore.enabled = false;
            script.fishCard.enabled = true;
            script.countdownScript.disableText();


            isLoading = false;
            
        }
        //so loading won't override already open UI
        if (script.selectionObject.enabled) {
            return;
        }
    }

    // -------------------------
    //LOOK AWAY (with buffer)
    // -------------------------
    if (!isLooking) {
        lookAwayTimer += dt;
        script.countdownScript.stopTimer();
        script.loadingObject.enabled = false;
        //script.selectionNoMore.enabled = true;

        
        //to test when ui closes that other stuff works again
        // if (lookAwayTimer >= lookAwayThreshold) { //for if the UI should be disabled after looking away
        //     if (isLoading || script.selectionObject.enabled) {
        //         print("Looked away");

        //         script.loadingObject.enabled = false;
        //         script.selectionObject.enabled = false;

        //         isLoading = false;
        //         loadTimer = 0;
        //     }
        // }
    } else {
        //reset buffer if still looking
        lookAwayTimer = 0;
    }

    wasLooking = isLooking;
    
});