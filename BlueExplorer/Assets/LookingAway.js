//script to check if the user is looking at the target (fish) or looking away
//since the behaviour script with the lookat function wasn't customizable enough
//@input Component.ScriptComponent countdownScript

//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject
//@input SceneObject selectionObject
//@input SceneObject[] enableObjects
//@input SceneObject[] objectsToDisable

//@input vec3 selectionPosition {"label":"Selection Position"} //assigns vector of UI position in inspectpr

//@input float lookThreshold = 0.75   // relaxed from 0.9
//@input float loadTime = 3.0         // loading time

//all button loaders
//@input Component.ScriptComponent[] scriptsToEnable


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

function activateButton() {
     print("Loading complete");

            script.loadingObject.enabled = false;

            //moves selection object
            var selectionTransform = script.selectionObject.getTransform();
            selectionTransform.setLocalPosition(script.selectionPosition);
            
            //buttonloader
            for (var i = 0; i < script.scriptsToEnable.length; i++) {
                script.scriptsToEnable[i].enabled = true;
            }
           

            //
            for (var i = 0; i < script.enableObjects.length; i++) {
                if (script.enableObjects[i]) {
                    script.enableObjects[i].enabled = true;
                }
            }

            for (var i = 0; i < script.objectsToDisable.length; i++) {
                if (script.objectsToDisable[i]) {
                    script.objectsToDisable[i].enabled = false;
                }
            }
            
            script.selectionObject.enabled = true;
            script.countdownScript.disableText();
            


            isLoading = false;
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
           
            activateButton();
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

      
    } else {
        lookAwayTimer = 0;
    }

    wasLooking = isLooking;
    
});
script.activateButton = activateButton;