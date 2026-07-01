import { SIK } from 'SpectaclesInteractionKit.lspkg/SIK';
import { InteractorInputType } from 'SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor';
@component
export class ExampleHandScript extends BaseScriptComponent {
  onAwake() {
    this.createEvent('UpdateEvent').bind(() => {
      this.onUpdate();
    });
  }

  onUpdate() {
    // Retrieve InteractionManager from SIK's definitions.
    let interactionManager = SIK.InteractionManager;

    // Fetch the HandInteractor for left and right hands.
    let leftHandInteractor = interactionManager.getInteractorsByType(
      InteractorInputType.LeftHand
    )[0];
    let rightHandInteractor = interactionManager.getInteractorsByType(
      InteractorInputType.RightHand
    )[0];

    // Print the position and direction of the HandInteractors each frame.
    print(
      `The left hand interactor is at position: ${leftHandInteractor.startPoint} and is pointing in direction: ${leftHandInteractor.direction}.`
    );
    print(
      `The right hand interactor is at position: ${rightHandInteractor.startPoint} and is pointing in direction: ${rightHandInteractor.direction}.`
    );
  }
}