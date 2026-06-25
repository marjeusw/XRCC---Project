//GazeButton.js

//@input Component.Camera camera
//@input SceneObject target

//@input SceneObject loadingObject
//@input SceneObject activatedObject

//@input SceneObject[] objectsToDisable
//@input SceneObject[] enableObjects
//@input Component.ScriptComponent[] scriptsToEnable
//@input Component.ScriptComponent[] disableScripts

//@input SceneObject arrowObject

//for material change
//@input SceneObject fish
//@input Asset.Material enabledMaterial
//@input Asset.Material disabledMaterial
//@input SceneObject organs

//@input float lookThreshold = 0.9
//@input float loadTime = 1.0
//@input Component.ScriptComponent countdownScript


//@input bool isLife = false 
//@input bool isInside = false
//@input bool isHome = false
//@input bool isOther = false
//@input bool showArrows = false //differentaites between play and main button and life, inside and home button (where multiple pages are needed)

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

   
        for (var i = 0; i < script.objectsToDisable.length; i++) {
            if (script.objectsToDisable[i]) {
                script.objectsToDisable[i].enabled = false;
            }
        }
        
      
        //change fish material
        var meshVisual =
            script.fish.getComponent("Component.RenderMeshVisual");

        if (meshVisual) {

            meshVisual.clearMaterials();
            meshVisual.addMaterial(script.enabledMaterial);
            print("changematerial");
        
        }

    //enable new template
    script.activatedObject.enabled = true;
    if (script.showArrows) {
        for (var i = 0; i < script.scriptsToEnable.length; i++) {
            script.scriptsToEnable[i].enabled = true;
        }
       
        if (script.isLife) {
            //print("LIFE BUTTON FIRED");
            global.currentMenu = "life";
            print("Current menu = LIFE");
            script.organs.enabled = false;
        }
        
        if(script.isInside){
            global.currentMenu = "inside";
            print("Current menu = INSIDE");
            script.organs.enabled = true;
        }

         if(script.isHome){
            global.currentMenu = "home";
            print("Current menu = HOME");
            script.organs.enabled = false;
        }

       
        // for (var i = 0; i < script.disableScripts.length; i++) {
        //     script.disableScripts[i].enabled = false;
        // }
        script.arrowObject.enabled = script.showArrows; //makes it dependent on inspector check if arrows shown

    } else {
        for (var i = 0; i < script.scriptsToEnable.length; i++) {
            if (script.scriptsToEnable[i]) {
                script.scriptsToEnable[i].enabled = false;
            }

             //turn off organs for other menus too
            if(script.isOther){
                print("Current menu = OTHER");
                script.organs.enabled = false;
            }
        }
        //don't really need dis one
        // for (var i = 0; i < script.disableScripts.length; i++) {
        //     if (script.disableScripts[i]) {
        //         script.disableScripts[i].enabled = false;
        //     }
        // }
        script.arrowObject.enabled = script.showArrows; //makes it dependent on inspector check if arrows shown
    }

     //in case objects (ecxept the main template since that needs to be checked for the loading to not appear when on it) need to be enabled
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