import stateStreamingFn from '@src/state/values';
import { Emitter } from 'mitt';
export default (
  _: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  stateStreamingFn(emitter$, formOptions.values);
  return emitter$;
};
