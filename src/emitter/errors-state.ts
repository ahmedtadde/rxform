import stateStreamingFn from '@src/state/errors';
import { Emitter } from 'mitt';
export default (
  _: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  stateStreamingFn(emitter$, formOptions.errors);
  return emitter$;
};
