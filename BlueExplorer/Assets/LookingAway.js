//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject
//@input SceneObject selectionObject

//@input float lookThreshold = 0.75   // relaxed from 0.9
//@input float loadTime = 3.0         // your desired loading time

print("Script started");

var wasLooking = false;
var isLoading = false;
var loadTimer = 0;

// NEW: buffer for gaze stability
var lookAwayTimer = 0;
var lookAwayThreshold = 0.2; // seconds

function isLookingAt() {
    var camTransform = script.camera.getTransform();
    var targetTransform = script.target.getTransform();

    var camPos = camTransform.getWorldPosition();
    var camForward = camTransform.forward;

    var targetPos = targetTransform.getWorldPosition();
    var dirToTarget = targetPos.sub(camPos).normalize();

    var dot = camForward.dot(dirToTarget);
    return dot > script.lookThreshold;
}

var event = script.createEvent("UpdateEvent");

event.bind(function(eventData) {
    var dt = eventData.getDeltaTime();
    var isLooking = isLookingAt();

    // -------------------------
    // START LOOKING
    // -------------------------
    if (!wasLooking && isLooking) {
        print("Started looking");

        script.loadingObject.enabled = true;
        script.selectionObject.enabled = false;

        isLoading = true;
        loadTimer = 0;
    }

    // -------------------------
    // LOADING PROGRESS
    // -------------------------
    if (isLooking && isLoading) {
        // keep loading visible
        script.loadingObject.enabled = true;

        loadTimer += dt;

        if (loadTimer >= script.loadTime) {
            print("Loading complete");

            script.loadingObject.enabled = false;
            script.selectionObject.enabled = true;

            isLoading = false;
        }
    }

    // -------------------------
    // LOOK AWAY (with buffer)
    // -------------------------
    if (!isLooking) {
        lookAwayTimer += dt;

        if (lookAwayTimer >= lookAwayThreshold && wasLooking) {
            print("Looked away");

            script.loadingObject.enabled = false;
            script.selectionObject.enabled = false;

            isLoading = false;
            loadTimer = 0;
        }
    } else {
        // reset buffer if still looking
        lookAwayTimer = 0;
    }

    wasLooking = isLooking;
});