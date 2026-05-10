// CopyWorldTransform.js
// Event: Bind to 'Frame Updated'

//@input SceneObject headBindingSource
//@input bool copyPosition = false
//@input bool copyScale = false
//@input bool copyRotation = false

//offset
//@input vec3 positionOffset {"label":"Position Offset"}

script.createEvent("UpdateEvent").bind(function () {

    if (!script.headBindingSource) {
        return;
    }

    var sourceTransform =
        script.headBindingSource.getTransform();

    var myTransform =
        script.getTransform();

    if (script.copyPosition) {

        myTransform.setWorldPosition(
            sourceTransform.getWorldPosition().add(script.positionOffset)
        );
    }

    if (script.copyScale) {

        myTransform.setWorldScale(
            sourceTransform.getWorldScale()
        );
    }

    if (script.copyRotation) {

        myTransform.setWorldRotation(
            sourceTransform.getWorldRotation()
        );
    }

});