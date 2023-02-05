import { AmethystAudioNode, NodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystSpectrumNode extends AmethystAudioNode<AudioNode> {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    super(context.createGain(), "SapphireSpectrumNode", component, position);
  }

  public reset(){};
}
