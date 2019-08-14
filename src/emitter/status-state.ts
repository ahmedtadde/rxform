import stateStreamingFn from "@src/state/status";
import { Emitter } from "mitt";
export default (_: HTMLFormElement, emitter$: Emitter, __: any): Emitter => {
  stateStreamingFn(emitter$);
  return emitter$;
};
