//@input SceneObject[] states
//@input Component.AnimationPlayer animPlayer

var currentState = 0;
// var clips = ["idle", "walk", "breathe", "eat"];

function setState(index)
{
    //print(global.behaviorSystem);
    for (var i = 0; i < script.states.length; i++)
    {
        script.states[i].enabled = (i == index);
    }

    currentState = index;
    // print("Trying to play: " + clipName);
    
    // var clipName = clips[index];

    // print("playing = " + clipName);

    
    //script.animPlayer.playClip(clipName);
}

function nextState()
{
    var next = currentState + 1;

    if (next >= script.states.length)
    {
        next = 0;
    }

    setState(next);
}

nextState();

script.createEvent("OnStartEvent").bind(function()
{
    setState(0);
    
});

global.behaviorSystem.addCustomTriggerResponse(
    "IdleFinished",
    function() {
        //print("IdleFinished received!");
        nextState();
    }
);

global.behaviorSystem.addCustomTriggerResponse(
    "WalkFinished",
    function() {
        nextState();
    }
);

global.behaviorSystem.addCustomTriggerResponse(
    "BreatheFinished",
    function() {
        nextState();
    }
);

global.behaviorSystem.addCustomTriggerResponse(
    "EatFinished",
    function() {
        nextState();
    }
);